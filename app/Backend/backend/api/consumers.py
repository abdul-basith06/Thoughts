from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async

from django.db.models import Q
from api.models import UserProfile, Message
from api.serializers import MessageSerializer


class PersonalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Send message history to the connected user
        await self.send_message_history()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            sender = self.scope['user']

            # Save the message to the database
            await self.save_message(sender, self.room_name, message)
        except json.JSONDecodeError:
            # Handle JSON decoding error gracefully
            message = "Invalid message format"

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender.username
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))

    @database_sync_to_async
    def save_message(self, sender, room_name, message):
        receiver = self.get_receiver(room_name)
        if receiver:
            Message.objects.create(sender=sender, receiver=receiver, content=message)

    @database_sync_to_async
    def get_receiver(self, room_name):
        # Extract the receiver's user ID from the room name
        try:
            user1_id, user2_id = map(int, room_name.split('_'))
            if self.scope['user'].id == user1_id:
                return UserProfile.objects.get(id=user2_id)
            else:
                return UserProfile.objects.get(id=user1_id)
        except (ValueError, UserProfile.DoesNotExist):
            return None

    async def send_message_history(self):
        # Retrieve message history from the database
        messages = await self.get_message_history()

        # Send message history to WebSocket
        for message in messages:
            await self.send(text_data=json.dumps({
                'message': message['content'],
                'sender': message['sender']['username']
            }))

    @database_sync_to_async
    def get_message_history(self):
        room_name = self.room_name
        user1_id, user2_id = map(int, room_name.split('_'))
        messages = Message.objects.filter(
            (Q(sender_id=user1_id) & Q(receiver_id=user2_id)) |
            (Q(sender_id=user2_id) & Q(receiver_id=user1_id))
        ).order_by('timestamp')

        serializer = MessageSerializer(messages, many=True)
        return serializer.data
