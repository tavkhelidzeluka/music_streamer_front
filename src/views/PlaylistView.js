import {useContext, useEffect, useRef, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {LibraryMusic, MoreHoriz, PlayArrow} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box, Button, Popover} from "@mui/material";
import usePlaylists from "../hooks/usePlaylists";
import {SongContext} from "../context/songContext";
import useSongQueue from "../hooks/useSongQueue";


export const PlaylistView = () => {
    const {id} = useParams();
    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState(null);
    const [open, setOpen] = useState(false);
    const {setPlaylists} = usePlaylists();
    const {setCurrentSong} = useContext(SongContext);
    const {setSongQueue} = useSongQueue();
    const navigate = useNavigate();
    const [anchorElem, setAnchorElem] = useState(null);

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

    const handlePlay = () => {
        setSongQueue(songs);
        setCurrentSong(songs[0]);
    }

    const handleDelete = async () => {
        try {
            await APIClientSecure.delete(`${config.api.playlist.list}${playlist.id}`);
            const response = await APIClientSecure.get(
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                <Box
                    className="playButton"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#1fdf64",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                    }}
                >
                    <PlayArrow
                        onClick={handlePlay}
                        sx={{
                            fontSize: 24,
                            color: "black"
                        }}
                    />
                </Box>
                <MoreHoriz
                    onClick={(event) => {
                        setOpen(true);
                        setAnchorElem(event.target);
                    }}
                    className="controlButton"
                />

                <Popover
                    open={open}
                    anchorEl={anchorElem}
                    onClose={() => {
                        setOpen(false);
                        setAnchorElem(null);
                    }}
                    disableRestoreFocus
                    sx={{
                        '& .MuiPaper-root': {
                            marginTop: "1rem",
                            backgroundColor: '#282828',
                            color: 'white',
                        },
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box
                        sx={{
                            padding: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </Box>
                </Popover>

            </Box>
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
            {songs.map((song, i) => (
                <SongCard
                    onPlay={() => {
                        setSongQueue(songs);
                    }}
                    key={song.id} song={song} number={i + 1}
                />
            ))}
        </Box>
    );
};