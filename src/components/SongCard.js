import {useContext, useState} from "react";
import {SongContext} from "../contexts/songContext";
import {SongCover} from "./SongCover";
import {PlayArrowRounded} from "@mui/icons-material";
import {DancingBlocks} from "./DancingBlocks";
import {ViewContext} from "../contexts/viewContext";
import {routes} from "../routes";

export const SongCard = ({song, album, number}) => {
    const {setCurrentView} = useContext(ViewContext);
    const {currentSong, setCurrentSong, setSound} = useContext(SongContext);
    const [isHovered, setIsHovered] = useState(false);
    const [album_,] = useState(song.album || album);

    const playSong = () => {
        setCurrentSong({...song, album: album_});
        setSound(true);
    }

    return (
        <div
            className="songCard"
            onClick={playSong}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            {number && (
                <div style={{flex: 0.2, textAlign: "center"}}>
                    {currentSong && currentSong.id === song.id ? (
                        <DancingBlocks/>
                    ) : isHovered ? <PlayArrowRounded/> : number}
                </div>
            )}
            <SongCover song={song} album={album_}/>
            {(album_) && (
                <div style={{flex: 1}}>
                    <span className="link" onMouseDownCapture={() => setCurrentView(routes.album(album_.id))}>{album_.title}</span>
                </div>
            )}
        </div>
    )
}

