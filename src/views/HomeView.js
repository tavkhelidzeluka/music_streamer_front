import {useContext, useEffect, useRef, useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {config} from "../config";
import {Favorite, Home, HomeOutlined, LibraryMusic, Search} from "@mui/icons-material";
import {MediaPlayer} from "../MediaPlayer";
import {APIClientSecure} from "../api";
import {Box,} from "@mui/material";
import Loading from "../components/Loading";
import usePlaylists from "../hooks/usePlaylists";
import {SongContext} from "../context/songContext";

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
    console.log(currentSong);

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
                    <div className="contentTile" style={{flex: "1 1 auto"}}>
                        <div className="albumCard"
                             style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 10,
                                 marginBottom: 10
                             }}
                             onClick={() => {
                                 navigate(`/favorites/`);
                             }}>
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
                            Favorites
                        </div>
                        {playlists.map(playlist => (
                            <div key={playlist.id}
                                 className="albumCard"
                                 style={{
                                     display: "flex",
                                     alignItems: "center",
                                     gap: 10,
                                     marginBottom: 10
                                 }}
                                 onClick={() => {
                                     navigate(`/playlist/${playlist.id}`);
                                 }}>
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
                                {playlist.name}
                            </div>
                        ))}
                    </div>
                </div>
                <Box
                    className="contentTile"
                    sx={{
                        flex: 6,
                        overflowY: "hidden",
                        maxHeight: "100%",
                        padding: 0
                    }}
                >
                    {loading ? (
                        <Loading/>
                    ) : (
                        <Outlet/>
                    )}

                </Box>
                <div className="contentTile" style={{flex: 3}}>
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
                            margin: 0
                        }}
                    >
                        {currentSong.name}
                    </h2>
                    <p
                        style={{
                            margin: 0,
                            color: "#a7a7a3"
                        }}
                    >
                        {currentSong.artists.map(artist => <small key={artist.id}>{artist.name}</small>)}
                    </p>

                </div>
            </div>
            <MediaPlayer/>
        </div>
    );
};


export default HomeView;
