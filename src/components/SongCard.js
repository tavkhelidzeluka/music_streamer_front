import {useContext, useState} from "react";
import {SongContext} from "../contexts/songContext";
import {SongCover} from "./SongCover";
import {PlayArrowRounded} from "@mui/icons-material";
import {DancingBlocks} from "./DancingBlocks";

export const SongCard = ({song, album, number}) => {
    const {currentSong, setCurrentSong, setSound} = useContext(SongContext);
    const [isHovered, setIsHovered] = useState(false);

    const playSong = () => {
        setCurrentSong({...song, album: song.album || album});
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
            <SongCover song={song} album={album || song.album}/>
            {(song.album || album) && (
                <div style={{flex: 1}}>
                    <span className="link">{song.album.title}</span>
                </div>
            )}
        </div>
    )
}

