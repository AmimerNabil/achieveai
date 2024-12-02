import axios from 'axios';
import { auth, waitForAuth } from '../firebase/auth';


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    // httpsAgent,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        await waitForAuth;

        config.headers['ngrok-skip-browser-warning'] = "random"

        if (user) {
            const idToken = await user.getIdToken();
            config.headers['Authorization'] = `Bearer ${idToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Unauthorized: Invalid token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

