import {useContext, useEffect, useState} from "react";
import {SongContext} from "../context/songContext";
import {SongCover} from "./SongCover";
import {Add, AddCircleOutline, Clear, Done, Favorite, FavoriteBorder, PlayArrowRounded} from "@mui/icons-material";
import {DancingBlocks} from "./DancingBlocks";
import {config} from "../config";
import {Box, Button, Checkbox, FormControlLabel, Popover} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {Link, useNavigate} from "react-router-dom";
import {APIClientSecure} from "../api";
import usePlaylists from "../hooks/usePlaylists";


const SongManageButton = ({song, setFavorite, isFavorite}) => {
    const {id} = song;
    const [anchorElem, setAnchorElem] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [playlists, setPlaylist] = useState([]);
    const open = Boolean(anchorElem);
    const {setPlaylists} = usePlaylists();
    const navigate = useNavigate();
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [changedPlaylists, setChangedPlaylists] = useState([]);


    const updateSelectedPlaylist = () => {
        setSelectedPlaylists([]);
        playlists.forEach(playlist => {
            const isInPlaylist = playlist.songs.filter(song => song.id === id).length !== 0;
            if (isInPlaylist) {
                setSelectedPlaylists((prev) => [...prev, playlist.id]);
            }
        });
    }
    const fetchPlaylist = async () => {
        const response = await APIClientSecure.get(
            config.api.playlist.list,
        );

        const data = await response.data;
        setPlaylist(data);
        updateSelectedPlaylist();
    };

    useEffect(() => {
        fetchPlaylist();
    }, []);

    useEffect(() => {
        updateSelectedPlaylist();
    }, [playlists]);

    const handleOpen = (event) => {
        setAnchorElem(event.target);
    };

    const handleClose = () => {
        setAnchorElem(null);
    };

    const togglePlaylist = (playlist) => {
        const playlistIndex = selectedPlaylists.indexOf(playlist.id);
        if (playlistIndex === -1) {
            setSelectedPlaylists(prev => [...prev, playlist.id]);
        } else {
            setSelectedPlaylists(prev => [
                ...prev.slice(0, playlistIndex),
                ...prev.slice(playlistIndex + 1)
            ]);
        }
    };
    const likeSong = async () => {
        try {
                await APIClientSecure.post(
                    config.api.like(id),
                );
            } catch (e) {
                console.log(e.response);
            }
    }

    const addSongs = async () => {
        if (isFavorite) {
            await likeSong();
        }
        try {
            await APIClientSecure.post(
                config.api.playlist.updatePlaylists,
                {
                    ids: changedPlaylists,
                    song: id,
                }
            );
            handleClose();
        } catch (e) {
            console.log(e.response);
        }
    };

    const createNewPlaylist = async () => {
        try {
            let response = await APIClientSecure.get(config.api.playlist.names);
            const playlists = response.data;
            let maxNum = 0;
            playlists.forEach(playlist => {
                let [, num] = playlist.name.split("#");
                if (num === undefined) {
                    return;
                }
                num = parseInt(num);

                if (num > maxNum)
                    maxNum = num
            })
            response = await APIClientSecure.post(
                config.api.playlist.list,
                {
                    name: `My Playlist #${maxNum + 1}`,
                    songs: [
                        id
                    ]
                }
            );
            const newPlaylist = response.data;
            response = await APIClientSecure.get(
                config.api.playlist.list
            );
            const data = await response.data;
            setPlaylists(data);
            navigate(`/playlist/${newPlaylist.id}`)

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div
            onDoubleClick={event => event.stopPropagation()}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onClick={(event) => {
                    if (!isFavorite) {
                        likeSong();
                        setFavorite(true);
                        return;
                    }
                    open ? handleClose() : handleOpen(event);
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {!isFavorite ? (
                    <FavoriteBorder/>
                ) : (
                    <AddCircleOutline
                        sx={{
                            color: hovered ? "white" : "gray",
                            transform: hovered ? "scale(1.05)" : "none",
                        }}
                    />
                )}

            </div>
            <Popover
                open={open}
                anchorEl={anchorElem}
                onClose={handleClose}
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
                        padding: 0
                    }}
                    className="addToPlaylistPopUp"
                >
                    <Grid>
                        <Grid
                            className="albumCard"
                            xs={12}
                            sx={{
                                padding: 1
                            }}
                            onClick={createNewPlaylist}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Add/>
                                New Playlist
                            </Box>
                        </Grid>
                        <hr/>

                        <Grid
                            xs={12}
                            sx={{
                                padding: 1
                            }}
                        >
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                cursor: "pointer",
                            }}
                                 onClick={async () => {
                                     try {
                                         await APIClientSecure.post(
                                             config.api.like(id),
                                         );
                                         setFavorite((prev) => !prev);
                                         setAnchorElem(null);
                                     } catch (e) {
                                         console.log(e.response);
                                     }
                                 }}
                            >
                                {isFavorite ? (
                                    <Favorite/>
                                ) : (
                                    <FavoriteBorder/>
                                )}
                                <span>
                                    Favorites
                                </span>
                            </Box>
                        </Grid>
                        {playlists && (
                            playlists.map(playlist => (
                                <Grid
                                    xs={12}
                                    key={playlist.id}
                                    sx={{
                                        padding: 1
                                    }}
                                >
                                    <FormControlLabel
                                        label={playlist.name}
                                        control={
                                            <Checkbox
                                                checked={selectedPlaylists.indexOf(playlist.id) !== -1}
                                                onChange={() => {
                                                    togglePlaylist(playlist);
                                                    if (changedPlaylists.indexOf(playlist.id) !== -1) {
                                                        setChangedPlaylists(prev => [
                                                            ...prev.slice(0, prev.indexOf(playlist.id)),
                                                            ...prev.slice(prev.indexOf(playlist.id) + 1)
                                                        ])
                                                    } else {
                                                        setChangedPlaylists(prev => [...prev, playlist.id]);
                                                    }
                                                }}
                                            />
                                        }
                                    />
                                </Grid>
                            ))
                        )}
                        <Grid xs={12}>
                            {changedPlaylists.length !== 0 && (
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: 1
                                }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                            fetchPlaylist();
                                            setChangedPlaylists([]);
                                        }}
                                    >
                                        <Clear/>
                                    </Button>
                                    <Button variant="contained" onClick={addSongs} color="success">
                                        <Done/>
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Popover>
        </div>
    );
}


