from django.db import models
from django.contrib.auth.models import AbstractUser

class UserProfile(AbstractUser):
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True, null=True, blank=True)
    mobile = models.CharField(max_length=15, null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    connections = models.ManyToManyField('self', through='Connection', symmetrical=False, related_name='connected_to')
    
class ConnectionRequest(models.Model):
    from_user = models.ForeignKey(UserProfile, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(UserProfile, related_name='received_requests', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')
        indexes = [
            models.Index(fields=['from_user']),
            models.Index(fields=['to_user']),
        ]

class Connection(models.Model):
    user1 = models.ForeignKey(UserProfile, related_name='connections1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(UserProfile, related_name='connections2', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user1', 'user2')
        indexes = [
            models.Index(fields=['user1']),
            models.Index(fields=['user2']),
        ]

class BlockedUser(models.Model):
    user = models.ForeignKey(UserProfile, related_name='blocker', on_delete=models.CASCADE)
    blocked_user = models.ForeignKey(UserProfile, related_name='blocked', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'blocked_user')
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['blocked_user']),
        ]
    
class Thoughts(models.Model):
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="thoughts", null=True, blank=True)
    likes = models.ManyToManyField(UserProfile, related_name="liked_thoughts", blank=True)

    def get_total_likes(self):
        return self.likes.count()

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at'] 
        
class Comment(models.Model):
    content = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="comments")
    thought = models.ForeignKey(Thoughts, on_delete=models.CASCADE, related_name="comments")

    def __str__(self):
        return self.content[:20]
    
class ChatRoom(models.Model):
    participants = models.ManyToManyField(UserProfile, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatRoom {self.id}"

class ChatMessage(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(UserProfile, related_name='sent_messages', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f'{self.sender} in room {self.chat_room.id}: {self.message[:20]}'
    
# class ChatMessage(models.Model):
#     sender = models.ForeignKey(UserProfile, related_name='sent_messages', on_delete=models.CASCADE)
#     recipient = models.ForeignKey(UserProfile, related_name='received_messages', on_delete=models.CASCADE)
#     message = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['timestamp']

#     def __str__(self):
#         return f'{self.sender} to {self.recipient}: {self.message[:20]}'