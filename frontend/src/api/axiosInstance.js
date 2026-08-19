import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const errorMsg = error.response.data?.message || error.response.data?.msg || 'Sesi login telah berakhir. Silakan login kembali.';
        localStorage.setItem('_flash', JSON.stringify({
          type: 'error',
          message: errorMsg
        }));
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const backendURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default api;
