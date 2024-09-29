import React, {useEffect, useState} from "react";
import {config} from "../config";
import {LibraryMusic, MoreHoriz} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box, Button, Modal, Popover, TextField} from "@mui/material";
import usePlaylists from "../hooks/usePlaylists";
import SongCollection from "../components/SongCollection";
import useQuery from "../hooks/useQuery";

const PlaylistEditModal = ({playlist, editOpen, handleEditClose, handleEdit}) => {
    return (
        <Modal
            open={editOpen}
            onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    background: '#282828',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <h1>Edit Playlist</h1>
                <form onSubmit={handleEdit}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            marginBottom: 2
                        }}
                    >
                        <Box>
                            <Box sx={{
                                position: "relative",
                                width: 250,
                                height: 250,
                                boxShadow: 24
                            }}>
                                {playlist?.cover ? (
                                    <img
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                        src={playlist.cover}
                                    />
                                ) : (
                                    <LibraryMusic
                                        sx={{
                                            width: "50%",
                                            height: "50%",
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>

                        <Box>
                            <TextField
                                label="Name"
                                name="name"
                                fullWidth
                                variant="outlined"
                                sx={{
                                    background: "#2a2a2a",
                                    color: "#fff",
                                    borderRadius: 1,
                                    "& .MuiOutlinedInput-root": {
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'white'
                                    }
                                }}
                                required
                                defaultValue={playlist?.name}
                            />
                        </Box>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                borderRadius: 6,
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}


export const PlaylistView = () => {
    const {id} = useParams();
    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState(null);
    const [open, setOpen] = useState(false);
    const {setPlaylists} = usePlaylists();
    const navigate = useNavigate();
    const [anchorElem, setAnchorElem] = useState(null);
    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);
    // const {data, loading, error} = useQuery(config.api.playlist.detail(id));

    const handleEdit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

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
            collectionName={(
                <>
                <span
                    onClick={handleEditOpen}
                    style={{cursor: "pointer"}}
                >
                    {playlist?.name}
                </span>
                    <PlaylistEditModal
                        playlist={playlist}
                        editOpen={editOpen}
                        handleEditClose={handleEditClose}
                        handleEdit={handleEdit}
                    />
                </>
            )}
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