import {useEffect, useState} from "react";

export const useQuery = (url) => {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null,
    });

    const runQuery = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setState(prevState => ({
                ...prevState,
                data: data,
                loading: false,
                error: null,
            }));
        } catch (e) {
            setState(prevState => ({
                ...prevState,
                data: null,
                loading: false,
                error: e,
            }));
        }
    }

    useEffect(runQuery, [url]);

    return state;
};


export default useQuery;
