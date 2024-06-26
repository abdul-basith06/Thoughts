from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("api-auth/", include("rest_framework.urls")),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path('register/', RegisterView.as_view()),
    path("user/profile/", UserUpdateProfile.as_view(), name="user-profile"),
    path("user/details/<int:pk>/", UserDetailsListView.as_view(), name="user-details"),
    path("thoughts/", ThoughtsCreateListView.as_view(), name="thoughts-create-list"),
    path("thoughts/<int:pk>/", ThoughtDetailView.as_view(), name="thought-detail"),
    path("like_unlike/", LikeUnlikeThoughts.as_view(), name="like-unlike-thoughts"),
    # path("comments/<int:pk>/"), FetchCommentsView.as_view(), name="fetch-comments"),
    path('comments/', CommentCreateView.as_view(), name='comment-create'),
    
    # Connection urls
    path('connections/send/', SendConnectionRequestView.as_view(), name='send-connection-request'),
    path('connections/pending/', PendingConnectionRequestsView.as_view(), name='pending-connection-requests'),  
    path('connections/pending/<int:from_user_id>/<int:to_user_id>/', SpecificPendingRequestsView.as_view(), name='specific-pending-requests'),
    path('connections/handle/', HandleConnectionRequestView.as_view(), name='handle-connection-request'),
    path('connections/friends/', FriendsListView.as_view(), name='friends-list'),
    path('connections/check_friendship/<int:user1_id>/<int:user2_id>/', CheckFriendshipView.as_view(), name='check-friendship'),
    path('connections/remove_friend/<int:friend_id>/', RemoveFriendView.as_view(), name='remove_friend'),
    path('connections/block/', BlockUserView.as_view(), name='block-user'),
    
    # Chat feature URLs
    path('chat/rooms/', ChatRoomListView.as_view(), name='chat-room-list'),
    path('chat/room/<int:room_id>/', ChatRoomDetailView.as_view(), name='chat-room-detail'),
    path('chat/room/<int:room_id>/messages/', ChatMessagesView.as_view(), name='chat-messages'),
    path('chat/room/<int:room_id>/send/', SendMessageView.as_view(), name='send-message'),
]
