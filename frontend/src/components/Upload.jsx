import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2, BrainCircuit, FileDown } from 'lucide-react';

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

    const fileTypes = [
        { id: 'T1', name: 'Native T1', description: 'Img1_Native_T1.nii' },
        { id: 'T1c', name: 'T1 Gd Weighted', description: 'Img2_T1_Gd_Weighted.nii' },
        { id: 'T2', name: 'T2 Weighted', description: 'Img3_T2_Weighted.nii' },
        { id: 'FLAIR', name: 'T2 FLAIR', description: 'Img4_T2_FLAIR.nii' }
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
            const response = await axios.post('/api/upload/', formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                }
            });

            if (response.data.status_url) {
                setProgress(10);
                checkStatus(response.data.status_url);
            } else {
                toast.error('Could not start processing. Please try again.');
                setUploading(false);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed: ' + (error.response?.data?.error || 'Network error'));
            setUploading(false);
        }
    };

    const checkStatus = async (statusUrl) => {
        try {
            const response = await axios.get(statusUrl);
            const { status, result, progress: serverProgress } = response.data;

            if (status === 'failed') {
                toast.error('Processing failed. Please try again.');
                setUploading(false);
                return;
            }
            
            if (status === 'processing' && serverProgress) {
                setProgress(serverProgress);
            }

            if (status === 'complete' && result) {
                setProgress(100);
                setTimeout(() => {
                    navigate('/results', { state: { results: result, isNewUpload: true } });
                }, 1000);
                return;
            }

            if (progress < 90) {
                setProgress(prev => Math.min(prev + 5, 90));
            }
            setTimeout(() => checkStatus(statusUrl), 2000);
        } catch (error) {
            console.error('Error checking status:', error);
            toast.error('Error checking processing status');
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 text-center">Upload Brain MRI Files</h1>
                <p className="text-center text-gray-600 mb-8">
                    Upload your NIfTI files (.nii or .nii.gz) in the specified order.
                </p>
                
                <div className="space-y-6">
                    {fileTypes.map((fileType) => (
                        <div 
                            key={fileType.id}
                            className={`p-6 border rounded-lg transition-colors duration-300 ${
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
                                    Loaded: {selectedFiles[fileType.id].name}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !Object.values(selectedFiles).every(Boolean)}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                            uploading || !Object.values(selectedFiles).every(Boolean)
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-custom-blue text-white hover:bg-indigo-600'
                        }`}
                    >
                        {uploading ? 'Processing...' : 'Upload and Process'}
                        {!uploading && <BrainCircuit className="w-5 h-5" />}
                    </button>
                </div>

                {uploading && progress > 0 && (
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
                                <p className="mt-2 text-sm text-gray-600">{progress}% Complete</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
  