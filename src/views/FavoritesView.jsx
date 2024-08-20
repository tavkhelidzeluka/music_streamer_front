import {useContext, useEffect, useRef, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {Favorite, LibraryMusic, PlayArrow} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box} from "@mui/material";
import {SongContext} from "../context/songContext";
import useSongQueue from "../hooks/useSongQueue";
import InfiniteScrollBox from "../components/InfiniteScrollBox";
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
            collectionCover={<Favorite style={{width: 128, height: 128}}/>}
            collectionName="Favorites"
        />
    );
};

export default FavoritesView;
