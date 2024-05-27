from django.shortcuts import render
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
            # 'comments': [
            #     {
            #         'id': comment.id,
            #         'content': comment.content,
            #         'created_at': comment.created_at,
            #         'author': {
            #             'id': comment.author.id,
            #             'username': comment.author.username,
            #             'profile_picture': request.build_absolute_uri(comment.author.profile_picture.url) if comment.author.profile_picture else None,
            #         }
            #     } for comment in thought.comments.all()
            # ]
        }
        return Response(serialized_thought)