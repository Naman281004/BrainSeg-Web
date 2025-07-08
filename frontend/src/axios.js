import axios from 'axios';
import { toast } from 'react-hot-toast';

// Determine the base URL based on the environment
const baseURL = import.meta.env.PROD
  ? "https://naman281004-brainseg-backend.hf.space"
  : "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL: baseURL,  
  timeout: 30000,
  withCredentials: false,
});

// Add a response interceptor to fix image URLs
axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data;

    // A recursive function to find and fix image paths in the response data
    const fixPaths = (obj) => {
      if (obj && typeof obj === 'object') {
        if (obj.static_image && !obj.static_image.startsWith('http')) {
          obj.static_image = `${baseURL}${obj.static_image}`;
        }
        if (obj.gif && !obj.gif.startsWith('http')) {
          obj.gif = `${baseURL}${obj.gif}`;
        }

        // Recurse into nested objects and arrays
        Object.keys(obj).forEach(key => fixPaths(obj[key]));
      } else if (Array.isArray(obj)) {
        obj.forEach(item => fixPaths(item));
      }
    };

    fixPaths(data);

    return response;
  },
  (error) => {
    // Log detailed error information for debugging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request Error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error Message:", error.message);
    }
    toast.error('An unexpected error occurred. Please try again.');
    return Promise.reject(error);
  }
);


export default axiosInstance; 