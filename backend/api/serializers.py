from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserUpload, ProcessedResult

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserUploadSerializer(serializers.ModelSerializer):
    results = serializers.JSONField(required=False)
    
    class Meta:
        model = UserUpload
        fields = ['id', 'batch_id', 'user_id', 'email', 'created_at', 'results', 'status', 'error_message']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.results:
            base_url = 'http://localhost:8000'  
            results = instance.results
            if 'static_image' in results and not results['static_image'].startswith('http'):

                results['static_image'] = base_url + results['static_image']
            if 'gif' in results and not results['gif'].startswith('http'):
                results['gif'] = base_url + results['gif']
            representation['results'] = results
        return representation

class ProcessedResultSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    
    class Meta:
        model = ProcessedResult
        fields = ['result_id', 'static_image', 'gif_animation', 'created_at', 'analysis_data']
        depth = 1  

