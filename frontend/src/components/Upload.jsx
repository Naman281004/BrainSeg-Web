import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Upload = () => {
    const [selectedFiles, setSelectedFiles] = useState({
        'T1': null,      
        'T1c': null,     
        'T2': null,      
        'FLAIR': null    
    });
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processingSteps, setProcessingSteps] = useState({
        uploading: { status: 'pending', progress: 0 },
        modelLoading: { status: 'pending', progress: 0 },
        dataProcessing: { status: 'pending', progress: 0 },
        inference: { status: 'pending', progress: 0 },
        visualization: { status: 'pending', progress: 0 }
    });
    const progressInterval = useRef(null);

    const fileTypes = [
        {
            id: 'T1',
            name: 'Native T1',
            description: 'Img1_Native_T1.nii',
            required: true
        },
        {
            id: 'T1c',
            name: 'T1 Gd Weighted',
            description: 'Img2_T1_Gd_Weighted.nii',
            required: true
        },
        {
            id: 'T2',
            name: 'T2 Weighted',
            description: 'Img3_T2_Weighted.nii',
            required: true
        },
        {
            id: 'FLAIR',
            name: 'T2 FLAIR',
            description: 'Img4_T2_FLAIR.nii',
            required: true
        }
    ];

    const handleFileSelect = (fileType, event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.name.endsWith('.nii') && !file.name.endsWith('.nii.gz')) {
                toast.error('Please upload only .nii or .nii.gz files');
                return;
            }
            setSelectedFiles(prev => ({
                ...prev,
                [fileType]: file
            }));
            toast.success(`${fileType} file selected`);
        }
    };

    const calculateTotalProgress = () => {
        const steps = Object.values(processingSteps);
        const totalProgress = steps.reduce((acc, step) => acc + step.progress, 0);
        return Math.round(totalProgress / steps.length);
    };


    const checkStatus = async (statusUrl) => {
        try {
            const response = await axios.get(statusUrl);
            const { status, result } = response.data;

            if (status === 'failed') {
                toast.error('Processing failed. Please try again.');
                setUploading(false);
                return;
            }

            if (status === 'complete' && result) {
                setProgress(100);
                setTimeout(() => {
                    navigate('/results', { state: { results: result, isNewUpload: true } });
                }, 1000);
                return;
            }

            if (progress < 90) {
                setProgress(prev => Math.min(prev + 2, 90));
            }
            setTimeout(() => checkStatus(statusUrl), 1000);
        } catch (error) {
            console.error('Error checking status:', error);
            toast.error('Error checking processing status');
            setUploading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        Object.entries(selectedFiles).forEach(([modality, file]) => {
            if (file) formData.append('nifti_files', file);
        });
        
        formData.append('user_id', currentUser.uid);
        formData.append('email', currentUser.email);

        try {
            const response = await axios.post('/api/upload/', formData);

            if (response.data.status_url) {
                setProgress(10);
                checkStatus(response.data.status_url);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed: ' + (error.response?.data?.error || 'Network error'));
            setUploading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Upload Brain MRI Files</h1>
                
                <div className="bg-[#EFEFEF] p-4 rounded-lg mb-8">
                    <h2 className="text-lg font-semibold mb-2">Required File Order:</h2>
                    <p className="text-sm text-gray-600">
                        Please upload your NIfTI files (.nii or .nii.gz) in the following order:
                    </p>
                </div>

                <div className="space-y-6">
                    {fileTypes.map((fileType) => (
                        <div 
                            key={fileType.id}
                            className={`p-6 border rounded-lg ${
                                selectedFiles[fileType.id] ? 'border-green-500 bg-green-50' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">{fileType.name}</h3>
                                    <p className="text-sm text-gray-500">{fileType.description}</p>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        accept=".nii,.nii.gz"
                                        onChange={(e) => handleFileSelect(fileType.id, e)}
                                        className="hidden"
                                        id={`file-${fileType.id}`}
                                    />
                                    <label
                                        htmlFor={`file-${fileType.id}`}
                                        className="px-4 py-2 bg-background-dark text-white rounded-lg cursor-pointer hover:bg-black"
                                    >
                                        {selectedFiles[fileType.id] ? 'Change File' : 'Select File'}
                                    </label>
                                </div>
                            </div>
                            
                            {selectedFiles[fileType.id] && (
                                <div className="mt-2 text-sm text-green-600">
                                    Selected: {selectedFiles[fileType.id].name}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !Object.values(selectedFiles).every(Boolean)}
                        className={`px-6 py-3 rounded-lg font-medium ${
                            uploading || !Object.values(selectedFiles).every(Boolean)
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-custom-blue text-white hover:bg-indigo-600'
                        }`}
                    >
                        {uploading ? 'Processing...' : 'Upload and Process Files'}
                    </button>
                </div>

                {uploading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-12 h-12 text-custom-blue animate-spin mb-4" />
                                <div className="mb-4 text-center">
                                    <h3 className="text-lg font-semibold mb-1">
                                        Processing Brain Scans
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Please wait while we process your files...
                                    </p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-custom-blue h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-600">{progress}%</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
  