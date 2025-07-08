#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# Create the target directory if it doesn't exist
MODEL_DIR="CODE_BRAINSEG/UNET_for_Multimodal_Semantic_Segmentation"
mkdir -p "$MODEL_DIR"

# Download model files using gdown
echo "Downloading model files..."
gdown --id 1hHqU4qf6lxbeyXWNEK6hFlONqqA8JntE -O "$MODEL_DIR/best_model.pth"
gdown --id 1OvFmdZXmB9s6f86bowy1vVn3FBQ52hwL -O "$MODEL_DIR/model_weights.pth"
echo "Model files downloaded successfully."

# Pre-build the matplotlib font cache to prevent worker timeouts
echo "Pre-building matplotlib font cache..."
python -c "import matplotlib.pyplot"
echo "Matplotlib font cache built."

python manage.py collectstatic --no-input
python manage.py migrate 