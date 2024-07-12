import {useEffect, useRef, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {Link, useNavigate} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box} from "@mui/material";
import AvatarWithUserControls from "../components/AvatarWithUserControls";
import ScrollBar from "../components/ScrollBar";

export const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const navigate = useNavigate();
    const scrollableRef = useRef();


    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await APIClientSecure.get(config.api.songs);
                const data = await response.data;
                setSongs(data);
            } catch (error) {
                navigate("/sign/in/");
            }
        };

        const fetchAlbums = async () => {
            try {
                const response = await APIClientSecure.get(config.api.album.list);
                const data = await response.data;
                setAlbums(data);
            } catch (error) {
                navigate("/sign/in/");
            }
        }

        fetchSongs();
        fetchAlbums();
    }, []);

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
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 1rem",
                    background: "#121212",
                    boxSizing: "border-box",
                }}
            >
                <AvatarWithUserControls/>
            </Box>
            <Box
                ref={scrollableRef}
                sx={{
                    overflowY: "scroll",
                    padding: 2,
                    marginTop: "64px",
                }}
            >
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginBottom: "1rem"
                }}>
                    {albums.map(album => {
                        return (
                            <div key={album.id}
                                 style={{width: "50%"}}
                                 className="albumCard"
                                 onClick={() => navigate(`/album/${album.id}/`)}>
                                <img src={album.cover} width={50} style={{borderRadius: "6px", marginRight: "1rem"}}/>
                                {album.title}
                            </div>
                        )
                    })}

                </div>
                <div>
                    <Box
                        sx={{
                            display: "flex",
                            padding: 1,
                            marginBottom: '1rem',
                            borderBottom: "1px solid gray"
                        }}
                    >
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
                        <div
                            style={{
                                flex: 1,
                            }}>
                            Album
                        </div>
                        <div
                            style={{
                                flex: 0.2,
                            }}>

                        </div>
                    </Box>
                    {songs.map((song, i) => <SongCard key={song.id} song={song} number={i + 1}/>)}
                </div>
            </Box>
            <ScrollBar
                scrollableRef={scrollableRef}
                offset={64}
            />
        </Box>
    );
};
