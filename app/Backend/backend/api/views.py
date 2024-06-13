from django.shortcuts import get_object_or_404, render
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    UpdateAPIView,
    RetrieveAPIView,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView  # type: ignore
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from django.db.models import Q
# Create your views here.

class RegisterView(APIView):
    def post(self,request):
        serializer=UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class UserUpdateProfile(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ThoughtsCreateListView(ListCreateAPIView):
    queryset = Thoughts.objects.all()
    serializer_class = ThoughtsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
    def get_serializer_context(self):
        return {'request': self.request}

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get(self, request, format=None):
        thoughts = Thoughts.objects.all()
        serialized_thoughts = []
        for thought in thoughts:
            profile_picture_url = None
            try:
                if thought.author.profile_picture:
                    profile_picture_url = request.build_absolute_uri(thought.author.profile_picture.url)
            except Exception as e:
                profile_picture_url = None

            is_liked = False
            if request.user.is_authenticated:
                is_liked = request.user in thought.likes.all()

            serialized_thought = {
                'id': thought.id,
                'title': thought.title,
                'content': thought.content,
                'created_at': thought.created_at,
                'author': {
                    'id': thought.author.id,
                    'username': thought.author.username,
                    'profile_picture': profile_picture_url
                },
                'likes_count': thought.get_total_likes(),
                'is_liked': is_liked
            }
            serialized_thoughts.append(serialized_thought)
        return Response(serialized_thoughts)

    
class LikeUnlikeThoughts(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        thought_id = request.data.get('thought_id')
        action = request.data.get('action')

        if thought_id and action:
            try:
                thought = Thoughts.objects.get(id=thought_id)
                user = request.user

                if action == 'like':
                    thought.likes.add(user)
                elif action == 'unlike':
                    thought.likes.remove(user)

                return Response(status=status.HTTP_200_OK)
            except Thoughts.DoesNotExist:
                return Response({'error': 'Thought not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
        
class CommentCreateView(ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes =  [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
class ThoughtDetailView(RetrieveAPIView):
    queryset = Thoughts.objects.all()
    serializer_class = ThoughtsSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        thought = self.get_object()
        profile_picture_url = None
        try:
            if thought.author.profile_picture:
                profile_picture_url = request.build_absolute_uri(thought.author.profile_picture.url)
        except Exception as e:
            profile_picture_url = None

        is_liked = False
        if request.user.is_authenticated:
            is_liked = request.user in thought.likes.all()
            
        # Fetching comments for the thought
        comments = thought.comments.all()
        serialized_comments = [
            {
                'id': comment.id,
                'content': comment.content,
                'created_at': comment.created_at,
                'author': {
                    'id': comment.author.id,
                    'username': comment.author.username,
                    'profile_picture': request.build_absolute_uri(comment.author.profile_picture.url) if comment.author.profile_picture else None
                }
            }
            for comment in comments
        ]

        serialized_thought = {
            'id': thought.id,
            'title': thought.title,
            'content': thought.content,
            'created_at': thought.created_at,
            'author': {
                'id': thought.author.id,
                'username': thought.author.username,
                'profile_picture': profile_picture_url
            },
            'likes_count': thought.get_total_likes(),
            'is_liked': is_liked,
            'comments': serialized_comments
        }
        return Response(serialized_thought)
    
class SendConnectionRequestView(generics.CreateAPIView):
    serializer_class = ConnectionRequestSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        from_user = request.user
        to_user_id = request.data.get('to_user')
        to_user = UserProfile.objects.get(id=to_user_id)
        if BlockedUser.objects.filter(user=to_user, blocked_user=from_user).exists():
            return Response({"detail": "You are blocked by this user."}, status=status.HTTP_403_FORBIDDEN)
        connection_request, created = ConnectionRequest.objects.get_or_create(from_user=from_user, to_user=to_user)
        if created:
            return Response({"detail": "Connection request sent."}, status=status.HTTP_201_CREATED)
        return Response({"detail": "Connection request already exists."}, status=status.HTTP_200_OK)

class HandleConnectionRequestView(generics.UpdateAPIView):
    serializer_class = ConnectionRequestSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        connection_request_id = request.data.get('request_id')
        action = request.data.get('action')
        connection_request = ConnectionRequest.objects.get(id=connection_request_id)
        if action == 'accept':
            Connection.objects.create(user1=connection_request.from_user, user2=connection_request.to_user)
            connection_request.delete()
            return Response({"detail": "Connection request accepted."}, status=status.HTTP_200_OK)
        elif action == 'reject':
            connection_request.delete()
            return Response({"detail": "Connection request rejected."}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

class BlockUserView(generics.CreateAPIView):
    serializer_class = BlockedUserSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        blocked_user_id = request.data.get('blocked_user')
        blocked_user = UserProfile.objects.get(id=blocked_user_id)
        BlockedUser.objects.get_or_create(user=user, blocked_user=blocked_user)
        ConnectionRequest.objects.filter(from_user=blocked_user, to_user=user).delete()
        ConnectionRequest.objects.filter(from_user=user, to_user=blocked_user).delete()
        return Response({"detail": "User blocked."}, status=status.HTTP_201_CREATED)
    
class PendingConnectionRequestsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        pending_requests = ConnectionRequest.objects.filter(to_user=user)
        serialized_requests = []
        
        for request in pending_requests:
            from_user_profile = request.from_user
            profile_picture_url = None
            
            try:
                if from_user_profile.profile_picture:
                    profile_picture_url = self.request.build_absolute_uri(from_user_profile.profile_picture.url)
            except Exception as e:
                profile_picture_url = None
            
            serialized_request = {
                'id': request.id,
                'from_user': {
                    'id': from_user_profile.id,
                    'username': from_user_profile.username,
                    'email': from_user_profile.email,
                    'profile_picture': profile_picture_url,
                },
                'timestamp': request.timestamp,
            }
            serialized_requests.append(serialized_request)
        
        return Response(serialized_requests)
    
class SpecificPendingRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, from_user_id, to_user_id):
        try:
            from_user_id = int(from_user_id)
            to_user_id = int(to_user_id)
        except ValueError:
            return Response({"error": "Invalid user ID format"}, status=400)


        pending_requests = ConnectionRequest.objects.filter(
            from_user__id=from_user_id, to_user__id=to_user_id
        )

        serialized_requests = []
        for request in pending_requests:
            from_user_profile = request.from_user
            profile_picture_url = None

            if from_user_profile.profile_picture:
                try:
                    profile_picture_url = self.request.build_absolute_uri(from_user_profile.profile_picture.url)
                except Exception as e:
                    profile_picture_url = None

            serialized_request = {
                'id': request.id,
                'from_user': {
                    'id': from_user_profile.id,
                    'username': from_user_profile.username,
                    'email': from_user_profile.email,
                    'profile_picture': profile_picture_url,
                },
                'timestamp': request.timestamp,
            }
            serialized_requests.append(serialized_request)

        return Response(serialized_requests)
    
class FriendsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        # Get connections where the user is either user1 or user2
        connections_as_user1 = Connection.objects.filter(user1=user)
        connections_as_user2 = Connection.objects.filter(user2=user)

        friends = set()
        
        for connection in connections_as_user1:
            friends.add(connection.user2)
        
        for connection in connections_as_user2:
            friends.add(connection.user1)
        
        serialized_friends = []
        
        for friend in friends:
            profile_picture_url = None
            try:
                if friend.profile_picture:
                    profile_picture_url = request.build_absolute_uri(friend.profile_picture.url)
            except Exception as e:
                profile_picture_url = None

            serialized_friend = {
                'id': friend.id,
                'username': friend.username,
                'email': friend.email,
                'profile_picture': profile_picture_url,
            }
            serialized_friends.append(serialized_friend)

        return Response(serialized_friends)
    
class CheckFriendshipView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user1_id, user2_id):
        are_friends = Connection.objects.filter(
            (Q(user1_id=user1_id) & Q(user2_id=user2_id)) |
            (Q(user1_id=user2_id) & Q(user2_id=user1_id))
        ).exists()

        return Response({'are_friends': are_friends})
    
class RemoveFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, friend_id, *args, **kwargs):
        user = request.user
        friend = get_object_or_404(UserProfile, id=friend_id)

        # Find and delete the connection
        connection = Connection.objects.filter(
            (Q(user1=user) & Q(user2=friend)) | (Q(user1=friend) & Q(user2=user))
        ).first()

        if connection:
            connection.delete()
            return Response({'detail': 'Friend removed successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Connection not found.'}, status=status.HTTP_404_NOT_FOUND)

    
class UserDetailsListView(generics.RetrieveAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
class SendMessageView(generics.CreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, recipient_id):
        recipient = UserProfile.objects.get(pk=recipient_id)
        messages = ChatMessage.objects.filter(
            (Q(sender=request.user) & Q(recipient=recipient)) | 
            (Q(sender=recipient) & Q(recipient=request.user))
        ).order_by('timestamp')
        
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)