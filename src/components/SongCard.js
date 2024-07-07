import {useContext, useState} from "react";
import {SongContext} from "../contexts/songContext";
import {SongCover} from "./SongCover";
import {AddCircleOutline, PlayArrowRounded} from "@mui/icons-material";
import {DancingBlocks} from "./DancingBlocks";
import {ViewContext} from "../contexts/viewContext";
import {routes} from "../routes";
import {config} from "../config";
import {UserContext} from "../contexts/userContext";
import axios from "axios";

export const SongCard = ({song, album, number}) => {
    const {setCurrentView} = useContext(ViewContext);
    const {currentSong, setCurrentSong, setSound, sound} = useContext(SongContext);
    const [isHovered, setIsHovered] = useState(false);
    const [album_,] = useState(song.album || album);
    const [addToPlaylist, setAddToPlaylist] = useState([]);
    const {user} = useContext(UserContext);

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
                        <AddCircleOutline/>
                        {addToPlaylist && (
                            <div className="addToPlaylistPopUp">
                                {addToPlaylist.map(playlist => (
                                    <div key={playlist.id}
                                         className="popUpItem"
                                         onClick={async () => {
                                             const response = await axios.post(
                                                 config.api.playlist.addSong(playlist.id),
                                                 {
                                                     song_id: song.id
                                                 },
                                             )

                                             const data = await response.data;
                                             console.log(data);
                                             setAddToPlaylist([]);
                                         }}>
                                        {playlist.name}
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    )
}

