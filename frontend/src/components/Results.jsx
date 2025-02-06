import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import { useAuth } from '../contexts/AuthContext';
import { ArrowDownToLine, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const GifPlayer = ({ src }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(`${src}?speed=0.1&t=${Date.now()}`);
  }, [src]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 gif-player">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}
      <img
        src={currentSrc}
        alt="Brain Scan Animation"
        className={`w-full h-auto ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        style={{ 
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)',
          animation: 'fadeIn 0.3s ease-in',
          imageRendering: '-webkit-optimize-contrast',
          imageRendering: 'crisp-edges'
        }}
      />
    </div>
  );
};

const Results = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.state?.results) {
      navigate('/upload');
      return;
    }
    setResults(location.state.results);
    setLoading(false);
    
    if (location.state.isNewUpload) {
      toast.success('Brain scan analysis complete!');
    }
  }, [location, navigate]);

  const getCleanUrl = (url) => {
    if (!url) return '';
    const cleanPath = url.replace('http://localhost:8000', '');
    return `http://localhost:8000${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-custom-blue mx-auto mb-4" />
          <div className="text-2xl text-gray-700">Loading results...</div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>No results available. Please try uploading your files again.</p>
        </div>
      </div>
    );
  }

  const staticImageUrl = getCleanUrl(results.static_image);
  const gifUrl = getCleanUrl(results.gif);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="w-full text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Segmentation Results</h1>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-white rounded-xl shadow-[0_0_12px_8px_#5C5C5C] p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 text-center">Static View</h2>
            <div className="max-w-4xl mx-auto">
              <img
                src={staticImageUrl}
                alt="Brain Segmentation Result"
                className="w-full rounded-lg shadow-md"
                loading="eager"
                onError={(e) => {
                  console.error('Image load error:', e);
                  setError('Failed to load preview image');
                }}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-black rounded-full mr-2"></div>
                  <span>Background</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
                  <span>Necrotic core</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Peritumoral edema</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
                  <span>GD-enhancing tumor</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_0_12px_8px_#5C5C5C] p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 text-center">Dynamic View</h2>
            <div className="max-w-4xl mx-auto">
              <GifPlayer src={gifUrl} />
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>This animation shows the segmentation results across different slices of the brain scan.</p>
            </div>
          </div>

          <div className="bg-background-dark rounded-xl p-4 md:p-6 text-center">
            <h3 className="text-white text-xl mb-4">Analysis Summary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-2">Necrotic Core</h4>
                <p className="text-white text-sm">Dead tissue within the tumor region</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Peritumoral Edema</h4>
                <p className="text-white text-sm">Swelling around the tumor area</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2">GD-enhancing Tumor</h4>
                <p className="text-white text-sm">Active tumor regions</p>
              </div>
            </div>

          </div>

          {currentUser && (
            <div className="flex justify-center mt-8">
              <PDFDownloadLink
                document={
                  <ReportPDF 
                    results={{
                      ...results,
                      static_image: staticImageUrl
                    }}
                  />
                }
                fileName={`brain-segmentation-report-${new Date().toISOString()}.pdf`}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
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
          )}
        </div>

        {error && (
          <div className="text-red-500 mt-4">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results; 