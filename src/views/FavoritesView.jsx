import {useContext, useEffect, useRef, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {Favorite, LibraryMusic, PlayArrow} from "@mui/icons-material";
import {useNavigate, useParams} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box} from "@mui/material";
import {SongContext} from "../context/songContext";
import useSongQueue from "../hooks/useSongQueue";
import InfiniteScrollBox from "../components/InfiniteScrollBox";


export const FavoritesView = () => {
    const {id} = useParams();
    const [songs, setSongs] = useState([]);
    const {setCurrentSong} = useContext(SongContext);
    const {setSongQueue} = useSongQueue();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await APIClientSecure.get(
                    config.api.favorites
                );
                const data = await response.data;
                console.log(data)
                setSongs(data);
            } catch (e) {
                if (e?.response) {
                    if (e.response?.status === 401) {
                        navigate("/sign/in/");
                    } else {
                        navigate("/");
                    }
                }
            }
        }
        fetchPlaylist();
    }, [id]);

    const handlePlay = () => {
        setSongQueue(songs);
        setCurrentSong(songs[0]);
        console.log(songs[0])
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
                <div style={{
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
                        width: 256,
                        height: 256,
                        borderRadius: 10
                    }}>
                        <Favorite style={{width: 128, height: 128}}/>
                    </div>
                    <div>
                        <div style={{fontSize: 48}}>Favorites</div>
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

export default FavoritesView;
