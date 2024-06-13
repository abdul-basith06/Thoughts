from rest_framework import serializers
from api.models import *    
 
 
class UserSerializer(serializers.ModelSerializer): 
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        
    def get_profile_picture(self, obj):
        request = self.context.get('request')
        try:
            if obj.profile_picture:
                return request.build_absolute_uri(obj.profile_picture.url)
        except Exception as e:
            return None
        return None
        
    def create(self, validated_data):
        password=validated_data.pop('password',None)
        instance=self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()    
        return instance     
    
class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    
    class Meta:
        model = Comment
        fields = '__all__'
        
class ThoughtsSerializer(serializers.ModelSerializer):
    
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Thoughts
        fields = '__all__'
        
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
    
class ConnectionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectionRequest
        fields = '__all__'

class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = '__all__'

class BlockedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedUser
        fields = '__all__'
        
class ChatMessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source='sender.username')
    recipient = serializers.ReadOnlyField(source='recipient.username')

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'recipient', 'message', 'timestamp']
    
