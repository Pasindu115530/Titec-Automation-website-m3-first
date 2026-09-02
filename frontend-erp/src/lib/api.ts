import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.titecautomation.lk',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout - accommodates slower network connections
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

        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - Token found:`, !!token);

        if (token) {
            // In newer axios, config.headers is an AxiosHeaders object.
            // Using set is safer, but fallback to object assignment if needed.
            if (config.headers && typeof config.headers.set === 'function') {
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                config.headers = config.headers || {};
                // @ts-ignore
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
    } catch (e) {
        console.error('[API Request] Error setting token:', e);
    }
    return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`[API Error] ${error.response.status} on ${error.config.url}`, error.response.data);
            if (error.response.status === 401) {
                // Unauthorized - clear session and redirect
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('quotationCart');

                    // Prevent infinite loop if already on login page
                    if (!window.location.pathname.includes('/dashboard/login')) {
                        window.location.href = '/dashboard/login';
                    }
                }
            } else if (error.response.status === 403) {
                console.error('[API Error] 403 Forbidden. This user lacks permissions or the token is invalid.');
            } else if (error.response.status === 419) {
                // CSRF token mismatch
                console.error('[API Error] CSRF token mismatch (419)');
            }
        } else {
            console.error('[API Error] Network error or no response:', error);
        }
        return Promise.reject(error);
    }
);