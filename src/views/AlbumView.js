import {useEffect, useRef, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {APIClientSecure} from "../api";
import {useParams} from "react-router-dom";
import {Box} from "@mui/material";
import InfiniteScrollBox from "../components/InfiniteScrollBox";
import SongCollection from "../components/SongCollection";

export const AlbumView = () => {
    const {id} = useParams();
    const [songs, setSongs] = useState([]);
    const [album, setAlbum] = useState(null);

    useEffect(() => {
        const fetchAlbum = async () => {
            const response = await APIClientSecure.get(config.api.album.detail(id));
            const data = await response.data;
            setSongs(data.song_set);
            setAlbum(data);
        }
        fetchAlbum();
    }, [id]);

    return (
        <SongCollection
            songs={songs}
            totalSongs={songs.length}
            collectionCover={(
                <>
                    {album && (
                        <img src={album.cover} width={256} height={256} style={{borderRadius: 10}}
                             alt={album.title}/>
                    )}
                </>
            )}
            collectionName={(
                <>
                    {album && (
                        <>
                            <div style={{fontSize: 48}}>{album?.title}</div>
                            <div>{album?.artist?.name}</div>
                        </>
                    )}
                </>
            )}
            checkIsPlaying={(currentSong) => currentSong?.playedFrom?.type === 'album'}
            extras={
                () => ({
                    playedFrom: {type: 'album', id: album?.id},
                    album
                })
            }
        />
    );
};