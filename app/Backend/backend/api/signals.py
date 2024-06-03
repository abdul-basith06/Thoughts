from django.db.models.signals import post_delete
from django.db.models import Q
from .models import *
from django.dispatch import receiver

@receiver(post_delete, sender=UserProfile)
def delete_related_connections(sender, instance, **kwargs):
    Connection.objects.filter(Q(user1=instance) | Q(user2=instance)).delete()
    ConnectionRequest.objects.filter(Q(from_user=instance) | Q(to_user=instance)).delete()
    BlockedUser.objects.filter(Q(user=instance) | Q(blocked_user=instance)).delete()
