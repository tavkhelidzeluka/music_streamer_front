import {Box} from "@mui/material";
import InfiniteScrollBox from "./InfiniteScrollBox";
import {PauseOutlined, PlayArrow} from "@mui/icons-material";
import {SongCard} from "./SongCard";
import React, {useContext, useEffect, useState} from "react";
import {SongContext} from "../context/songContext";
import useSongQueue from "../hooks/useSongQueue";

export const SongCollection = (
    {
        songs,
        collectionCover,
        collectionName,
        totalSongs = 0,
        checkIsPlaying = (currentSong) => false,
        extras = () => ({}),
        subNav = null,
    }
) => {
    const {setCurrentSong, setSound, currentSong, sound} = useContext(SongContext);
    const {setSongQueue} = useSongQueue();
    const [isPlaying, setIsPlaying] = useState(sound && checkIsPlaying(currentSong));

    const switchSong = (song) => {
        setSongQueue(
            songs.map(song => ({
                ...song,
                ...extras(),
            }))
        );
        setCurrentSong({
            ...song,
            ...extras(),
        });
    }

    useEffect(() => {
        setIsPlaying(sound && checkIsPlaying(currentSong));
    }, [currentSong, sound, checkIsPlaying]);

    const handlePlay = () => {
        if (isPlaying) {
            setSound(false);
            setIsPlaying(false);
            return;
        }
        if (checkIsPlaying(currentSong)) {
            setSound(true);
            setIsPlaying(true);
            return;
        }

        switchSong(songs[0]);
        setSound(true);
        setIsPlaying(true);
    }
    return (
        <Box
            sx={{
                position: "relative",
                background: "linear-gradient(180deg, #1e3264 0, #121212 40%)",
                padding: 0,
                overflowY: "hidden",
                maxHeight: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <InfiniteScrollBox
                loading={false}
                onLoad={() => null}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: 6,
                        marginBottom: '1rem',
                        gap: "1rem",
                    }}
                >
                    {collectionCover}
                    <div>
                        <h1 style={{fontSize: 48}}>
                            {collectionName}
                        </h1>
                        <small style={{fontSize: 11}}>
                            {totalSongs} Songs
                        </small>
                    </div>
                </div>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                    }}
                >
                    <Box
                        className="playButton"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#1fdf64",
                            borderRadius: "50%",
                            width: 48,
                            height: 48,
                        }}
                        onClick={handlePlay}

                    >
                        {isPlaying ? (
                            <PauseOutlined
                                sx={{
                                    fontSize: 24,
                                    color: "black"
                                }}
                            />
                        ) : (
                            <PlayArrow
                                sx={{
                                    fontSize: 24,
                                    color: "black"
                                }}
                            />
                        )}
                    </Box>
                    {subNav}
                </Box>
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
                {songs.map((song, i) => (
                    <SongCard
                        onPlay={() => {
                            setIsPlaying(true);
                            switchSong(song);
                        }}
                        onPause={() => {
                            setIsPlaying(false);
                        }}
                        key={song.id} song={song} number={i + 1}
                    />
                ))}
            </InfiniteScrollBox>

        </Box>
    );
};

export default SongCollection;