import {forwardRef, useContext, useEffect, useRef, useState} from "react";
import {SongContext} from "./contexts/songContext";
import {SongCover} from "./components/SongCover";
import {config} from "./config";
import {PlayArrowOutlined, Pause, PauseOutlined, VolumeUpOutlined} from "@mui/icons-material";
import {ProgressBarChangeable} from "./components/ProgressBarChangeable";

const convertToMinute = (time) => {
    const seconds = parseInt(time % 60);
    return `${parseInt(time / 60)}:${seconds < 10 ? `0${seconds}` : seconds}`
}


const ControlButton = ({audioTagRef}) => {
    const {sound, setSound} = useContext(SongContext);

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
                <PlayArrowOutlined style={{fill: "#000", fontSize: 34}}/>}
        </div>
    );
};

const SoundControl = ({audioTagRef}) => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            padding: "0 20px",
            gap: 6,
        }}>
            <VolumeUpOutlined/>
            <ProgressBarChangeable width={"30%"}
                                   onMount={(ref) => {
                                       ref.current.style.width = `${audioTagRef.current.volume * 100}%`
                                   }}
                                   onMouseDown={(progressPerc) => audioTagRef.current.volume = progressPerc}/>
        </div>
    );
};
export const MediaPlayer = () => {
    const audioTagRef = useRef();
    const {currentSong} = useContext(SongContext);
    const [timeIndicator, setTimeIndicator] = useState(
        {current: convertToMinute(0), duration: convertToMinute(0)}
    );


    const updateSoundProgressBar = (ref) => {
        setInterval(() => {
            const audioTag = audioTagRef.current;
            if (!audioTag)
                return
            ref.current.style.width = `${audioTag.currentTime / audioTag.duration * 100}%`;

            setTimeIndicator({
                current: convertToMinute(audioTag.currentTime),
                duration: convertToMinute(audioTag.duration),
            });
        }, 100);
    };

    return (
        <div className="mediaPlayer">
            {currentSong ? <SongCover song={currentSong}/> : <div className="songCardCover"></div>}
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
                    {timeIndicator.current}
                    <ProgressBarChangeable
                        width={`100%`}
                        onMount={updateSoundProgressBar}
                        onMouseDown={(progressPerc) => {
                            audioTagRef.current.currentTime = parseInt(audioTagRef.current.duration * progressPerc)
                        }}/>
                    {timeIndicator.duration}
                </div>

            </div>
            <audio
                ref={audioTagRef}
                src={currentSong && config.api.stream(currentSong.id)}
                autoPlay
                preload="auto">

            </audio>
            <div style={{
                flex: 3,
            }}>
                <SoundControl audioTagRef={audioTagRef}/>
            </div>
        </div>
    )
}