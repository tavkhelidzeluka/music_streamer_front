import {APIClient} from "../api";
import useAuth from "./useAuth";
import {config} from "../config";

const useRefreshToken = () => {
    const {setAuth, auth} = useAuth();

    return async () => {
        const response = await APIClient.post(
            config.api.auth.refresh,
            {
                refresh: auth.refresh
            }
        );

        setAuth(prev =>
            ({
                ...prev,
                access: response.data.access
            })
        );

        return response.data;
    };
};

export default useRefreshToken;
