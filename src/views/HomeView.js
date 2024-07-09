import {useContext, useEffect, useState} from "react";
import {routes} from "../routes";
import {UserContext} from "../contexts/userContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {config} from "../config";
import {HomeOutlined, LibraryMusic, Search} from "@mui/icons-material";
import {MediaPlayer} from "../MediaPlayer";


export const HomeView = () => {
    const [playlists, setPlaylists] = useState([]);
    const [currentView, setCurrentView] = useState(routes.songs);
    const {user} = useContext(UserContext);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchAlbums = async () => {
            try {

                const response = await axios.get(
                    config.api.playlist.list
                );
                const data = await response.data;
                setPlaylists(data);
            } catch (e) {
                if (e.response && e.response === 401) {
                    navigate("sign/in");
                }
            }

        }
        user && fetchAlbums();
    }, [user]);


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
                             onClick={() => setCurrentView(routes.songs)}>
                            <HomeOutlined style={{fontSize: 30}}/> Home
                        </div>
                        <div className="buttonLink" style={{padding: 6}}>
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
                                     setCurrentView(routes.playlist(playlist.id));
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
                        flex: 6,
                        overflowY: "scroll",
                        maxHeight: "100%",
                    }}>
                    {currentView}
                </div>
                <div className="contentTile" style={{flex: 3}}>

                </div>
            </div>
            <MediaPlayer/>
        </div>
    );
};


export default HomeView;
