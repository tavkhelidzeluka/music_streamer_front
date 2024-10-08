import {createContext, useState} from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(
        JSON.parse(localStorage.getItem("user"))
    );


    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;