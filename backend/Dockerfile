# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
# We copy the requirements file first to leverage Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Download the model file using gdown
# This runs during the build process on Hugging Face
RUN gdown '1OvFmdZXmB9s6f86bowy1vVn3FBQ52hwL' -O CODE_BRAINSEG/UNET_for_Multimodal_Semantic_Segmentation/model_weights.pth

# Expose port 8000
EXPOSE 8000

# Run the application
# We use --workers=1 to conserve memory, even with 16GB available it's good practice
# We bind to 0.0.0.0 to allow external connections
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers=1"] 