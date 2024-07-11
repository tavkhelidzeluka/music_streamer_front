import {useEffect, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {Link, useNavigate} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box} from "@mui/material";

export const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await APIClientSecure.get(config.api.songs);
                const data = await response.data;
                setSongs(data);
            } catch (error) {
                navigate("/sign/in/");
            }
        };

        const fetchAlbums = async () => {
            try {
                const response = await APIClientSecure.get(config.api.album.list);
                const data = await response.data;
                setAlbums(data);
            } catch (error) {
                navigate("/sign/in/");
            }
        }

        fetchSongs();
        fetchAlbums();
    }, []);

    return (
        <>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                marginBottom: "1rem"
            }}>
                {albums.map(album => {
                    return (
                        <div key={album.id}
                             style={{width: "50%"}}
                             className="albumCard"
                             onClick={() => navigate(`/album/${album.id}/`)}>
                            <img src={album.cover} width={50} style={{borderRadius: "6px", marginRight: "1rem"}}/>
                            {album.title}
                        </div>
                    )
                })}

            </div>
            <div>
                <Box
                    sx={{
                        display: "flex",
                        padding: 1,
                        marginBottom: '1rem',
                        borderBottom: "1px solid gray"
                    }}
                >
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
                    <div
                        style={{
                            flex: 1,
                        }}>
                        Album
                    </div>
                    <div
                        style={{
                            flex: 0.2,
                        }}>

                    </div>
                </Box>
                {songs.map((song, i) => <SongCard key={song.id} song={song} number={i + 1}/>)}
            </div>
        </>
    );
};
