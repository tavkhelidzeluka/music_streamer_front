import './App.css';
import {useContext, useEffect, useRef, useState} from "react";
import {SongContext} from './contexts/songContext';
import {MediaPlayer} from "./MediaPlayer";
import {SoundContext} from "./contexts/soundContext";
import {SongCard} from "./components/SongCard";
import {config} from "./config";
import {HomeOutlined, Search} from "@mui/icons-material";


function App() {
    const [currentSong, setCurrentSong] = useState(null);
    const [sound, setSound] = useState(false);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            const response = await fetch(config.api.songs);
            const data = await response.json();
            setSongs(data);

        }

        fetchSongs();
    }, []);

    return (
        <SongContext.Provider value={{currentSong, setCurrentSong, sound, setSound}}>
            <div style={{ display: "flex", flexFlow: "column", height: "100%"}}>

                <div style={{flex: "1 1 auto"}}>
                    <div style={{
                        display: "flex",
                        gap: 10,
                        padding: 10,
                        height: "100%",
                    }}>
                        <div className="contentTile" style={{flex: 3}}>
                            <div className="buttonLink" style={{marginBottom: "1rem"}}>
                                <HomeOutlined style={{fontSize: 30}}/> Home
                            </div>
                            <div className="buttonLink">
                                <Search style={{fontSize: 30}}/> Search
                            </div>
                        </div>
                        <div
                            className="contentTile"
                            style={{
                                display: "flex",
                                flex: 6,
                                flexDirection: "column",
                                justifyContent: "start",
                            }}>
                            <div style={{
                                display: "flex",
                                padding: 2,
                                marginBottom: '4px',
                                borderBottom: "1px solid gray"
                            }}>
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
                            </div>
                            {songs.map(song => <SongCard key={song.id} song={song}/>)}
                        </div>
                        <div className="contentTile" style={{flex: 3}}>

                        </div>
                    </div>
                </div>
                <MediaPlayer/>
            </div>


        </SongContext.Provider>
    );
}

export default App;
