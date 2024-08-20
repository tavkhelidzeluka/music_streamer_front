import {Box} from "@mui/material";
import InfiniteScrollBox from "./InfiniteScrollBox";
import {PlayArrow} from "@mui/icons-material";
import {SongCard} from "./SongCard";
import {useContext, useEffect, useState} from "react";
import {SongContext} from "../context/songContext";
import useSongQueue from "../hooks/useSongQueue";

export const SongCollection = ({songs, collectionCover, collectionName, totalSongs = 0}) => {
    const {setCurrentSong} = useContext(SongContext);
    const {setSongQueue} = useSongQueue();

    const handlePlay = () => {
        setSongQueue(songs);
        setCurrentSong(songs[0]);
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
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "linear-gradient(135deg, #4205ed, #b3d9ce)",
                        width: 200,
                        height: 200,
                        borderRadius: 6
                    }}>
                        {collectionCover}
                    </div>
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
                    >
                        <PlayArrow
                            onClick={handlePlay}
                            sx={{
                                fontSize: 24,
                                color: "black"
                            }}
                        />
                    </Box>
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
                            setSongQueue(songs);
                        }}
                        key={song.id} song={song} number={i + 1}
                    />
                ))}
            </InfiniteScrollBox>

        </Box>
    );
};

export default SongCollection;