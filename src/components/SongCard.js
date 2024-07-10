import {useContext, useState} from "react";
import {SongContext} from "../context/songContext";
import {SongCover} from "./SongCover";
import {AddCircleOutline, PlayArrowRounded} from "@mui/icons-material";
import {DancingBlocks} from "./DancingBlocks";
import {ViewContext} from "../context/viewContext";
import {routes} from "../routes";
import {config} from "../config";
import {AuthProvider} from "../context/AuthProvider";
import axios from "axios";
import {Checkbox, createTheme, Popover, Typography} from "@mui/material";

const SongManageButton = ({playlist}) => {
    const [anchorElem, setAnchorElem] = useState(null);
    const open = Boolean(anchorElem);

    const handleOpen = (event) => {
        setAnchorElem(event.target)
    };

    const handleClose = () => {
        setAnchorElem(null)
    }

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onClick={(event) => open ? handleClose() : handleOpen(event)}
            >
                <AddCircleOutline/>
            </Typography>
            <Popover
                open={open}
                anchorEl={anchorElem}
                onClose={handleClose}
                disableRestoreFocus
                sx={{
                    borderRadius: 6
                }}
            >
                <div className="addToPlaylistPopUp">
                    {playlist && (
                        playlist.map(playlist => (
                            <div key={playlist.id}>
                                {playlist.name}
                                <Checkbox/>
                            </div>
                        ))
                    )}
                </div>
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
                    <span className="link"
                          onMouseDownCapture={() => setCurrentView(routes.album(album_.id))}>{album_.title}</span>
                </div>
            )}
            <div style={{flex: 0.2}}>
                {isHovered && (
                    <div style={{position: "relative"}}
                         onMouseDownCapture={async () => {
                             const response = await axios.get(
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

