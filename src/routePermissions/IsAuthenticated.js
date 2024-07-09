import {useContext, useEffect} from "react";
import {UserContext} from "../contexts/userContext";
import {useNavigate} from "react-router-dom";
import {useAxiosSetup} from "../axiosSetup";

export const IsAuthenticatedRoute = ({children}) => {
    useAxiosSetup();
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        !user && navigate("/sign/in/")
    }, [user]);

    return (
        <>
            {children}
        </>
    )
};

export default IsAuthenticatedRoute;
