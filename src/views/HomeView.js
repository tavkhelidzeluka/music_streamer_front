import {useEffect, useRef, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {config} from "../config";
import {HomeOutlined, LibraryMusic, Search} from "@mui/icons-material";
import {MediaPlayer} from "../MediaPlayer";
import {APIClientSecure} from "../api";
import {Box,} from "@mui/material";
import AvatarWithUserControls from "../components/AvatarWithUserControls";
import ScrollBar from "../components/ScrollBar";

export const HomeView = () => {
    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();
    const scrollableRef = useRef();

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await APIClientSecure.get(
                    config.api.playlist.list
                );
                const data = await response.data;
                setPlaylists(data);
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
                        <div className="buttonLink" style={{marginBottom: "1rem", padding: 6}}
                             onClick={() => navigate("/")}>
                            <HomeOutlined style={{fontSize: 30}}/> Home
                        </div>
                        <div className="buttonLink" style={{padding: 6}}
                             onClick={() => navigate("/search/")}>
                            <Search style={{fontSize: 30}}/> Search
                        </div>
                    </div>
                    <div className="contentTile" style={{flex: "1 1 auto"}}>
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
                <div
                    className="contentTile"
                    style={{
                        position: "relative",
                        background: "linear-gradient(180deg, #1e3264 0, #121212 40%)",
                        flex: 6,
                        overflowY: "hidden",
                        padding: 0,
                        maxHeight: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <Box
                        sx={{
                            position: "sticky",
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
                            flex: 1,
                            overflowY: "scroll",
                            height: "100%",
                            padding: "2rem",
                        }}
                    >
                        <Outlet/>
                    </Box>
                    <ScrollBar
                        scrollableRef={scrollableRef}
                    />
                </div>
                <div className="contentTile" style={{flex: 3}}>

                </div>
            </div>
            <MediaPlayer/>
        </div>
    );
};


export default HomeView;
