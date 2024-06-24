import {UserContext} from "./contexts/userContext";
import {useContext} from "react";
import {config} from "./config";


export const getUser = () => JSON.parse(localStorage.getItem("user"));

export const saveUser = (user) => localStorage.setItem("user", JSON.stringify(user));

export const validateToken = async () => {
    const {access} = getUser("user");

    const response = await fetch(
        config.api.auth.verify,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: access
            })
        }
    );

    return response.ok;
};

export const authenticate = async (username, password) => {
    const response = await fetch(
        config.api.auth.token,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, password
            })
        }
    );

    if (response.ok) {
        const data = await response.json();
        const user = {...data, username}
        saveUser(user);
        return user;
    }
};


export const refreshToken = async () => {
    const user = getUser("user");

    const response = await fetch(
        config.api.auth.refresh,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh: user.refresh
            })
        }
    );

    if (response.ok) {
        const data = await response.json();
        saveUser({...user, ...data});

        return data;
    }
};