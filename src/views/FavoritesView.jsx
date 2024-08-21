import React, {useContext, useEffect, useState} from "react";
import {config} from "../config";
import {Favorite} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router-dom";
import {APIClientSecure} from "../api";
import {SongContext} from "../context/songContext";
import SongCollection from "../components/SongCollection";


export const FavoritesView = () => {
    const {id} = useParams();
    const [songs, setSongs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await APIClientSecure.get(
                    config.api.favorites
                );
                const data = await response.data;
                console.log(data)
                setSongs(data);
            } catch (e) {
                if (e?.response) {
                    if (e.response?.status === 401) {
                        navigate("/sign/in/");
                    } else {
                        navigate("/");
                    }
                }
            }
        }
        fetchPlaylist();
    }, [id]);

    return (
        <SongCollection
            songs={songs}
            totalSongs={songs.length}
            collectionCover={(
                <>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "linear-gradient(135deg, #4205ed, #b3d9ce)",
                        width: 200,
                        height: 200,
                        borderRadius: 6
                    }}>
                        <Favorite style={{width: 128, height: 128}}/>
                    </div>
                </>
            )}
            collectionName="Favorites"
            checkIsPlaying={(currentSong) => currentSong?.playedFrom?.type === 'favorites'}
            extras={() => ({playedFrom: {type: 'favorites'}})}
        />
    );
};

export default FavoritesView;
