import axios, { AxiosRequestConfig } from 'axios';
import { IAuthResponse } from '../models/response/AuthResponse';

export const API_URL = 'http://clt.its:5000/api';

const $api = axios.create({
    withCredentials: true, // ... к каждому запросу cookie цеплялись автоматически
    baseURL: API_URL,
});

$api.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.headers) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return config;
});

$api.interceptors.response.use((config) => config, async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<IAuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e) {
            console.log('[interceptors] Не авторизован')
        }
    }
    throw error;
})

export default $api;
