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
            request = self.context.get('request')
            base_url = request.build_absolute_uri('/')[:-1] if request else ''
            results = instance.results
            if 'static_image' in results and results.get('static_image', '').startswith('/media'):
                results['static_image'] = base_url + results['static_image']
            if 'gif' in results and results.get('gif', '').startswith('/media'):
                results['gif'] = base_url + results['gif']
            representation['results'] = results
        return representation

class ProcessedResultSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    
    class Meta:
        model = ProcessedResult
        fields = ['result_id', 'static_image', 'gif_animation', 'created_at', 'analysis_data']
        depth = 1  

