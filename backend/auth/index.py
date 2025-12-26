import json
import os
import hashlib
import time
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для регистрации и авторизации пользователей мессенджера"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token'
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
            
            if action == 'register':
                phone = body.get('phone', '').strip()
                name = body.get('name', '').strip()
                
                if not phone or not name:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Телефон и имя обязательны'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute("SELECT id FROM users WHERE phone = %s", (phone,))
                existing_user = cursor.fetchone()
                
                if existing_user:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь с таким телефоном уже существует'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    "INSERT INTO users (phone, name, is_online) VALUES (%s, %s, TRUE) RETURNING id, phone, name, avatar_url, bio, created_at",
                    (phone, name)
                )
                user = cursor.fetchone()
                conn.commit()
                
                token = hashlib.sha256(f"{user['id']}:{phone}:{time.time()}".encode()).hexdigest()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': dict(user),
                        'token': token
                    }, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                phone = body.get('phone', '').strip()
                
                if not phone:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Телефон обязателен'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    "SELECT id, phone, name, avatar_url, bio, created_at FROM users WHERE phone = %s",
                    (phone,)
                )
                user = cursor.fetchone()
                
                if not user:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь не найден'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    "UPDATE users SET is_online = TRUE, last_seen = CURRENT_TIMESTAMP WHERE id = %s",
                    (user['id'],)
                )
                conn.commit()
                
                token = hashlib.sha256(f"{user['id']}:{phone}:{time.time()}".encode()).hexdigest()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': dict(user),
                        'token': token
                    }, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'update_profile':
                user_id = body.get('user_id')
                name = body.get('name')
                bio = body.get('bio')
                avatar_url = body.get('avatar_url')
                
                if not user_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'user_id обязателен'}),
                        'isBase64Encoded': False
                    }
                
                updates = []
                params = []
                
                if name:
                    updates.append("name = %s")
                    params.append(name)
                if bio is not None:
                    updates.append("bio = %s")
                    params.append(bio)
                if avatar_url is not None:
                    updates.append("avatar_url = %s")
                    params.append(avatar_url)
                
                if updates:
                    params.append(user_id)
                    cursor.execute(
                        f"UPDATE users SET {', '.join(updates)} WHERE id = %s RETURNING id, phone, name, avatar_url, bio",
                        params
                    )
                    user = cursor.fetchone()
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'user': dict(user)}, default=str),
                        'isBase64Encoded': False
                    }
        
        elif method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('user_id')
            
            if user_id:
                cursor.execute(
                    "SELECT id, phone, name, avatar_url, bio, is_online, last_seen FROM users WHERE id = %s",
                    (user_id,)
                )
                user = cursor.fetchone()
                
                if user:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'user': dict(user)}, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь не найден'}),
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
