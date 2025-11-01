import axios from 'axios';

const instance = axios.create({
  // Use explicit API URL if provided, otherwise go through Vite proxy
  // Vite proxy in vite.config.js forwards '/api' -> 'http://localhost:5000'
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add auth token to requests
instance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
