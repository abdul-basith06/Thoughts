from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from django.db.models import Q
from api.models import UserProfile, ChatMessage, ChatRoom
from api.serializers import ChatMessageSerializer

class PersonalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.friend_id = str(self.scope['url_route']['kwargs']['room_id'])
        self.room_name = await self.get_or_create_chat_room(self.scope['user'].id, self.friend_id)
        self.room_group_name = f'chat_{self.room_name}'

        print(self.room_name, "----<<<<<<<<<room_name-----------------------")
        print(self.room_group_name, "----<<<<<<<<<room_group_name----------------")

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
        try:
            chat_room = ChatRoom.objects.get(id=room_name)
            chat_message = ChatMessage.objects.create(sender=sender, chat_room=chat_room, message=message)
            return chat_message  # Return the created ChatMessage instance if needed
        except UserProfile.DoesNotExist:
            print(f"Error: UserProfile does not exist for sender {sender.id}")
        except Exception as e:
            print(f"Error saving message: {str(e)}")

    @database_sync_to_async
    def get_or_create_chat_room(self, user_id, friend_id):
        try:
            user_profile = UserProfile.objects.get(id=user_id)
            friend_profile = UserProfile.objects.get(id=friend_id)
            chat_room, created = ChatRoom.objects.get_or_create(participants__in=[user_profile, friend_profile], defaults={})
            chat_room.participants.add(user_profile, friend_profile)
            return chat_room.id
        except UserProfile.DoesNotExist:
            print(f"Error: UserProfile does not exist for user {user_id} or friend {friend_id}")
            return None

    @database_sync_to_async
    def get_message_history(self):
        room_name = self.room_name
        try:
            chat_room = ChatRoom.objects.get(id=room_name)
        except ChatRoom.DoesNotExist:
            return []

        messages = ChatMessage.objects.filter(chat_room=chat_room).order_by('timestamp')

        serializer = ChatMessageSerializer(messages, many=True)
        return serializer.data

    async def send_message_history(self):
        # Retrieve message history from the database
        messages = await self.get_message_history()

        # Send message history to WebSocket
        for message in messages:
            await self.send(text_data=json.dumps({
                'message': message['message'],
                'sender': message['sender']['username']
            }))











# from channels.generic.websocket import AsyncWebsocketConsumer
# import json
# from channels.db import database_sync_to_async
# from django.db.models import Q
# from api.models import *
# from api.serializers import ChatMessageSerializer


# class PersonalChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = str(self.scope['url_route']['kwargs']['room_id'])
#         self.room_group_name = f'chat_{self.room_name}'

#         print(self.room_name, "----<<<<<<<<<room_name-----------------------")
#         print(self.room_group_name, "----<<<<<<<<<room_group_name----------------")

#         # Join room group
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )
#         await self.accept()

#         # Send message history to the connected user
#         await self.send_message_history()

#     async def disconnect(self, close_code):
#         # Leave room group
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         try:
#             text_data_json = json.loads(text_data)
#             message = text_data_json['message']
#             sender = self.scope['user']

#             # Save the message to the database
#             await self.save_message(sender, self.room_name, message)
#         except json.JSONDecodeError:
#             # Handle JSON decoding error gracefully
#             message = "Invalid message format"

#         # Send message to room group
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message,
#                 'sender': sender.username
#             }
#         )


#     async def chat_message(self, event):
#         message = event['message']
#         sender = event['sender']

#         # Send message to WebSocket
#         await self.send(text_data=json.dumps({
#             'message': message,
#             'sender': sender
#         }))

#     @database_sync_to_async
#     def save_message(self, sender, room_name, message):
#         try:
#             chat_room = ChatRoom.objects.get(id=room_name)
#             chat_message = ChatMessage.objects.create(sender=sender, chat_room=chat_room, message=message)
#             return chat_message  # Return the created ChatMessage instance if needed
#         except ChatRoom.DoesNotExist:
#             print(f"Error: ChatRoom does not exist for room {room_name}")
#         except Exception as e:
#             print(f"Error saving message: {str(e)}")






#     @database_sync_to_async
#     def get_receiver(self, room_name):
#         try:
#             user1_id, user2_id = map(int, room_name.split('_'))
#             if self.scope['user'].id == user1_id:
#                 return UserProfile.objects.get(id=user2_id)
#             else:
#                 return UserProfile.objects.get(id=user1_id)
#         except (ValueError, UserProfile.DoesNotExist):
#             return None


#     async def send_message_history(self):
#         # Retrieve message history from the database
#         messages = await self.get_message_history()

#         # Send message history to WebSocket
#         for message in messages:
#             await self.send(text_data=json.dumps({
#                 'message': message['message'],
#                 'sender': message['sender']['username']
#             }))

#     @database_sync_to_async
#     def get_message_history(self):
#         room_name = self.room_name
#         try:
#             chat_room = ChatRoom.objects.get(id=room_name)
#         except ChatRoom.DoesNotExist:
#             return []

#         messages = ChatMessage.objects.filter(chat_room=chat_room).order_by('timestamp')
#         serializer = ChatMessageSerializer(messages, many=True)
#         return serializer.data

