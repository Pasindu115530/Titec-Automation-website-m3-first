import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Attach bearer token from localStorage for client-side requests
api.interceptors.request.use((config) => {
    try {
        let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        // Fallback: try to get token from user object
        if (!token && typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                token = user.token;
            }
        }

        if (token) {
            if (config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
    } catch {
        // Safe no-op if localStorage is inaccessible
    }
    return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            // CSRF token mismatch - try to refresh
            console.error('CSRF token mismatch');
        }
        return Promise.reject(error);
    }
);