// src/services/apiClient.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { supabase } from '@/lib/supabaseClient';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Global response error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Example: Handle 401 globally if desired
      if (error.response.status === 401 && window.location.pathname !== '/login') {
        console.warn('Unauthorized request, redirecting to login.');
        //Potentially clear local auth state and redirect
        window.location.href = '/login';
      }
      // You can also extract a more user-friendly error message here
      const message = error.response.data?.message || error.message;
      return Promise.reject(new Error(message)); // Reject with a cleaner error
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server. Please check your network connection.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error(error.message));
    }
  }
);


export default apiClient;