import jwt
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from backend.settings import SECRET_KEY
from api.models import UserProfile
from channels.middleware import BaseMiddleware
from rest_framework.exceptions import AuthenticationFailed
from django.db import close_old_connections

@database_sync_to_async
def get_user_from_token(token):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token['user_id']
        user = UserProfile.objects.get(pk=user_id)
    except (UserProfile.DoesNotExist, jwt.ExpiredSignatureError, jwt.DecodeError):
        user = AnonymousUser()
    return user

class JWTWebsocketMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        
        query_string = scope.get("query_string", b"").decode("utf-8")
        query_parameters = dict(qp.split("=") for qp in query_string.split("&"))
        token = query_parameters.get("token", None)
        
        if token is None:
            await send({
                "type": "websocket.close",
                "code": 4000
            })
            return  # Return early if no token is provided

        user = await get_user_from_token(token)
        if not isinstance(user, AnonymousUser):
            scope['user'] = user
            return await super().__call__(scope, receive, send)
        else:
            await send({
                "type": "websocket.close",
                "code": 4000,
            })
