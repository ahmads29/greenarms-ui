import axios from 'axios';

// Create Axios instance with base configuration
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.quantumlab.codes/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to attach auth token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Placeholder for centralized error handling
    // e.g., redirect to login on 401, show toasts, etc.
    
    // For now, just pass the error through
    return Promise.reject(error);
  }
);

export default client;
