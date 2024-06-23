import {useContext} from "react";
import {SongContext} from "../contexts/songContext";
import {SongCover} from "./SongCover";

export const SongCard = ({song}) => {
    const {setCurrentSong, setSound} = useContext(SongContext);

    const playSong = () => {
        setCurrentSong(song);
        setSound(true);
    }

    return (
        <div
            className="songCard"
            onClick={playSong}>
            <SongCover song={song}/>
            <div style={{flex: 1}}>
                <span className="link">{song.album.title}</span>
            </div>
        </div>
    )
}

