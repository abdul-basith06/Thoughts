from django.db import models
from django.contrib.auth.models import AbstractUser

class UserProfile(AbstractUser):
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True, null=True, blank=True)
    mobile = models.CharField(max_length=15, null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
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