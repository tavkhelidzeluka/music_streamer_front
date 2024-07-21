import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {APIClientSecure} from "../api";
import {config} from "../config";

export const SignOutView = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const clearToken = async () => {
            const response = await APIClientSecure.post(config.api.auth.clear);
            if (response.status !== 200) {
                console.error("Failed to clear token");
                return;
            }
            navigate("/sign/in/");
        }
        clearToken();
    }, []);

    return (<></>);
};

export default SignOutView;
