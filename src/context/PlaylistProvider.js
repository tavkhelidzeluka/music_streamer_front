import {createContext, useState} from "react";

export const PlaylistContext = createContext({});

export const PlaylistProvider = ({children}) => {
    const [playlists, setPlaylists] = useState([]);


    return (
        <PlaylistContext.Provider value={{playlists, setPlaylists}}>
            {children}
        </PlaylistContext.Provider>
    )
};

export default PlaylistProvider;