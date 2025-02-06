import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching reports for user:', currentUser.uid);

        const response = await axios.get(`/api/reports/${currentUser.uid}/`);
        console.log('Reports API Response:', response);

        if (!response.data) {
          throw new Error('No data received from server');
        }

        const sortedReports = response.data
          .filter(report => report.results)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        console.log('Processed reports:', sortedReports);
        setReports(sortedReports);

      } catch (error) {
        console.error('Error fetching reports:', error);
        console.error('Error details:', error.response || error);
        setError(error.response?.data?.error || 'Failed to load reports. Please try again later.');
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [currentUser]);

  console.log('Current state:', { loading, error, reportsCount: reports.length });

  const handleViewResults = (report) => {
    const cleanedResults = {
      ...report.results,
      static_image: report.results.static_image.replace('http://localhost:8000', ''),
      gif: report.results.gif.replace('http://localhost:8000', '')
    };

    navigate('/results', { 
      state: { 
        results: cleanedResults,
        isNewUpload: false
      }
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>Please log in to view reports.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>No reports available yet.</p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Upload New Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Report History</h1>
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleViewResults(report)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  View Results
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports; 