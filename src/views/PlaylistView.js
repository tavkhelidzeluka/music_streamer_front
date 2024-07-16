import {useEffect, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {LibraryMusic} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box, Button} from "@mui/material";
import usePlaylists from "../hooks/usePlaylists";

export const PlaylistView = () => {
    const {id} = useParams();
    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState(null);
    const {playlists, setPlaylists} = usePlaylists();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await APIClientSecure.get(
                    config.api.playlist.detail(id),
                );
                const data = await response.data;
                setSongs(data.songs);
                setPlaylist(data);
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

    const handleDelete = async () => {

        try {
            let response = await APIClientSecure.delete(`${config.api.playlist.list}${playlist.id}`);
            response = await APIClientSecure.get(
                config.api.playlist.list
            );
            const data = await response.data;
            setPlaylists(data);
            navigate("/");
        } catch (e) {

        }
    }
    return (
        <Box
            sx={{
                padding: 2
            }}
        >
            <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
            >
                Delete
            </Button>
            <div style={{
                display: "flex",
                alignItems: "center",
                padding: 6,
                marginBottom: '1rem',
                gap: "1rem",
            }}
            >
                {playlist && (
                    <>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "#272727",
                            width: 256,
                            height: 256,
                            borderRadius: 10
                        }}>
                            <LibraryMusic style={{width: 128, height: 128}}/>
                        </div>
                        <div>
                            <div style={{fontSize: 48}}>{playlist.name}</div>
                            <div>{playlist.user.name}</div>
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
            {songs.map((song, i) => <SongCard key={song.id} song={song} number={i + 1}/>)}
        </Box>
    );
};