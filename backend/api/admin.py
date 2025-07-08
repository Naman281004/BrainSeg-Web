from django.contrib import admin
from django.utils.html import format_html
from .models import UserUpload

@admin.register(UserUpload)
class UserUploadAdmin(admin.ModelAdmin):
    list_display = ['email', 'user_id', 'created_at', 'file_type']
    list_filter = ['email', 'user_id', 'created_at', 'file_type']
    search_fields = ['email', 'user_id']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def file_link(self, obj):
        if obj.nifti_file:
            return format_html('<a href="{}">{}</a>', obj.nifti_file.url, obj.nifti_file.name)
        return "No file"
    file_link.short_description = 'File'

    fieldsets = (
        ('User Information', {
            'fields': ('user_id', 'email')
        }),
        ('File', {
            'fields': ('nifti_file', 'file_link')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )
