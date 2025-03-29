import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import { useAuth } from '../contexts/AuthContext';
import { ArrowDownToLine, Loader2, Eye, Grid3X3 } from 'lucide-react';
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

// Custom component for displaying a slice or frame from a GIF
const SliceViewer = ({ sliceUrl, index, totalSlices, sliceImages }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Determine what type of slice this is
  const isGifFrame = sliceUrl.includes('#frame=');
  const isSegmentation = sliceUrl.includes('seg_');
  
  // Extract slice number from URL if it's a numbered segmentation slice
  const getSliceNumber = () => {
    if (isSegmentation) {
      const match = sliceUrl.match(/seg_(\d+)\.png/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }
    return index;
  };
  
  // Determine if we're using duplicated static images
  const areAllSlicesSame = totalSlices > 1 && sliceImages && 
    sliceImages.length > 1 && sliceImages.every(url => url === sliceImages[0]);
  
  // Apply different styles based on slice type
  const getSliceStyle = () => {
    if (areAllSlicesSame) {
      // Vary brightness slightly based on index to create visual distinction
      const brightness = 100 + (index % 3) * 5; // 100%, 105%, 110% brightness
      return {
        filter: `brightness(${brightness}%)`,
        transform: index % 2 === 0 ? 'scale(0.98)' : 'scale(1.0)',
      };
    }
    
    // For segmentation slices, maximize visibility
    if (isSegmentation) {
      return {
        objectFit: 'contain',
        maxHeight: '200px',
        width: 'auto',
        margin: '0 auto',
        display: 'block',
        border: '1px solid #eee',
        borderRadius: '4px'
      };
    }
    
    return {
      objectFit: 'contain',
      maxHeight: '200px',
      margin: '0 auto',
      display: 'block'
    };
  };
  
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md h-full flex flex-col">
      <div className="px-2 pt-3 text-center text-sm font-medium text-gray-700">
        {areAllSlicesSame ? 
          `Region ${index + 1}` : 
          (isSegmentation ? 
            `Slice ${getSliceNumber()}` : 
            (isGifFrame ? `Frame ${index + 1}` : `Slice ${index + 1}`)
          )
        }
      </div>
      
      <div className="flex-grow flex items-center justify-center p-3 bg-white">
        {!isLoaded && !hasError && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}
        
        {hasError && (
          <div className="flex justify-center items-center h-40 bg-gray-100">
            <div className="text-gray-500 text-sm text-center p-2">
              Image not available
            </div>
          </div>
        )}
        
        <img 
          src={sliceUrl}
          alt={`Brain Scan Slice ${index + 1}`}
          className={`${isLoaded && !hasError ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            console.error(`Error loading slice image ${index}:`, sliceUrl);
            setHasError(true);
            setIsLoaded(false);
          }}
          style={getSliceStyle()}
        />
      </div>
    </div>
  );
};

const Results = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportPreviewUrl, setReportPreviewUrl] = useState(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [showSliceGrid, setShowSliceGrid] = useState(false);
  const [sliceImages, setSliceImages] = useState([]);
  const [loadingSlices, setLoadingSlices] = useState(false);
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

  useEffect(() => {
    // Generate PDF preview when results are available
    const generatePdfPreview = async () => {
      if (results && currentUser) {
        try {
          const staticImageUrl = getCleanUrl(results.static_image);
          const blob = await pdf(
            <ReportPDF 
              results={{
                ...results,
                static_image: staticImageUrl
              }}
              patientInfo={{
                name: currentUser.displayName || 'Patient',
                id: currentUser.uid.substring(0, 8),
                referringPhysician: 'Self-referred'
              }}
            />
          ).toBlob();
          const url = URL.createObjectURL(blob);
          setReportPreviewUrl(url);
        } catch (err) {
          console.error('Error generating PDF preview:', err);
        }
      }
    };
    
    generatePdfPreview();
    
    // Clean up URL object on unmount
    return () => {
      if (reportPreviewUrl) {
        URL.revokeObjectURL(reportPreviewUrl);
      }
    };
  }, [results, currentUser]);

  const getCleanUrl = (url) => {
    if (!url) {
      console.log("getCleanUrl: Empty URL provided");
      return '';
    }
    
    try {
      // Log the original URL for debugging
      console.log("Processing URL:", url);
      
      // Clean any localhost references
      let cleanPath = url;
      
      // If it's already a relative path starting with /media
      if (url.startsWith('/media')) {
        cleanPath = url;
      } 
      // If it has localhost in it
      else if (url.includes('localhost')) {
        cleanPath = url.replace(/https?:\/\/localhost(:\d+)?/, '');
      }
      
      // Ensure the path starts with http://localhost:8000 for proper loading
      const finalUrl = `http://localhost:8000${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
      console.log("Final URL:", finalUrl);
      return finalUrl;
    } catch (err) {
      console.error("Error cleaning URL:", err, url);
      return url; // Return original if there's an error
    }
  };

  // New function to load individual slices
  const loadSliceImages = async () => {
    if (!results) {
      setError('No results available');
      return;
    }
    
    setLoadingSlices(true);
    setError(null);
    
    try {
      // Check for slice_images field from backend (correct property name)
      if (results.slice_images && Array.isArray(results.slice_images) && results.slice_images.length > 0) {
        console.log("Found slice_images array with length:", results.slice_images.length);
        const cleanUrls = results.slice_images.map(url => getCleanUrl(url));
        
        // Check if all URLs are identical (could happen with older data)
        const allSameUrl = cleanUrls.every(url => url === cleanUrls[0]);
        if (allSameUrl && cleanUrls.length > 1) {
          console.warn("All slice URLs are identical. This may indicate a backend issue.");
        }
        
        setSliceImages(cleanUrls);
        return;
      } 
      
      // Fallback to slices if that's what's available
      if (results.slices && Array.isArray(results.slices) && results.slices.length > 0) {
        console.log("Found slices array:", results.slices);
        const cleanUrls = results.slices.map(url => getCleanUrl(url));
        setSliceImages(cleanUrls);
        return;
      }
      
      // If no slice images are available in the results,
      // we'll use the static image and duplicate it for a grid view
      if (results.static_image) {
        console.log("No slice arrays found - using static image as fallback");
        const staticImageUrl = getCleanUrl(results.static_image);
        
        // For legacy data, just duplicate the static image to create a grid
        const staticFallbackSlices = Array(12).fill(staticImageUrl);
        setSliceImages(staticFallbackSlices);
        return;
      }
      
      // If none of the above works
      console.error("No slice images or fallback found in results:", results);
      setError('Slice images not available in the results data');
      setSliceImages([]);
      
    } catch (err) {
      console.error('Error loading slice images:', err);
      setError('Failed to load slice images: ' + err.message);
      setSliceImages([]);
    } finally {
      setLoadingSlices(false);
    }
  };

  // Load slices when user toggles the grid view
  useEffect(() => {
    if (showSliceGrid && sliceImages.length === 0) {
      loadSliceImages();
    }
  }, [showSliceGrid]);

  // Also try to load slice images when results first become available
  useEffect(() => {
    if (results && !loading) {
      loadSliceImages();
    }
  }, [results, loading]);

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
            <div className="flex justify-center mt-8 gap-4 flex-wrap">
              <PDFDownloadLink
                document={
                  <ReportPDF 
                    results={{
                      ...results,
                      static_image: staticImageUrl
                    }}
                    patientInfo={{
                      name: currentUser.displayName || 'Patient',
                      id: currentUser.uid.substring(0, 8),
                      referringPhysician: 'Self-referred'
                    }}
                  />
                }
                fileName={`brain-segmentation-report-${new Date().toISOString().split('T')[0]}.pdf`}
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
              
              <button 
                onClick={() => setShowReportPreview(!showReportPreview)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
              >
                {showReportPreview ? 'Hide Report' : 'View Report'}
                <Eye strokeWidth={2} className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setShowSliceGrid(!showSliceGrid)} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
              >
                {showSliceGrid ? 'Hide Slice Grid' : 'View Slice Grid'}
                <Grid3X3 strokeWidth={2} className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {showReportPreview && reportPreviewUrl && (
            <div className="bg-white rounded-xl shadow-[0_0_12px_8px_#5C5C5C] p-4 md:p-6 mt-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 text-center">Report Preview</h2>
              <div className="flex justify-center">
                <iframe 
                  src={reportPreviewUrl} 
                  className="w-full h-[800px] border-2 border-gray-200 rounded-lg" 
                  title="Report Preview"
                />
              </div>
            </div>
          )}
          
          {/* New Slice Grid Section */}
          {showSliceGrid && (
            <div className="bg-white rounded-xl shadow-[0_0_12px_8px_#5C5C5C] p-4 md:p-6 mt-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 text-center">Segmented Slices Grid</h2>
              
              {loadingSlices ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading slice images...</span>
                </div>
              ) : sliceImages.length > 0 ? (
                <>
                  {/* Check if we're using fallback mode (all slices are the same) */}
                  {sliceImages.every(url => url === sliceImages[0]) && (
                    <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                      <p>Note: Individual slice data is not available for this scan. 
                      Displaying representative views based on the static image.</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sliceImages.map((sliceUrl, index) => (
                      <SliceViewer key={index} sliceUrl={sliceUrl} index={index} totalSlices={sliceImages.length} sliceImages={sliceImages} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="mb-4">
                    {error || "No individual slice images available for this scan."}
                  </div>
                  
                  {process.env.NODE_ENV !== 'production' && (
                    <div className="mt-6 p-4 bg-gray-100 rounded text-left overflow-auto max-h-[300px] text-xs">
                      <h4 className="font-semibold mb-2">Debug Info:</h4>
                      <pre>
                        {JSON.stringify(results ? {
                          available_keys: Object.keys(results),
                          has_slice_images: !!results.slice_images,
                          slice_images_type: results.slice_images ? typeof results.slice_images : 'N/A',
                          slice_images_length: results.slice_images && Array.isArray(results.slice_images) ? results.slice_images.length : 'N/A',
                          has_gif: !!results.gif
                        } : 'No results', null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>These images show the segmentation results across different cross-sections of the brain scan.</p>
                <p className="mt-2">Each image displays the detected tumor regions highlighted with different colors:</p>
                <p className="mt-1 italic">
                  <span className="text-red-600 font-medium">Red = Necrotic core,</span>
                  <span className="text-yellow-500 ml-3 font-medium">Yellow = Peritumoral edema,</span>
                  <span className="text-green-600 ml-3 font-medium">Green = GD-enhancing tumor</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {error && !loadingSlices && (
          <div className="text-red-500 mt-4">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results; 