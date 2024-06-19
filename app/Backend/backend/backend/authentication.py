# backend/authentication.py

from urllib.parse import parse_qs
from django.conf import settings
import jwt
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from api.models import UserProfile

@database_sync_to_async
def get_user(token):
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
        return UserProfile.objects.get(pk=user_id)
    except (jwt.ExpiredSignatureError, jwt.DecodeError, UserProfile.DoesNotExist):
        return None

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        token = parse_qs(query_string).get('token')
        if token:
            token = token[0]
            scope['user'] = await get_user(token)
        return await super().__call__(scope, receive, send)
