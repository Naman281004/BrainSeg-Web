import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { toast } from 'react-hot-toast';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import { ArrowDownToLine, ExternalLink } from 'lucide-react';

const ReportsHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getCleanUrl = (url) => {
    if (!url) return '';
    const cleanPath = url.replace('http://localhost:8000', '');
    return `http://localhost:8000${cleanPath}`;
  };

  useEffect(() => {
    const fetchReports = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/reports/${currentUser.uid}/`);
        
        const sortedReports = response.data
          .filter(report => report.results && report.status === 'complete')
          .map(report => ({
            ...report,
            results: {
              ...report.results,
              static_image: getCleanUrl(report.results.static_image),
              gif: getCleanUrl(report.results.gif)
            }
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setReports(sortedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-600">
            <p className="font-bold text-3xl  items-center justify-center">No reports available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-center">REPORT HISTORY</h1>
        <div className="grid gap-4">
          {reports.map((report, index) => (
            <div key={report.id} className="flex items-center gap-4">
              <div className="text-3xl font-bold">
                #{reports.length - index}
              </div>

              <div className="bg-[#EFEFEF] p-6 rounded-lg flex-1">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-2/3">
                    <img
                      src={report.results.static_image}
                      alt="Brain Scan Result"
                      className="w-full rounded-lg"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        e.target.src = 'fallback-image-url';
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4 items-center mt-5 ml-16">
                    <button
                      onClick={() => navigate('/results', { 
                        state: { results: report.results }
                      })}
                      className="bg-black hover:bg-background-dark text-white  px-10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      View Report
                      <ExternalLink strokeWidth={2} className="w-5 h-5" />
                    </button>
                    
                    <PDFDownloadLink
                      document={<ReportPDF results={report.results} />}
                      fileName={`brain-segmentation-report-${reports.length - index}.pdf`}
                      className="bg-black hover:bg-background-dark text-white  px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      {({ loading: pdfLoading, error }) => (
                        <>
                          {pdfLoading ? (
                            'Generating PDF...'
                          ) : error ? (
                            'Error generating PDF'
                          ) : (
                            <>
                              Download Report
                              <ArrowDownToLine strokeWidth={2} className="w-5 h-5" />
                            </>
                          )}
                        </>
                      )}
                    </PDFDownloadLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsHistory; 