export const SongCard = (
    {
        song,
        album,
        number,
        onPlay = () => {
        },
        onPause = () => {
        },
    }) => {
    const {currentSong, setCurrentSong, setSound, sound} = useContext(SongContext);
    const [isHovered, setIsHovered] = useState(false);
    const [album_,] = useState(song.album || album);
    const [isFavorite, setFavorite] = useState(song.is_liked);

    const playSong = () => {
        setCurrentSong({...song, album: album_});
        setSound(true);
        onPlay();
    }

    const pauseSong = () => {
        setSound(false);
        onPause();
    }

    return (
        <div
            className="songCard"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={() => {
                if (currentSong?.id === song?.id) {
                    sound ? pauseSong() : playSong();
                } else {
                    playSong();
                }

            }}
        >
            {number && (
                <div style={{
                    flex: 0.2,
                    textAlign: "center",
                    color: !sound && currentSong && currentSong.id === song.id && "#22bf55"
                }}>
                    {sound && currentSong && currentSong.id === song.id ? (
                        <div onClick={pauseSong}>
                            <DancingBlocks/>
                        </div>
                    ) : isHovered ? <PlayArrowRounded onClick={playSong}/> : number}
                </div>
            )}
            <SongCover song={song} album={album_}/>
            {(album_) && (
                <div style={{flex: 1}}>
                    <Link to={`/album/${album_.id}/`} className="link">
                        {album_.title}
                    </Link>
                </div>
            )}
            <div style={{flex: 0.2, display: "flex", gap: 1}}>
                {isFavorite && !isHovered && (
                    <Favorite sx={{
                        color: "#22bf55"
                    }}/>
                )}


                {isHovered && (
                    <div>
                        <SongManageButton song={song} isFavorite={isFavorite} setFavorite={setFavorite}/>
                    </div>
                )}
            </div>
        </div>
    )
}

