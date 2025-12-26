import json
import os
import base64
import uuid
import boto3
from datetime import datetime

def handler(event: dict, context) -> dict:
    """API для загрузки файлов (аватары, голосовые сообщения, изображения, видео)"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        file_data = body.get('file_data')
        file_name = body.get('file_name', 'file')
        file_type = body.get('file_type', 'application/octet-stream')
        folder = body.get('folder', 'files')
        
        if not file_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'file_data обязателен (base64)'}),
                'isBase64Encoded': False
            }
        
        try:
            file_bytes = base64.b64decode(file_data)
        except Exception:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный формат base64'}),
                'isBase64Encoded': False
            }
        
        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        ext = file_name.split('.')[-1] if '.' in file_name else 'bin'
        unique_name = f"{uuid.uuid4()}.{ext}"
        key = f"{folder}/{unique_name}"
        
        s3.put_object(
            Bucket='files',
            Key=key,
            Body=file_bytes,
            ContentType=file_type
        )
        
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'url': cdn_url,
                'file_name': unique_name,
                'file_size': len(file_bytes)
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
