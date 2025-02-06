import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000',  
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
    if (response.data && response.data.static_image) {
      response.data.static_image_url = `http://localhost:8000${response.data.static_image}`;
      response.data.gif_url = `http://localhost:8000${response.data.gif}`;
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