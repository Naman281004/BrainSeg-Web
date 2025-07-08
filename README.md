# BrainSeg: AI-Powered Brain Tumor Segmentation Analysis

<p align="center">
  <img src="./screenshots/Screenshot%202025-07-08%20175706.png"  />
  <img src="./screenshots/Screenshot%202025-07-08%20175712.png"  />
  <img src="./screenshots/Screenshot%202025-07-08%20175718.png"  />
</p>

**[View Live Application](https://brainseg-frontend-7zk0.onrender.com)**

BrainSeg is a full-stack web application designed for AI-powered medical imaging analysis, specifically focusing on multi-modal brain tumor segmentation. It enables authenticated users to upload a complete set of four MRI scan types (T1, T1c, T2, and FLAIR) in NIfTI format.

The backend, built with **Django** and **PostgreSQL**, processes these scans using an asynchronous task queue. A **PyTorch**-based **U-Net** model performs semantic segmentation to identify key tumor regions: the necrotic core, peritumoral edema, and the GD-enhancing tumor.

The **React** frontend, styled with **Tailwind CSS**, provides a seamless user experience for file upload and results visualization. Once processing is complete, users can view interactive results, including a static segmentation map and an animated GIF that scrolls through the scan slices. The platform also features secure user authentication via **Firebase** and allows users to generate and download comprehensive PDF reports directly from the browser.

## Key Features

-   **Multi-Modal Image Processing:** Accepts four types of MRI scans (T1, T1c, T2, FLAIR) for a comprehensive analysis.
-   **AI-Powered Segmentation:** Utilizes a U-Net based deep learning model to accurately identify and segment different tumor regions:
    -   Necrotic Core
    -   Peritumoral Edema
    -   GD-enhancing Tumor
-   **Interactive Visualizations:** View the segmentation results as a static image and a dynamic GIF that scrolls through the brain scan slices.
-   **Comprehensive PDF Reports:** Generate and download detailed reports that include patient information, segmentation results, and visual summaries.
-   **User Authentication:** Secure user registration and login functionality provided by Firebase.
-   **Report History:** Registered users can view and revisit their past analysis reports.

## Screenshots

| Upload Interface | Backend Processing | Segmentation Results |
| :---: | :---: | :---: |
| ![Upload Page](./screenshots/Screenshot%202025-07-08%20180007.png) | ![Processing](./screenshots/Screenshot%202025-07-08%20180016.png) | ![Results Page](./screenshots/Screenshot%202025-07-08%20180038.png) |
| **PDF Report** | **Report History** | |
| ![PDF Report](./screenshots/Screenshot%202025-07-08%20180056.png) | ![Report History](./screenshots/Screenshot%202025-07-08%20180125.png) | |


## Technology Stack

| Area      | Technologies                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------------- |
| **Frontend**  | React, Vite, Tailwind CSS, Firebase Authentication, React Router, Axios, Lucide React                     |
| **Backend**   | Django, Django REST Framework, PostgreSQL, PyTorch, SimpleITK, Nibabel, Pillow, Matplotlib               |
| **DevOps**    | Git, GitHub, Docker (optional)                                                                           |

## Local Setup and Installation

To run this project locally, please follow the steps below.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Python](https://www.python.org/) (v3.9 or later)
-   [PostgreSQL](https://www.postgresql.org/download/)

### 1. Clone the Repository

```bash
git clone https://github.com/Naman281004/BrainSeg-Web.git
cd BrainSeg-Web
```

### 2. Download Model Files

The deep learning model weights are required for the backend to function. Download the following files and place them in the `backend/CODE_BRAINSEG/UNET_for_Multimodal_Semantic_Segmentation/` directory:

-   [**best_model.pth**](https://drive.google.com/file/d/1hHqU4qf6lxbeyXWNEK6hFlONqqA8JntE/view?usp=sharing)
-   [**model_weights.pth**](https://drive.google.com/file/d/1OvFmdZXmB9s6f86bowy1vVn3FBQ52hwL/view?usp=sharing)

### 3. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv env
# On Windows:
env\Scripts\activate
# On macOS/Linux:
source env/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Set up the database (see instructions below)

# Run database migrations
python manage.py migrate

# Start the backend server
python manage.py runserver
```

### 4. Database Setup

1.  **Install and run PostgreSQL.**
2.  Open **pgAdmin** or your preferred PostgreSQL client.
3.  Create a new database named `BrainDB`.
4.  Create a `.env` file inside the `backend` directory and add the following, replacing the placeholder values with your own credentials:

    ```env
    DEBUG=True
    SECRET_KEY=your-super-secret-key
    DB_NAME=BrainDB
    DB_USER=postgres
    DB_PASSWORD=your_postgres_password
    DB_HOST=localhost
    DB_PORT=5432
    ```

### 5. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install the required npm packages
npm install

# Create a .env file in the frontend directory and add your Firebase credentials
# Get these from your Firebase project settings
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Start the frontend development server
npm run dev
```

### 6. Running the Application

Ensure both the backend and frontend servers are running in separate terminals. The application will be accessible at `http://localhost:5173`.
