import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from channels.db import database_sync_to_async
from api.models import UserProfile

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            # Split the token prefix and the actual token
            prefix, token = auth_header.split()
            if prefix.lower() != 'bearer':
                raise AuthenticationFailed('Invalid token prefix')

            # Decode the token using the secret key
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get('user_id')
            user = UserProfile.objects.get(pk=user_id)
        except (jwt.ExpiredSignatureError):
            raise AuthenticationFailed('Token has expired')
        except (jwt.DecodeError):
            raise AuthenticationFailed('Error decoding token')
        except (UserProfile.DoesNotExist):
            raise AuthenticationFailed('No user matching this token was found')

        return (user, None)

    async def authenticate_websocket(self, scope, token):
        try:
            # Decode the token using the secret key
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get('user_id')
            user = await database_sync_to_async(UserProfile.objects.get)(pk=user_id)
        except (jwt.ExpiredSignatureError):
            return None  # Token has expired
        except (jwt.DecodeError):
            return None  # Error decoding token
        except (UserProfile.DoesNotExist):
            return None  # No user matching this token was found
        return user
