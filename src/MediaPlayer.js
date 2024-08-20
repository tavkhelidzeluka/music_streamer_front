import {useContext, useEffect, useRef, useState} from "react";
import {SongContext} from "./context/songContext";
import {SongCover} from "./components/SongCover";
import {config} from "./config";
import {
    PauseOutlined,
    VolumeUpOutlined,
    VolumeDownOutlined,
    VolumeOffOutlined, PlayArrow, SkipNext, SkipPrevious
} from "@mui/icons-material";
import {ProgressBarChangeable} from "./components/ProgressBarChangeable";
import {APIClient} from "./api";
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
    const [volume, setVolume] = useState(1);

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
                                       ref.current.style.width = `${audioTagRef.current.volume * 100}%`
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
    const [timeIndicator, setTimeIndicator] = useState(
        {current: convertToMinute(0), duration: convertToMinute(0)}
    );


    useEffect(() => {
        const handleEnd = () => {
            playNextSong();
        }
        const handleChange = (event) => {
            if (event.key === "MediaTrackNext") {
                console.log("Play next");
                playNextSong();
            } else if (event.key === "MediaTrackPrevious") {
                console.log("play Prev")
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
                duration: convertToMinute(audioTag.duration),
            });
        }
        const interval = setInterval(changeBar, 1000);
        changeBar();
        return interval;
    };

    const playNextSong = () => {
        const nextSong = songQueue[songQueue.findIndex(song => song.id === currentSong.id) + 1];
        nextSong !== undefined && setCurrentSong(nextSong);
    }
    const playPrevSong = () => {
        const prevSong = songQueue[songQueue.findIndex(song => song.id === currentSong.id) - 1];
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
                    margin: '0 0 1rem',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 20
                }}>
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
                            audioTagRef.current.currentTime = parseInt(audioTagRef.current.duration * progressPerc);
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