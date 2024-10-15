import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8090',
});

// Add a request interceptor for handling token authentication globally
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor for handling responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optionally, dispatch a logout action or redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
