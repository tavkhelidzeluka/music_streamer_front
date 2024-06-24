import {useContext, useState} from "react";
import {SongContext} from "../contexts/songContext";
import {SongCover} from "./SongCover";
import {AddCircleOutline, PlayArrowRounded} from "@mui/icons-material";
import {DancingBlocks} from "./DancingBlocks";
import {ViewContext} from "../contexts/viewContext";
import {routes} from "../routes";
import {config} from "../config";
import {UserContext} from "../contexts/userContext";

export const SongCard = ({song, album, number}) => {
    const {setCurrentView} = useContext(ViewContext);
    const {currentSong, setCurrentSong, setSound, sound} = useContext(SongContext);
    const [isHovered, setIsHovered] = useState(false);
    const [album_,] = useState(song.album || album);
    const {user} = useContext(UserContext);

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
                <div style={{
                    flex: 0.2,
                    textAlign: "center",
                    color: !sound && currentSong && currentSong.id === song.id && "#22bf55"
                }}>
                    {sound && currentSong && currentSong.id === song.id ? (
                        <DancingBlocks/>
                    ) : isHovered ? <PlayArrowRounded/> : number}
                </div>
            )}
            <SongCover song={song} album={album_}/>
            {(album_) && (
                <div style={{flex: 1}}>
                    <span className="link"
                          onMouseDownCapture={() => setCurrentView(routes.album(album_.id))}>{album_.title}</span>
                </div>
            )}
            {isHovered && (
                <div onMouseDownCapture={async () => {
                    const response = await fetch(
                        config.api.playlist.list,
                        {
                            headers: {
                                "Authorization": `Bearer ${user.access``}`
                            }
                        }
                    )

                    console.log(song.id);
                }}>
                    <AddCircleOutline/>
                </div>
            )}
        </div>
    )
}

