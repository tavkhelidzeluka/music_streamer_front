import React, {useEffect, useState} from "react";
import {config} from "../config";
import {LibraryMusic, MoreHoriz} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box, Button, Popover} from "@mui/material";
import usePlaylists from "../hooks/usePlaylists";
import SongCollection from "../components/SongCollection";


export const PlaylistView = () => {
    const {id} = useParams();
    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState(null);
    const [open, setOpen] = useState(false);
    const {setPlaylists} = usePlaylists();
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
        <SongCollection
            songs={songs}
            totalSongs={songs.length}
            collectionCover={(
                <>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#272727",
                        width: 200,
                        height: 200,
                        borderRadius: 6
                    }}>
                        <LibraryMusic style={{width: 128, height: 128}}/>
                    </div>
                </>
            )}
            collectionName={playlist?.name}
            checkIsPlaying={(currentSong) => currentSong?.playedFrom?.type === 'playlist' && currentSong?.playedFrom?.data?.id === playlist?.id}
            extras={() => ({
                playedFrom: {
                    type: 'playlist',
                    data: playlist
                }
            })}
            subNav={(
                <>
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
                </>
            )}
        />
    );
};