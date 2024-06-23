import './App.css';
import {useEffect, useState} from "react";
import {SongContext} from './contexts/songContext';
import {MediaPlayer} from "./MediaPlayer";
import {config} from "./config";
import {HomeOutlined, Search} from "@mui/icons-material";
import {SongList} from "./views/SongList";
import {AlbumView} from "./views/AlbumView";


const routes = {
    'songs': <SongList/>,
    'album': (id) => <><AlbumView id={id}/></>
};

function App() {
    const [currentSong, setCurrentSong] = useState(null);
    const [sound, setSound] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [currentView, setCurrentView] = useState(routes.songs);

    useEffect(() => {
        const fetchAlbums = async () => {
            const response = await fetch(config.api.album.list);
            const data = await response.json();
            setAlbums(data);
        }

        fetchAlbums();
    }, []);

    return (
        <SongContext.Provider value={{currentSong, setCurrentSong, sound, setSound}}>
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
                            {albums.map(album => (
                                <div key={album.id}
                                     className="songCard"
                                     style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 10}}
                                     onClick={() => {
                                         setCurrentView(routes.album(album.id));
                                     }}>
                                    <img src={album.cover} height={56} width={56} style={{borderRadius: "50%"}}/>
                                    {album.title}
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


        </SongContext.Provider>
    );
}

export default App;
