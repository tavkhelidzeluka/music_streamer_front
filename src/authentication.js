import {config} from "./config";
import axios from "axios";



export const getUser = () => JSON.parse(localStorage.getItem("user"));

export const saveUser = (user) => localStorage.setItem("user", JSON.stringify(user));

export const validateToken = async () => {
    const user =  getUser("user");

    if (!user)
        return;
    const {access} = user;

    try {
        const response = await axios.post(
            config.api.auth.verify,
            {
                token: access
            }
        )
        return response.status === 200;
    } catch (e) {
        return await refreshToken();
    }

};

export const authenticate = async (username, password) => {
    const response = await axios.post(
        config.api.auth.token,
        {
            username,
            password
        }
    )

    if (response.status === 200) {
        const data = await response.data;
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
    } else {
        saveUser({});
    }
    return response.ok;
};