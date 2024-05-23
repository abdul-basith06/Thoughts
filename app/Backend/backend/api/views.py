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
    
class ThoughtsCreateListView(ListCreateAPIView) :
    queryset = Thoughts.objects.all()
    serializer_class = ThoughtsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
    def get(self, request, format=None):
        thoughts = Thoughts.objects.all()
        serialized_thoughts = []
        for thought in thoughts:
            serialized_thought = {
                'id': thought.id,
                'title': thought.title,
                'content': thought.content,
                'created_at': thought.created_at,
                'author': {
                    'id': thought.author.id,
                    'username': thought.author.username
                },
                'likes_count': thought.get_total_likes() 
            }
            serialized_thoughts.append(serialized_thought)
        return Response(serialized_thoughts)        