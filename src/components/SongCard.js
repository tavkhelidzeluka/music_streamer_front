import {useContext, useEffect, useState} from "react";
import {SongContext} from "../context/songContext";
import {SongCover} from "./SongCover";
import {Add, AddCircleOutline, PlayArrowRounded} from "@mui/icons-material";
import {DancingBlocks} from "./DancingBlocks";
import {config} from "../config";
import {Box, Button, Checkbox, FormControlLabel, Popover} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {Link, useNavigate} from "react-router-dom";
import {APIClientSecure} from "../api";
import usePlaylists from "../hooks/usePlaylists";

const SongManageButton = ({id}) => {
    const [anchorElem, setAnchorElem] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [playlists, setPlaylist] = useState([]);
    const open = Boolean(anchorElem);
    const {setPlaylists} = usePlaylists();
    const navigate = useNavigate();
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [changedPlaylists, setChangedPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylist = async () => {
            const response = await APIClientSecure.get(
                config.api.playlist.list,
            );

            const data = await response.data;
            setPlaylist(data);

        };
        fetchPlaylist();
    }, []);

    useEffect(() => {
        playlists.forEach(playlist => {
            const isInPlaylist = playlist.songs.filter(song => song.id === id).length !== 0;
            if (isInPlaylist) {
                setSelectedPlaylists((prev) => [...prev, playlist.id]);
            }
        })
    }, [playlists]);

    const handleOpen = (event) => {
        setAnchorElem(event.target);
    };

    const handleClose = () => {
        setAnchorElem(null);
    };

    const selectPlaylist = (playlist) => {
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

    const addSongs = async () => {
        console.log(selectedPlaylists);
        try {
            await APIClientSecure.post(
                config.api.playlist.updatePlaylists,
                {
                    ids: changedPlaylists,
                    song: id,
                }
            );
        } catch (e) {
            console.log(e.response);
        }
    };

    const createNewPlaylist = async () => {
        try {
            let response = await APIClientSecure.get(config.api.playlist.names);
            const playlists = response.data;
            let maxNum = 1;
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
        console.log("Create new playlist!");
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
                onClick={(event) => open ? handleClose() : handleOpen(event)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <AddCircleOutline
                    sx={{
                        color: hovered ? "white" : "gray",
                        transform: hovered ? "scale(1.05)" : "none",
                    }}
                />
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
                        padding: 2
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
                                                    selectPlaylist(playlist);
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
                                <>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{marginRight: 1}}
                                        onClick={() => setSelectedPlaylists([])}
                                    >
                                        Clear
                                    </Button>
                                    <Button variant="contained" onClick={addSongs}>
                                        Done
                                    </Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Popover>
        </div>
    );
}


export const SongCard = ({song, album, number}) => {
    const {currentSong, setCurrentSong, setSound, sound} = useContext(SongContext);
    const [isHovered, setIsHovered] = useState(false);
    const [album_,] = useState(song.album || album);

    const playSong = () => {
        setCurrentSong({...song, album: album_});
        setSound(true);
    }

    const pauseSong = () => {
        setSound(false);
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
            <div style={{flex: 0.2}}>
                {isHovered && (
                    <div>
                        <SongManageButton id={song.id}/>
                    </div>
                )}
            </div>
        </div>
    )
}

