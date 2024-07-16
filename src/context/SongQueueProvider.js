import {createContext, useState} from "react";

export const SongQueueContext = createContext({});

export const SongQueueProvider = ({children}) => {
    const [songQueue, setSongQueue] = useState([]);


    return (
        <SongQueueContext.Provider value={{songQueue, setSongQueue}}>
            {children}
        </SongQueueContext.Provider>
    )
};

export default SongQueueProvider;