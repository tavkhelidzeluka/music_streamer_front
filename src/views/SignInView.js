import {useContext, useState} from "react";
import {UserContext} from "../contexts/userContext";
import {useNavigate} from "react-router-dom";
import {authenticate} from "../authentication";

export const SignInView = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();


    const submit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const userData = await authenticate(username, password);
        if (userData) {
            setUser(userData);
            navigate("/");
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

