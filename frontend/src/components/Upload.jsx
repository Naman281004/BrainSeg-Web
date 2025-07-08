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
    const [selectedDemo, setSelectedDemo] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const isDemoMode = location.pathname === '/demo';

    const demoCases = [
        { id: 'Test_1', name: 'Demo Case 1' },
        { id: 'Test_16', name: 'Demo Case 2' },
    ];

    const fileTypes = [
        { id: 'T1', name: 'Native T1', description: 'Img1_Native_T1.nii' },
        { id: 'T1c', name: 'T1 Gd Weighted', description: 'Img2_T1_Gd_Weighted.nii' },
        { id: 'T2', name: 'T2 Weighted', description: 'Img3_T2_Weighted.nii' },
        { id: 'FLAIR', name: 'T2 FLAIR', description: 'Img4_T2_FLAIR.nii' }
    ];

    const handleDemoSelect = (caseId) => {
        if (!caseId) {
            setSelectedFiles({ 'T1': null, 'T1c': null, 'T2': null, 'FLAIR': null });
            setSelectedDemo('');
            return;
        }
        setSelectedDemo(caseId);
        setUploading(true);
        toast.promise(
            loadDemoFiles(caseId),
            {
                loading: `Loading files for ${caseId}...`,
                success: `Demo files for ${caseId} are loaded!`,
                error: `Could not load files for ${caseId}.`,
            }
        );
    };

    const loadDemoFiles = async (caseId) => {
        try {
            const filesToLoad = fileTypes.map(ft => ({
                id: ft.id,
                url: `/sample_nifti/${caseId}/${ft.description}`
            }));

            const filePromises = filesToLoad.map(fileInfo =>
                fetch(fileInfo.url)
                    .then(res => {
                        if (!res.ok) throw new Error(`File not found: ${fileInfo.url}`);
                        return res.blob();
                    })
                    .then(blob => new File([blob], fileInfo.url.split('/').pop(), { type: blob.type }))
            );
            
            const loadedFiles = await Promise.all(filePromises);

            setSelectedFiles({
                'T1': loadedFiles[0],
                'T1c': loadedFiles[1],
                'T2': loadedFiles[2],
                'FLAIR': loadedFiles[3],
            });
        } catch (error) {
            console.error("Error loading demo files:", error);
            throw error;
        } finally {
            setUploading(false);
        }
    };
    
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
        setStatusMessage('Uploading files...');

        const formData = new FormData();
        Object.entries(selectedFiles).forEach(([modality, file]) => {
            if (file) formData.append('nifti_files', file);
        });
        
        if (isDemoMode) {
            formData.append('is_demo', 'true');
        } else {
            formData.append('user_id', currentUser.uid);
            formData.append('email', currentUser.email);
        }

        try {
            const response = await axios.post('/api/upload/', formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        if (percentCompleted < 100) {
                            setStatusMessage(`Uploading... ${percentCompleted}%`);
                        } else {
                            setStatusMessage('Upload complete. Waiting for server to queue task...');
                        }
                    }
                }
            });

            if (response.data.status_url) {
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

    const statusMessages = {
        'queued': 'Your request is in the queue. Preparing to process...',
        'loading_model': 'Loading segmentation model. This may take a moment...',
        'processing': 'Model loaded. Processing brain scans...',
        'default': 'Processing... please wait.'
    };

    const checkStatus = async (statusUrl) => {
        try {
            const response = await axios.get(statusUrl);
            const { status, result } = response.data;
            
            setStatusMessage(statusMessages[status] || statusMessages.default);

            if (status === 'failed') {
                toast.error('Processing failed. Please try again.');
                setUploading(false);
                return;
            }

            if (status === 'complete' && result) {
                setStatusMessage('Processing complete! Redirecting...');
                setTimeout(() => {
                    navigate('/results', { state: { results: result, isNewUpload: true, is_demo: isDemoMode } });
                }, 1000);
                return;
            }

            setTimeout(() => checkStatus(statusUrl), 3000);
        } catch (error) {
            console.error('Error checking status:', error);
            toast.error('Error checking processing status');
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 text-center">{isDemoMode ? 'Live Demo' : 'Upload Brain MRI Files'}</h1>
                {isDemoMode ? (
                    <div className="text-center text-gray-600 mb-8">
                        <p className="mb-4">Select a sample case from the dropdown to load the files automatically.</p>
                        <div className="inline-block relative">
                            <select
                                value={selectedDemo}
                                onChange={(e) => handleDemoSelect(e.target.value)}
                                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:shadow-outline-blue"
                            >
                                <option value="">-- Select a Demo Case --</option>
                                {demoCases.map(dc => (
                                    <option key={dc.id} value={dc.id}>{dc.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <FileDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 mb-8">
                        Upload your NIfTI files (.nii or .nii.gz) in the specified order.
                    </p>
                )}
                
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
                                
                                {!isDemoMode && (
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
                                )}
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
                        className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                <span>{statusMessage}</span>
                            </>
                        ) : (
                            <>
                                <BrainCircuit className="w-5 h-5 mr-2" />
                                <span>Start Analysis</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Upload;
  