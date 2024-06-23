import './App.css';
import {useContext, useEffect, useRef, useState} from "react";
import {SongContext} from './contexts/songContext';
import {MediaPlayer} from "./MediaPlayer";
import {SoundContext} from "./contexts/soundContext";
import {SongCard} from "./components/SongCard";
import {config} from "./config";




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
            <div className="App">
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    padding: "3rem"
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
                {<MediaPlayer/>}
            </div>
        </SongContext.Provider>
    );
}

export default App;
