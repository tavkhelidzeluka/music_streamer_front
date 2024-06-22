import './App.css';
import {useContext, useEffect, useRef, useState} from "react";
import {SongContext} from './contexts/songContext';

const API_BASE_URL = 'http://localhost:8000';
const config = {
    api: {
        songs: `${API_BASE_URL}/songs/`
    }
};

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px"
         fill="#000000">
        <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#000000">
        <path
            d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/>
    </svg>
);

const SongCover = ({song}) => {
    console.log(song);
    return (
        <div className="songCardCover">
            <img src={song.album.cover} width={56} height={56} style={{borderRadius: 10}}/>
            <div style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "start",
                marginLeft: 4
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
    );
}

const SongCard = ({song}) => {
    const {setCurrentSong} = useContext(SongContext);

    const playSong = () => {
        setCurrentSong(song);
    }

    return (
        <div
            className="songCard"
            onClick={playSong}>
            <SongCover song={song}/>
            <div style={{flex: 1}}>
                <a className="link">{song.album.title}</a>
            </div>
        </div>
    )
}

const ControlButton = ({audioTagRef}) => {
    const [isPlaying, setIsPaying] = useState(true);
    useEffect(() => {

    }, [audioTagRef.current]);

    const toggleMediaPlayer = () => {
        const audioTag = audioTagRef.current;

        if (!audioTag.paused) {
            audioTag.pause();
        } else {
            audioTag.play();
        }
        setIsPaying(!audioTag.paused);

    };

    return (
        <div onClick={toggleMediaPlayer} className="playButton">
            {isPlaying ? <PauseIcon/> : <PlayIcon/>}
        </div>
    );
};

const MediaPlayer = () => {
    const audioTagRef = useRef();
    const progressBarRef = useRef();
    const {currentSong} = useContext(SongContext);
    const [timeIndicator, setTimeIndicator] = useState(null);

    const convertToMinute = (time) => {
        const seconds = parseInt(time % 60);
        return `${parseInt(time / 60)}:${seconds < 10 ? `0${seconds}` : seconds}`
    }

    useEffect(() => {
        setInterval(() => {
            const audioTag = audioTagRef.current;
            progressBarRef.current.style.width = `${audioTag.currentTime / audioTag.duration * 100}%`;

            setTimeIndicator({
                current: convertToMinute(audioTag.currentTime),
                duration: convertToMinute(audioTag.duration),
            });
        }, 100);
    }, []);

    return (
        <div className="mediaPlayer">
            {currentSong && <SongCover song={currentSong}/>}
            <div style={{
                flex: 6,
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{
                    margin: '0 0 1rem',
                    display: "flex",
                    justifyContent: "space-evenly"
                }}>
                    <ControlButton audioTagRef={audioTagRef}/>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                }}>
                    {currentSong && timeIndicator.current}
                    <div style={{flex: 1}}>
                        <div
                            onMouseDown={(event) => {
                                const progressBarWrapper = progressBarRef.current.parentNode;
                                progressBarRef.current.style.width = event.clientX - progressBarWrapper.offsetLeft + 'px';
                                const progressPerc = progressBarRef.current.clientWidth / progressBarWrapper.clientWidth;
                                audioTagRef.current.currentTime = parseInt(audioTagRef.current.duration * progressPerc)
                            }}
                            className="progressBarWrapper">
                            <div
                                className="progressBar"
                                ref={progressBarRef}>

                                <div className="progressBarPoint">

                                </div>
                            </div>
                        </div>
                    </div>
                    {currentSong && timeIndicator.duration}
                </div>

            </div>
            <audio ref={audioTagRef} src={currentSong && currentSong.file} autoPlay preload="metadata"></audio>
            <div style={{
                flex: 3
            }}>
            </div>
        </div>
    )
}

function App() {
    const [currentSong, setCurrentSong] = useState(null);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            const response = await fetch(config.api.songs);
            const data = await response.json();
            setSongs(data);

        }

        fetchSongs();
    }, []);

    return (
        <SongContext.Provider value={{currentSong, setCurrentSong}}>
            <div className="App">
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    padding: "3rem"
                }}>
                    <div style={{
                        display: "flex",
                        padding: 2,
                        marginBottom: '4px',
                        borderBottom: "1px solid gray"
                    }}>
                        <div
                            style={{
                                flex: 3,
                            }}>
                            Song
                        </div>
                        <div
                            style={{
                                flex: 1,
                            }}>
                            Album
                        </div>
                    </div>
                    {songs.map(song => <SongCard key={song.id} song={song}/>)}
                </div>
                {<MediaPlayer/>}
            </div>
        </SongContext.Provider>
    );
}

export default App;
