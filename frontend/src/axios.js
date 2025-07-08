import axios from 'axios';

const baseURL = "https://naman281004-brainseg-backend.hf.space";

const axiosInstance = axios.create({
  baseURL: `${baseURL}?cache_bust=${new Date().getTime()}`,
  timeout: 300000,
  withCredentials: false,
});

export default axiosInstance;