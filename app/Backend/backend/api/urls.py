from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    # path('register/', RegisterView.as_view()),
    # path("user/profile/", UserUpdateProfile.as_view(), name="user-profile"),
    # path("thoughts/", ThoughtsCreateListView.as_view(), name="thoughts-create-list"),
]
