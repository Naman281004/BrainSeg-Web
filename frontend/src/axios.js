import axios from 'axios';

// Force the production URL to eliminate environment variable issues
const baseURL = "https://naman281004-brainseg-backend.hf.space";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 300000,
  withCredentials: false,
});

export default axiosInstance;