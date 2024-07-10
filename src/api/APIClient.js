import axios from "axios";
import {config} from "../config";

const BASE_URL = "http://localhost:8000";
export const APIClient = axios.create({
    baseURL: BASE_URL,
});

export const APIClientSecure = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        accept: 'application/json',
    },
});


APIClientSecure.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401
            && !originalRequest._retry
            && originalRequest.url !== config.api.auth.refresh) {
            originalRequest._retry = true;

            try {
                await APIClientSecure.post(config.api.auth.refresh);
                return APIClientSecure(originalRequest);
            } catch (err) {
                console.error('Error refreshing token', err);
            }
        }
        return Promise.reject(error);
    }
);