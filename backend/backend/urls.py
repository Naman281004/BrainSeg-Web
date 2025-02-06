from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views import upload_file, processing_status, get_user_reports

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  
    path('api/upload/', upload_file, name='upload_file'),
    path('api/status/<int:upload_id>/', processing_status, name='processing_status'),
    path('api/reports/<str:user_id>/', get_user_reports, name='get_user_reports'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
