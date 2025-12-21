import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types';

// Base URL for backend API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Axios instance with default configuration
 * - 30 second timeout (flight search can be slow)
 * - JSON content type
 * - Request/response interceptors for auth and error handling
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * - Adds auth token if available (future use)
 * - Logs requests in development
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (future feature)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handles errors gracefully
 * - Provides user-friendly error messages
 * - Logs responses in development
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`[API] Response from ${response.config.url}:`, response.data);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server responded with error status
      const apiError = error.response.data;
      console.error('[API] Server error:', {
        status: error.response.status,
        message: apiError?.message || error.message,
        path: apiError?.path,
      });

      // Provide user-friendly error message
      const userMessage = apiError?.message || getDefaultErrorMessage(error.response.status);
      return Promise.reject(new Error(userMessage));
    } else if (error.request) {
      // Request made but no response (network error)
      console.error('[API] Network error:', error.message);
      return Promise.reject(
        new Error('Unable to connect to server. Please check your internet connection.')
      );
    } else {
      // Something else happened
      console.error('[API] Error:', error.message);
      return Promise.reject(new Error('An unexpected error occurred. Please try again.'));
    }
  }
);

/**
 * Get default error message based on HTTP status code
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your search parameters.';
    case 404:
      return 'Resource not found. The requested endpoint may not exist.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return `An error occurred (${status}). Please try again.`;
  }
}