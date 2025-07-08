import axios from 'axios';
import { toast } from 'react-hot-toast';

// Determine the base URL based on the environment
const baseURL = import.meta.env.PROD
  ? "https://naman281004-brainseg-backend.hf.space"
  : "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL: baseURL,  
  timeout: 300000,
  withCredentials: false,
});

export default axiosInstance;