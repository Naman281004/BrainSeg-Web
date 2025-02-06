from django.db import models
import uuid
import os
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import JSONField

def validate_nifti(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.nii', '.gz']
    if not any(ext.endswith(x) for x in valid_extensions):
        raise ValidationError('File must be a NIfTI file (.nii or .nii.gz)')

class UserUpload(models.Model):
    STATUS_CHOICES = [
        ('uploaded', 'Uploaded'),
        ('processing', 'Processing'),
        ('analyzing', 'Analyzing'),
        ('complete', 'Complete'),
        ('failed', 'Failed'),
    ]
    
    batch_id = models.CharField(max_length=36, default=uuid.uuid4, editable=False)

    def get_upload_path(instance, filename):
        ext = filename.split('.')[-1]
        new_filename = f"{uuid.uuid4()}.{ext}"
        return os.path.join('uploads', new_filename)

    user_id = models.CharField(max_length=255)
    email = models.EmailField()
    nifti_file = models.FileField(
        upload_to='uploads/',
        validators=[validate_nifti],
        help_text='Upload NIfTI files only (.nii or .nii.gz)',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    results = models.JSONField(null=True, blank=True)
    file_type = models.CharField(max_length=10, null=True, blank=True)
    status = models.CharField(
        max_length=100,
        choices=STATUS_CHOICES,
        default='uploaded'
    )
    error_message = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user_id', '-created_at'], name='user_created_idx'),
            models.Index(fields=['created_at'], name='created_at_idx'),
        ]

    def __str__(self):
        return f"{self.email} - {self.created_at}"

class ProcessedResult(models.Model):
    result_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(UserUpload, on_delete=models.CASCADE)
    static_image = models.CharField(max_length=500)
    gif_animation = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    analysis_data = models.JSONField()

    class Meta:
        indexes = [
            models.Index(fields=['result_id'], name='result_id_idx'),
            models.Index(fields=['user'], name='user_idx'),
        ]
