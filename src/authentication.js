import {config} from "./config";
import axios, {interceptors} from "axios";


export const getUser = () => JSON.parse(localStorage.getItem("user"));

export const saveUser = (user) => localStorage.setItem("user", JSON.stringify(user));

export const validateToken = async () => {
    const user = getUser("user");

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

    try {
        console.log("refreshing")
        const response = await axios.post(
            config.api.auth.refresh,
            {
                refresh: user.refresh
            },
        );

        const data = await response.data;
        saveUser({...user, ...data});
        return true;
    } catch (e) {

        saveUser({});
        return false;
    }
};