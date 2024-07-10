import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuth from "../hooks/useAuth";

export const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();
    return (
        Boolean(auth)
            ? <Outlet/>
            : <Navigate to="/sign/in/" replace state={{from: location}}/>
    )
};

export default RequireAuth;
