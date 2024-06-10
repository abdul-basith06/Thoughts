from django.urls import path
from .consumers import *

websocket_urlpatterns = [
    path('ws/chat', PersonalChatConsumer.as_asgi())
]