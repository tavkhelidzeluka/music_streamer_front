import {useContext, useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {config} from "../config";
import {Favorite, Home, HomeOutlined, LibraryMusic, Search, VolumeUp} from "@mui/icons-material";
import {MediaPlayer} from "../MediaPlayer";
import {APIClientSecure} from "../api";
import {Box,} from "@mui/material";
import Loading from "../components/Loading";
import usePlaylists from "../hooks/usePlaylists";
import {SongContext} from "../context/songContext";
import InfiniteScrollBox from "../components/InfiniteScrollBox";

const PlaylistCard = ({text, customCover, checkIsSelected, onClick}) => {
    const {currentSong, sound} = useContext(SongContext);
    const [isPlaying, setIsPlaying] = useState(sound && checkIsSelected(currentSong));
    const [isSelected, setIsSelected] = useState(checkIsSelected(currentSong));

    useEffect(() => {
        const isCurrentPlaylist = checkIsSelected(currentSong);
        setIsPlaying(sound && isCurrentPlaylist);
        setIsSelected(isCurrentPlaylist);
    }, [currentSong, sound]);

    return (
        <div className="albumCard"
             style={{
                 display: "flex",
                 alignItems: "center",
                 gap: 10,
                 marginBottom: 10
             }}
             onClick={onClick}>
            {customCover ? customCover : (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#272727",
                    width: 56,
                    height: 56,
                    borderRadius: 10
                }}>
                    <LibraryMusic style={{width: 23, height: 23}}/>
                </div>
            )}
            <Box
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: isSelected ? "#1fdf64" : "#a7a7a3",
                    flexGrow: "1",
                }}
            >
                <span>
                    {text}
                </span>
                {isPlaying && <VolumeUp/>}
            </Box>
        </div>
    );
}


export const HomeView = () => {
    const {playlists, setPlaylists} = usePlaylists();
    const {currentSong} = useContext(SongContext);


    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlbums = async () => {
            setLoading(true);
            try {
                const response = await APIClientSecure.get(
                    config.api.playlist.list
                );
                const data = await response.data;
                setPlaylists(data);
                setLoading(false);
            } catch (e) {
                navigate("/sign/in/");
            }
        }
        fetchAlbums();
    }, []);

    return (
        <div style={{display: "flex", flexFlow: "column", height: "100%"}}>
            <div style={{
                display: "flex",
                gap: 10,
                padding: 10,
                flex: "1 1 auto",
                maxHeight: "87%",
            }}>
                <div style={{flex: 3, display: "flex", flexFlow: "column", gap: 10}}>
                    <div className="contentTile">
                        <div
                            className="buttonLink"
                            style={{
                                marginBottom: "1rem",
                                padding: 6,
                                color: location.pathname === "/" ? "white" : "#a7a7a3"
                            }}
                            onClick={() => navigate("/")}>
                            {location.pathname === "/"
                                ? (
                                    <Home sx={{fontSize: 30}}/>
                                ) : (
                                    <HomeOutlined sx={{fontSize: 30}}/>
                                )
                            } Home
                        </div>
                        <div
                            className="buttonLink"
                            style={{padding: 6, color: location.pathname === "/search/" ? "white" : "#a7a7a3"}}
                            onClick={() => navigate("/search/")}
                        >
                            <Search sx={{fontSize: 30}}/> Search
                        </div>
                    </div>
                    <div className="contentTile"
                         style={{
                             flex: "1 1 auto",
                             display: "flex",
                             flexDirection: "column",
                         }}
                    >
                        <InfiniteScrollBox
                            loading={loading}
                            onLoad={() => null}
                            sx={{
                                padding: 0,
                            }}
                        >

                            <PlaylistCard
                                onClick={
                                    () => {
                                        navigate(`/favorites/`);
                                    }
                                }
                                customCover={(
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        background: "linear-gradient(135deg, #4205ed, #b3d9ce)",
                                        width: 56,
                                        height: 56,
                                        borderRadius: 10
                                    }}>
                                        <Favorite style={{width: 23, height: 23}}/>
                                    </div>
                                )}
                                text="Favorites"
                                checkIsSelected={(currentSong) => currentSong?.playedFrom?.type === "favorites"}/>
                            {playlists.map(playlist => <PlaylistCard
                                key={playlist.id}
                                text={playlist.name}
                                onClick={
                                    () => {
                                        navigate(`/playlist/${playlist.id}/`);
                                    }
                                }
                                checkIsSelected={(currentSong) => currentSong?.playedFrom?.type === "playlist" && currentSong?.playedFrom?.data?.id === playlist.id}/>
                            )}
                        </InfiniteScrollBox>
                    </div>
                </div>
                <Box
                    className="contentTile"
                    sx={{
                        flex: 6,
                        overflowY: "hidden",
                        maxHeight: "100%",
                        padding: 0,
                    }}
                >
                    {loading ? (
                        <Loading/>
                    ) : (
                        <Outlet/>
                    )}

                </Box>
                <div className="contentTile" style={{flex: 3, display: "flex"}}>
                    {currentSong && (
                        <InfiniteScrollBox>
                            <img
                                style={{
                                    borderRadius: 6,
                                }}
                                src={currentSong.album.cover}
                                alt={currentSong.name}
                                width="100%"

                            />
                            <h2
                                style={{
                                    margin: '1rem 0',
                                }}
                            >
                                {currentSong.name}
                            </h2>
                            <Box
                                style={{
                                    margin: 0,
                                }}
                            >
                                {currentSong.artists.map(artist => (
                                    <Box
                                        key={artist.id}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            borderRadius: 2,
                                            background: "#272727",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                background: `linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${artist.avatar})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                height: 300,
                                                padding: 1,
                                            }}
                                        >
                                            <h3 style={{ fontSize: 14}}>
                                                About {artist.name}
                                            </h3>
                                        </Box>
                                        <Box
                                            sx={{
                                                padding: 1
                                            }}
                                        >
                                            <p>
                                                {artist.bio.slice(0, 100)} ...
                                            </p>
                                        </Box>

                                    </Box>
                                ))}
                            </Box>
                        </InfiniteScrollBox>
                    )}
                </div>
            </div>
            <MediaPlayer/>
        </div>
    );
};


export default HomeView;
