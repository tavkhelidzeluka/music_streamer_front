import {useContext, useEffect, useRef, useState} from "react";
import {SongContext} from "./context/songContext";
import {SongCover} from "./components/SongCover";
import {config} from "./config";
import {
    PauseOutlined,
    PlayArrow,
    Repeat,
    Shuffle,
    SkipNext,
    SkipPrevious,
    VolumeDownOutlined,
    VolumeOffOutlined,
    VolumeUpOutlined
} from "@mui/icons-material";
import {ProgressBarChangeable} from "./components/ProgressBarChangeable";
import useSongQueue from "./hooks/useSongQueue";

const convertToMinute = (time) => {
    const seconds = parseInt(time % 60);
    return `${parseInt(time / 60)}:${seconds < 10 ? `0${seconds}` : seconds}`
}


const ControlButton = ({audioTagRef}) => {
    const {sound, setSound} = useContext(SongContext);

    const play = () => setSound(true);
    const pause = () => setSound(false);

    useEffect(() => {
        if (!sound) {
            audioTagRef?.current?.pause();
        } else {
            audioTagRef?.current?.play();
        }
        audioTagRef?.current?.addEventListener("pause", pause);
        audioTagRef?.current?.addEventListener("play", play);

        return () => {
            audioTagRef?.current?.removeEventListener("pause", pause);
            audioTagRef?.current?.removeEventListener("play", play);
        };
    }, [sound]);

    const toggleMediaPlayer = () => {
        const audioTag = audioTagRef.current;

        if (!audioTag.paused) {
            audioTag.pause();
        } else {
            audioTag.play();
        }
        setSound(!audioTag.paused);

    };

    return (
        <div onClick={toggleMediaPlayer} className="playButton">
            {sound ? <PauseOutlined style={{fill: "#000", fontSize: 34}}/> :
                <PlayArrow style={{fill: "#000", fontSize: 34}}/>}
        </div>
    );
};

const SoundControl = ({audioTagRef}) => {
    const [volume, setVolume] = useState(JSON.parse(localStorage.getItem("volume")) || 1);

    useEffect(() => {
        audioTagRef.current.volume = volume;
        localStorage.setItem("volume", JSON.stringify(volume));
    }, [volume]);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            padding: "0 20px",
            gap: 6,
        }}>
            {volume === 0 ? <VolumeOffOutlined/> : volume < 0.5 ? <VolumeDownOutlined/> : <VolumeUpOutlined/>}

            <ProgressBarChangeable width={"30%"}
                                   onMountCallback={(ref) => {
                                       ref.current.style.width = `${volume * 100}%`
                                   }}
                                   onMouseDown={(progressPerc) => {
                                       audioTagRef.current.volume = progressPerc;
                                       setVolume(progressPerc);
                                   }}/>
        </div>
    );
};
export const MediaPlayer = () => {
    const audioTagRef = useRef();
    const {currentSong, setCurrentSong} = useContext(SongContext);
    const {songQueue} = useSongQueue();
    const [timeIndicator, setTimeIndicator] = useState({
        current: convertToMinute(), duration: convertToMinute(0)
    });
    const [repeat, setRepeat] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [shuffledQueue, setShuffledQueue] = useState([]);

    useEffect(() => {
        const handleEnd = () => {
            playNextSong();
        }
        const handleChange = (event) => {
            if (event.key === "MediaTrackNext") {
                playNextSong();
            } else if (event.key === "MediaTrackPrevious") {
                playPrevSong();
            }
        };
        const audioTag = audioTagRef.current;
        if (!audioTag)
            return;

        document.addEventListener('keydown', handleChange);
        audioTag.addEventListener('ended', handleEnd);

        return () => {
            audioTag.removeEventListener('ended', handleEnd);
            document.removeEventListener('keydown', handleChange);
        }
    }, [audioTagRef, songQueue, currentSong]);


    const updateSoundProgressBar = (ref) => {
        const changeBar = () => {
            const audioTag = audioTagRef.current;
            if (!audioTag)
                return
            ref.current.style.width = `${audioTag.currentTime / audioTag.duration * 100}%`;

            setTimeIndicator({
                current: convertToMinute(audioTag.currentTime),
                duration: convertToMinute(audioTag.duration || 0),
            });
        }
        const interval = setInterval(changeBar, 1000);
        changeBar();
        return interval;
    };

    const playNextSong = () => {
        if (repeat) {
            audioTagRef.current.currentTime = 0;
            audioTagRef.current.play();
            return;
        }
        const songList = songQueue;
        const nextSong = songList[songList.findIndex(song => song.id === currentSong.id) + 1];
        nextSong !== undefined && setCurrentSong(nextSong);
    }

    const playPrevSong = () => {
        const songList = songQueue;
        const prevSong = songList[songList.findIndex(song => song.id === currentSong.id) - 1];
        prevSong !== undefined && setCurrentSong(prevSong);
    }

    return (
        <div className="mediaPlayer">
            {currentSong
                ? (
                    <SongCover song={currentSong} album={currentSong.album} indicatePlaying={false}/>
                ) : (
                    <div className="songCardCover"></div>
                )
            }
            <div style={{
                flex: 6,
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{
                    margin: '0 0 0.2rem',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 20
                }}>
                    <Shuffle
                        className="controlButton"
                        sx={{
                            cursor: "pointer",
                            color: shuffle ? "white" : "gray"
                        }}
                        onClick={() => setShuffle(!shuffle)}
                    />
                    <SkipPrevious
                        className="controlButton"
                        onClick={playPrevSong}
                        sx={{cursor: "pointer"}}
                    />
                    <ControlButton audioTagRef={audioTagRef}/>
                    <SkipNext
                        className="controlButton"
                        onClick={playNextSong}
                        sx={{cursor: "pointer"}}
                    />
                    <Repeat
                        className="controlButton"
                        sx={{
                            cursor: "pointer",
                            color: repeat ? "white" : "gray"
                        }}
                        onClick={() => setRepeat(!repeat)}
                    />
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                }}>
                    {timeIndicator.current}
                    <ProgressBarChangeable
                        width={`100%`}
                        intervalCallback={updateSoundProgressBar}
                        onMouseDown={(progressPerc) => {
                            let duration = audioTagRef.current.duration || 1;
                            audioTagRef.current.currentTime = parseInt(duration * progressPerc);
                        }}/>
                    {timeIndicator.duration}
                </div>

            </div>
            <audio
                ref={audioTagRef}
                src={currentSong && config.api.stream(currentSong.id)}
                autoPlay
                preload="none"
            >
            </audio>
            <div style={{
                flex: 3,
            }}>
                <SoundControl audioTagRef={audioTagRef}/>
            </div>
        </div>
    )
}