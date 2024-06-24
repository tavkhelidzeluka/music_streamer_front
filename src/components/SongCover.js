import {useContext, useState} from "react";
import {SongContext} from "../contexts/songContext";
import {PlayArrowRounded} from "@mui/icons-material";


export const SongCover = ({song, album, indicatePlaying = true}) => {
    const {currentSong} = useContext(SongContext);

    return (
        <div className="songCardCover">
            {album && (
                <img src={album.cover} width={56} height={56} style={{borderRadius: 10}}/>
            )}
            <div style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "start",
                marginLeft: 4
            }}>
                <span
                    style={{color: indicatePlaying && currentSong && currentSong.id === song.id ? "#22bf55" : "white"}}>{song.name}</span>
                <div className="songCardArtists">
                    {song.artists.map((artist, i) => (
                        <a key={artist.id} href="#" className="link">
                            <small>{i !== 0 && "*"}{artist.name}</small>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
