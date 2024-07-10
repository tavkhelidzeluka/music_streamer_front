import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {APIClient, APIClientSecure} from "../api";
import {config} from "../config";
import useAuth from "../hooks/useAuth";
import usePrivateAPIClient from "../hooks/usePrivateClient";

export const SignInView = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuth} = useAuth();

    const navigate = useNavigate();


    const submit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await APIClientSecure.post(
                config.api.auth.token,
                {
                    username, password
                },
            );

            const data = await response.data;
            console.log(data);
            setAuth({username});
            navigate("/");
        } catch (error) {
            console.log(error);
            switch (error?.response?.status) {
                case 401:
                    console.log("Unauthorized");
                    break;
                default:
                    console.log("No server response");
                    break;
            }
        }
    };

    return (
        <form>
            <label>
                Username:
                <input onChange={(e) => setUsername(e.target.value)} value={username}/>
            </label>
            <label>
                Password
                <input onChange={(e) => setPassword(e.target.value)} value={password}/>
            </label>
            <button onClick={submit}>Sign In</button>
        </form>
    );
};


export default SignInView

