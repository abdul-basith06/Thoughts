from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(UserProfile)
admin.site.register(Thoughts)
admin.site.register(Comment)
admin.site.register(ConnectionRequest)
admin.site.register(Connection)
admin.site.register(BlockedUser)