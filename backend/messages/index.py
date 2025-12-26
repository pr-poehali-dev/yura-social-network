import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для работы с сообщениями, чатами и контактами"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'send_message':
                chat_id = body.get('chat_id')
                sender_id = body.get('sender_id')
                content = body.get('content', '')
                message_type = body.get('message_type', 'text')
                file_url = body.get('file_url')
                file_name = body.get('file_name')
                file_size = body.get('file_size')
                duration = body.get('duration')
                reply_to_id = body.get('reply_to_id')
                
                if not chat_id or not sender_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'chat_id и sender_id обязательны'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    """INSERT INTO messages (chat_id, sender_id, content, message_type, file_url, file_name, file_size, duration, reply_to_id)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                       RETURNING id, chat_id, sender_id, content, message_type, file_url, file_name, file_size, duration, created_at, is_read, reply_to_id""",
                    (chat_id, sender_id, content, message_type, file_url, file_name, file_size, duration, reply_to_id)
                )
                message = cursor.fetchone()
                
                cursor.execute("UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = %s", (chat_id,))
                conn.commit()
                
                cursor.execute("SELECT name, avatar_url FROM users WHERE id = %s", (sender_id,))
                sender = cursor.fetchone()
                
                result = dict(message)
                if sender:
                    result['sender_name'] = sender['name']
                    result['sender_avatar'] = sender['avatar_url']
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': result}, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'create_chat':
                user_id = body.get('user_id')
                participant_ids = body.get('participant_ids', [])
                is_group = body.get('is_group', False)
                name = body.get('name')
                
                if not user_id or not participant_ids:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'user_id и participant_ids обязательны'}),
                        'isBase64Encoded': False
                    }
                
                if not is_group and len(participant_ids) == 1:
                    cursor.execute(
                        """SELECT c.id FROM chats c
                           JOIN chat_participants cp1 ON c.id = cp1.chat_id AND cp1.user_id = %s
                           JOIN chat_participants cp2 ON c.id = cp2.chat_id AND cp2.user_id = %s
                           WHERE c.is_group = FALSE
                           GROUP BY c.id
                           HAVING COUNT(DISTINCT cp1.user_id) = 2""",
                        (user_id, participant_ids[0])
                    )
                    existing_chat = cursor.fetchone()
                    
                    if existing_chat:
                        return {
                            'statusCode': 200,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'chat_id': existing_chat['id']}),
                            'isBase64Encoded': False
                        }
                
                cursor.execute(
                    "INSERT INTO chats (name, is_group) VALUES (%s, %s) RETURNING id",
                    (name, is_group)
                )
                chat = cursor.fetchone()
                chat_id = chat['id']
                
                all_participants = [user_id] + participant_ids
                for idx, pid in enumerate(all_participants):
                    cursor.execute(
                        "INSERT INTO chat_participants (chat_id, user_id, is_admin) VALUES (%s, %s, %s)",
                        (chat_id, pid, idx == 0)
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'chat_id': chat_id}),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {})
            action = params.get('action')
            
            if action == 'get_chats':
                user_id = params.get('user_id')
                
                if not user_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'user_id обязателен'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    """SELECT c.id, c.name, c.is_group, c.avatar_url, c.updated_at,
                              (SELECT content FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
                              (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
                              (SELECT COUNT(*) FROM messages WHERE chat_id = c.id AND is_read = FALSE AND sender_id != %s) as unread_count,
                              (SELECT COUNT(*) FROM chat_participants WHERE chat_id = c.id) as participants_count
                       FROM chats c
                       JOIN chat_participants cp ON c.id = cp.chat_id
                       WHERE cp.user_id = %s
                       ORDER BY c.updated_at DESC""",
                    (user_id, user_id)
                )
                chats = cursor.fetchall()
                
                result = []
                for chat in chats:
                    chat_dict = dict(chat)
                    
                    if not chat_dict['is_group']:
                        cursor.execute(
                            """SELECT u.id, u.name, u.avatar_url, u.is_online
                               FROM users u
                               JOIN chat_participants cp ON u.id = cp.user_id
                               WHERE cp.chat_id = %s AND u.id != %s
                               LIMIT 1""",
                            (chat_dict['id'], user_id)
                        )
                        other_user = cursor.fetchone()
                        if other_user:
                            chat_dict['name'] = other_user['name']
                            chat_dict['avatar_url'] = other_user['avatar_url']
                            chat_dict['is_online'] = other_user['is_online']
                    
                    result.append(chat_dict)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'chats': result}, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_messages':
                chat_id = params.get('chat_id')
                limit = int(params.get('limit', 50))
                offset = int(params.get('offset', 0))
                
                if not chat_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'chat_id обязателен'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    """SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
                       FROM messages m
                       JOIN users u ON m.sender_id = u.id
                       WHERE m.chat_id = %s
                       ORDER BY m.created_at DESC
                       LIMIT %s OFFSET %s""",
                    (chat_id, limit, offset)
                )
                messages = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'messages': [dict(m) for m in reversed(messages)]}, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_contacts':
                user_id = params.get('user_id')
                
                if not user_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'user_id обязателен'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    """SELECT DISTINCT u.id, u.name, u.phone, u.avatar_url, u.is_online, u.last_seen
                       FROM users u
                       WHERE u.id != %s
                       ORDER BY u.name""",
                    (user_id,)
                )
                contacts = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'contacts': [dict(c) for c in contacts]}, default=str),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный запрос'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
