from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('user/register/', views.CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('upload/', views.upload_file, name='upload_file'),
    path('status/<int:upload_id>/', views.processing_status, name='processing_status'),
    path('reports/<str:user_id>/', views.get_user_reports, name='get_user_reports'),
] 