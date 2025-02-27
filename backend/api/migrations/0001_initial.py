# Generated by Django 5.1.5 on 2025-02-04 01:03

import api.models
import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserUpload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('batch_id', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('user_id', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('nifti_file', models.FileField(blank=True, help_text='Upload NIfTI files only (.nii or .nii.gz)', null=True, upload_to=api.models.UserUpload.get_upload_path, validators=[api.models.validate_nifti])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('results', models.JSONField(blank=True, null=True)),
                ('file_type', models.CharField(blank=True, max_length=10, null=True)),
            ],
            options={
                'ordering': ['-created_at'],
                'indexes': [models.Index(fields=['user_id', '-created_at'], name='user_created_idx'), models.Index(fields=['created_at'], name='created_at_idx')],
            },
        ),
        migrations.CreateModel(
            name='ProcessedResult',
            fields=[
                ('result_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('static_image', models.CharField(max_length=500)),
                ('gif_animation', models.CharField(max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('analysis_data', models.JSONField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.userupload')),
            ],
            options={
                'indexes': [models.Index(fields=['result_id'], name='result_id_idx'), models.Index(fields=['user'], name='user_idx')],
            },
        ),
    ]
