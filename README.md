# BrainSeg

## Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Naman281004/BrainSeg.git
cd brainseg
```

### 2. Download Model Files
Download these model files from Google Drive and place them in `backend/CODE_BRAINSEG/UNET_for_Multimodal_Semantic_Segmentation/`:
- [best_model.pth](https://drive.google.com/file/d/1hHqU4qf6lxbeyXWNEK6hFlONqqA8JntE/view?usp=drive_link)
- [model_weights.pth](https://drive.google.com/file/d/1OvFmdZXmB9s6f86bowy1vVn3FBQ52hwL/view?usp=drive_link)

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create a .env file in the root directory and add Firebase credentials
# VITE_FIREBASE_API_KEY=xxx
# VITE_FIREBASE_AUTH_DOMAIN=xxx
# etc...

npm run dev
```

### 4. Backend Setup
```bash
cd backend
python -m venv env
source env\Scripts\activate     # On Windows
deactivate                     # to deactivate the virtual environment
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```



From the Test/Test_Data/ upload the 4 nifti files of any of the 24 samples to see the generated segmentation
