import {useAuth} from "./contexts/userContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {config} from "./config";
import {getUser, refreshToken} from "./authentication";
import {useEffect} from "react";

export const useAxiosSetup = () => {
    const {user, setUser} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                const isUnAuthorized = error.response.status === 401
                const isRefreshRequest = originalRequest.url === config.api.auth.refresh;

                if (isUnAuthorized && !originalRequest._retry && !isRefreshRequest) {
                    originalRequest._retry = true;
                    await refreshToken();
                    return axios(originalRequest);
                }
                setUser(null);
                navigate("/sign/in/");
            }
        );

        axios.interceptors.request.use((request) => {
            const {access} = getUser();
            request.headers.Authorization = `Bearer ${access}`;
            return request;
        });

    }, [user]);
};