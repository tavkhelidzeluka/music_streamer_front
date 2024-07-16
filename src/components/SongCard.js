import {useContext, useState} from "react";
import {SongContext} from "../context/songContext";
import {SongCover} from "./SongCover";
import {Add, AddCircleOutline, PlayArrowRounded} from "@mui/icons-material";
import {DancingBlocks} from "./DancingBlocks";
import {ViewContext} from "../context/viewContext";
import {config} from "../config";
import {Box, Checkbox, Popover} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {Link} from "react-router-dom";
import {APIClientSecure} from "../api";

const SongManageButton = ({playlist}) => {
    const [anchorElem, setAnchorElem] = useState(null);
    const [hovered, setHovered] = useState(false);
    const open = Boolean(anchorElem);

    const handleOpen = (event) => {
        setAnchorElem(event.target)
    };

    const handleClose = () => {
        setAnchorElem(null)
    }

    return (
        <div>
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
                        {playlist && (
                            playlist.map(playlist => (
                                <Grid
                                    className="albumCard"

                                    xs={12}
                                    key={playlist.id}
                                >
                                    {playlist.name}
                                    <Checkbox/>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Box>
            </Popover>
        </div>
    );
}


export const SongCard = ({song, album, number}) => {
    const {setCurrentView} = useContext(ViewContext);
    const {currentSong, setCurrentSong, setSound, sound} = useContext(SongContext);
    const [isHovered, setIsHovered] = useState(false);
    const [album_,] = useState(song.album || album);
    const [addToPlaylist, setAddToPlaylist] = useState([]);

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
            onMouseLeave={() => setIsHovered(false)}>
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
                    <div
                        onMouseDownCapture={async () => {
                            const response = await APIClientSecure.get(
                                config.api.playlist.list,
                            )

                            const data = await response.data;
                            setAddToPlaylist(data);
                        }}>
                        <SongManageButton playlist={addToPlaylist}/>
                    </div>
                )}
            </div>
        </div>
    )
}

