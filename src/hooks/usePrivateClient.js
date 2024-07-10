import {APIClientSecure} from "../api";
import {useEffect} from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";


export const usePrivateAPIClient = () => {
    const refresh = useRefreshToken();
    const {auth} = useAuth();

    useEffect(() => {
        const requestInterceptor = APIClientSecure.interceptors.request.use(
            (config) => {
                if (!config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${auth.access}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        )
        const responseInterceptor = APIClientSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originRequest = error?.config;

                if (error?.response?.status === 403 && !originRequest?.sent) {
                    originRequest.sent = true;
                    const newAccessToken = await refresh();
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return APIClientSecure(originRequest);
                }
                return Promise.reject(error);
            }
        )

        return () => {
            APIClientSecure.interceptors.request.eject(requestInterceptor);
            APIClientSecure.interceptors.response.eject(responseInterceptor);
        }
    }, [auth, refresh]);

    return APIClientSecure;

};

export default usePrivateAPIClient;