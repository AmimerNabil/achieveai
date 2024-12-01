import axios from 'axios';
import { auth } from '../firebase/auth';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;

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

export default axiosInstance;

