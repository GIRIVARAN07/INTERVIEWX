/**
 * API Service
 * -----------
 * Configured Axios instance for making HTTP requests to the backend.
 * Automatically attaches JWT token from localStorage to all requests.
 * Base URL points to /api (proxied to Express server in development).
 */

import axios from 'axios';

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attaches the JWT token (if available) to every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interviewx-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles 401 (Unauthorized) responses by clearing the stored token.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('interviewx-token');
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
