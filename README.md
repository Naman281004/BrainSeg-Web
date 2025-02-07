# BrainSeg

## Quick Start Guide

### 1. Clone the Repository
```
git clone https://github.com/Naman281004/BrainSeg.git
cd BrainSeg-Web
```

### 2. Download Model Files
Download these model files from Google Drive and place them in `backend/CODE_BRAINSEG/UNET_for_Multimodal_Semantic_Segmentation/`:
best_model.pth
Link: https://drive.google.com/file/d/1hHqU4qf6lxbeyXWNEK6hFlONqqA8JntE/view?usp=sharing

model_weights.pth
Link: https://drive.google.com/file/d/1OvFmdZXmB9s6f86bowy1vVn3FBQ52hwL/view?usp=sharing

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create a .env file in the root directory and add Firebase credentials
# VITE_FIREBASE_API_KEY=xxx
# VITE_FIREBASE_AUTH_DOMAIN=xxx
# etc...
//get it from me

npm run dev
```
### 3. Database Setup
1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. During installation:
   - Remember the password you set for postgres user
   - Keep default port as 5432
   - Install pgAdmin when prompted

3. Open pgAdmin:
   - Right-click on 'PostgreSQL' in the left sidebar
   - Select 'Create' → 'Database'
   - Set database name as 'BrainDB'
   - Click Save

4. Verify Connection:
   - Database Name: BrainDB
   - Username: postgres
   - Password: (the one you set during installation)
   - Host: localhost
   - Port: 5432

#### Database connection
Create `.env` file in backend directory with:
```
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=BrainDB
DB_USER=postgres
DB_PASSWORD={the password u set during installation}
DB_HOST=localhost
DB_PORT=5432 
```
### 4. Backend Setup
```bash
cd backend
python -m venv env
env\Scripts\activate     # On Windows
env/bin/activate         # On linux
deactivate                     # to deactivate the virtual environment
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```


- Both frontend and backend servers must be running simultaneously 

From the Test/Test_Data/ upload the 4 nifti files of any of the 24 samples to see the generated segmentation
