from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import UserUpload, ProcessedResult
from .serializers import UserUploadSerializer, ProcessedResultSerializer
import os
from django.conf import settings
from CODE_BRAINSEG.UNET_for_Multimodal_Semantic_Segmentation.process_files import process_brain_scans
from rest_framework_simplejwt.authentication import JWTAuthentication
from firebase_admin import auth
from django.core.cache import cache
import uuid
import threading
import time
from django.db import models



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


model = None

def load_model():
    global model
    if model is None:
        model = load_your_model()  
    return model

processing_queue = []
processing_lock = threading.Lock()

def background_processor():
    while True:
        with processing_lock:
            if processing_queue:
                task = processing_queue.pop(0)
                try:
           
                    output_dir = os.path.join(settings.MEDIA_ROOT, 'results', str(task['upload'].batch_id))
                    os.makedirs(output_dir, exist_ok=True)
                    
             
                    upload = task['upload']
                    upload.status = 'processing'
                    upload.save()
               
                    results = process_brain_scans(task['file_paths'], output_dir)
        
                    upload.results = results
                    upload.status = 'complete'
                    upload.save()
                except Exception as e:
                    print(f"Processing error: {str(e)}")
                    upload.status = 'failed'
                    upload.error_message = str(e)
                    upload.save()
        time.sleep(0.1)  

processor_thread = threading.Thread(target=background_processor, daemon=True)
processor_thread.start()

@api_view(['POST'])
@permission_classes([AllowAny])
def upload_file(request):
    try:
        batch_id = uuid.uuid4()
        
        files = request.FILES.getlist('nifti_files')
        user_id = request.data.get('user_id')
        email = request.data.get('email')

        print("\n=== Starting File Upload Processing ===")
        print(f"Number of files received: {len(files)}")
        print(f"User ID: {user_id}")
        print(f"Email: {email}")
        print(f"Files: {[f.name for f in files]}")

        if not all([files, user_id, email]):
            missing = []
            if not files: missing.append('files')
            if not user_id: missing.append('user_id')
            if not email: missing.append('email')
            return Response(
                {'error': f'Missing required fields: {", ".join(missing)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(files) != 4:
            return Response(
                {'error': f'Expected 4 files, got {len(files)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        results_dir = os.path.join(settings.MEDIA_ROOT, 'results')
        os.makedirs(results_dir, exist_ok=True)

        file_paths = []
        file_types = ['T1', 'T1c', 'T2', 'FLAIR']
        uploads = []
        
        try:
            for file, file_type in zip(files, file_types):
                print(f"Processing {file_type} file: {file.name}")
                upload = UserUpload.objects.create(
                    batch_id=batch_id,
                    user_id=user_id,
                    email=email,
                    nifti_file=file,
                    file_type=file_type
                )
                uploads.append(upload)
                file_paths.append(upload.nifti_file.path)
                print(f"Saved {file_type} file to: {upload.nifti_file.path}")
        except Exception as e:
            for upload in uploads:
                upload.delete()
            raise Exception(f"Error saving files: {str(e)}")

        with processing_lock:
            processing_queue.append({
                'file_paths': file_paths,
                'upload': uploads[0],  
                'output_dir': results_dir
            })
        
        return Response({
            'message': 'Processing started',
            'status_url': f'/api/status/{uploads[0].id}/'
        }, status=status.HTTP_202_ACCEPTED)

    except Exception as e:
        print("\n=== Error in upload_file ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {str(e)}")
        import traceback
        print(f"Full traceback:\n{traceback.format_exc()}")
        return Response(
            {'error': f'Processing failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def processing_status(request, upload_id):
    try:
        upload = UserUpload.objects.get(id=upload_id)
        return Response({
            'status': upload.status,
            'result': upload.results,
            'error': upload.error_message if hasattr(upload, 'error_message') else None
        })
    except UserUpload.DoesNotExist:
        return Response({'error': 'Upload not found'}, status=404)

@api_view(['GET'])
def get_results(request, user_id):
    try:
        uploads = UserUpload.objects.filter(user_id=user_id)
        serializer = UserUploadSerializer(uploads, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_reports(request, user_id):
    try:
        print(f"\n=== Fetching Reports ===")
        print(f"User ID: {user_id}")
        
        unique_batches = UserUpload.objects.filter(
            user_id=user_id,
            results__isnull=False,
            status='complete'
        ).values('batch_id').annotate(
            latest_created=models.Max('created_at')
        ).order_by('-latest_created')
        
        reports = []
        seen_batches = set()  
        
        for batch in unique_batches:
            batch_id = batch['batch_id']
            if batch_id not in seen_batches:
                report = UserUpload.objects.filter(
                    batch_id=batch_id,
                    user_id=user_id,
                    results__isnull=False,
                    status='complete'
                ).order_by('-created_at').first()
                
                if report and report.results:
                    reports.append(report)
                    seen_batches.add(batch_id)
        
        print(f"Found {len(reports)} unique reports")
        
        serializer = UserUploadSerializer(reports, many=True)
        return Response(serializer.data)
        
    except Exception as e:
        print(f"Error fetching reports: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

