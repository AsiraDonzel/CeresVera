import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

/**
 * Axios instance with automatic JWT token refresh.
 * 
 * If a request gets a 401, it will automatically try to refresh the
 * access token using the stored refresh token, then retry the request.
 */
const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor: attach access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue subsequent requests while refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');
            
            if (!refreshToken) {
                isRefreshing = false;
                // No refresh token — user needs to log in again
                console.warn('[Auth] No refresh token available. User must re-login.');
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_URL}/api/auth/refresh/`, {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                localStorage.setItem('access_token', newAccessToken);

                // If backend also rotates refresh tokens
                if (response.data.refresh) {
                    localStorage.setItem('refresh_token', response.data.refresh);
                }

                console.log('[Auth] Token refreshed successfully');

                processQueue(null, newAccessToken);
                
                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                console.error('[Auth] Token refresh failed:', refreshError);
                // Clear tokens — user must re-login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
