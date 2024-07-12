import {useEffect, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {APIClientSecure} from "../api";
import {useParams} from "react-router-dom";
import {Box} from "@mui/material";

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
        <Box
            sx={{
                padding: 2
            }}
        >
            <div style={{
                display: "flex",
                alignItems: "center",
                padding: 6,
                marginBottom: '1rem',
                gap: "1rem",
            }}
            >
                {album && (
                    <>
                        <img src={album.cover} width={256} height={256} style={{borderRadius: 10}}
                             alt={album.title}/>
                        <div>
                            <div style={{fontSize: 48}}>{album.title}</div>
                            <div>{album.artist.name}</div>
                        </div>
                    </>
                )}

            </div>
            <div style={{
                display: "flex",
                padding: 6,
                marginBottom: '1rem',
                gap: 3,
                borderBottom: "1px solid gray",
            }}>
                <div
                    style={{
                        flex: 0.2,
                        textAlign: "center"
                    }}>
                    #
                </div>
                <div
                    style={{
                        flex: 3,
                    }}>
                    Song
                </div>
            </div>
            {songs.map((song, i) => <SongCard key={song.id} song={song} album={album} number={i + 1}/>)}
        </Box>
    );
};