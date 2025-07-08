import axios from 'axios';
import { toast } from 'react-hot-toast';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const instance = axios.create({
  baseURL: apiBaseUrl,  
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

delete instance.defaults.headers['Content-Type'];


instance.interceptors.response.use(
  response => {
    const data = response.data;

    const processReport = (report) => {
      if (report?.results?.static_image) {
        if (!report.results.static_image.startsWith('http')) {
          report.results.static_image = `${apiBaseUrl}${report.results.static_image}`;
        }
        if (report.results.gif && !report.results.gif.startsWith('http')) {
          report.results.gif = `${apiBaseUrl}${report.results.gif}`;
        }
      }
      return report;
    };

    if (Array.isArray(data)) {
      response.data = data.map(processReport);
    } else if (typeof data === 'object' && data !== null) {
      response.data = processReport(data);
    }
    
    return response;
  },
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - check if backend server is running');
      toast.error('Cannot connect to server. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export default instance; 