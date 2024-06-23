import {useContext, useEffect, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {SongCover} from "../components/SongCover";
import {SongContext} from "../contexts/songContext";
import {PlayArrowRounded} from "@mui/icons-material";


const AlbumSong = ({song, album, number}) => {
    const {setCurrentSong, setSound} = useContext(SongContext);
    const [isHovered, setIsHovered] = useState(false);

    const playSong = (song) => {
        setCurrentSong(song);
        setSound(true);
    }
    return (
        <div
            key={song.id}
            className="songCard"
            onClick={() => playSong({...song, album: album})}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{flex: 0.2, textAlign: "center"}}>
                {isHovered ? <PlayArrowRounded/> : number}
            </div>

            <div className="songCardCover">
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "start",
                }}>
                    <span style={{color: "white"}}>{song.name}</span>
                    <div className="songCardArtists">
                        {song.artists.map((artist, i) => (
                            <a key={artist.id} href="#" className="link">
                                <small>{i !== 0 && "*"}{artist.name}</small>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export const AlbumView = ({id}) => {
    const [songs, setSongs] = useState([]);
    const [album, setAlbum] = useState(null);


    useEffect(() => {
        const fetchAlbum = async () => {
            const response = await fetch(config.api.album.detail(id));
            const data = await response.json();
            setSongs(data.song_set);
            setAlbum(data);
        }
        fetchAlbum();
    }, [id]);
    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                padding: 6,
                marginBottom: '1rem',
                gap: "1rem",
            }}
            >
                {album && (
                    <>
                        <img src={album.cover} width={256} height={256} style={{borderRadius: 10}}
                             alt={album.title}/>
                        <div>
                            <div style={{fontSize: 48}}>{album.title}</div>
                            <div>{album.artist.name}</div>
                        </div>
                    </>
                )}

            </div>
            <div style={{
                display: "flex",
                padding: 6,
                marginBottom: '1rem',
                gap: 3,
                borderBottom: "1px solid gray",
            }}>
                <div
                    style={{
                        flex: 0.2,
                        textAlign: "center"
                    }}>
                    #
                </div>
                <div
                    style={{
                        flex: 3,
                    }}>
                    Song
                </div>
            </div>
            {songs.map((song, i) => <AlbumSong key={song.id} song={song} album={album} number={i + 1}/>)}
        </>
    );
};