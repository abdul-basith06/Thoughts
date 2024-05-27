from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("api-auth/", include("rest_framework.urls")),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path('register/', RegisterView.as_view()),
    path("user/profile/", UserUpdateProfile.as_view(), name="user-profile"),
    path("thoughts/", ThoughtsCreateListView.as_view(), name="thoughts-create-list"),
    path("thoughts/<int:pk>/", ThoughtDetailView.as_view(), name="thought-detail"),
    path("like_unlike/", LikeUnlikeThoughts.as_view(), name="like-unlike-thoughts"),
    # path("comments/<int:pk>/"), FetchCommentsView.as_view(), name="fetch-comments"),
    path('comments/', CommentCreateView.as_view(), name='comment-create'),
]
