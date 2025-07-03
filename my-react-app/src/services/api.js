import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }

    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Cannot connect to server. Please check if the server is running.'));
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      console.log('Unauthorized - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Handle 404 Not Found
    if (error.response.status === 404) {
      return Promise.reject(new Error('Resource not found.'));
    }

    // Handle 500 Internal Server Error
    if (error.response.status === 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    return Promise.reject(error);
  }
);

export default api;
