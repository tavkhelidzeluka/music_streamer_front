import {useEffect, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";

export const SongList = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            const response = await fetch(config.api.songs);
            const data = await response.json();
            setSongs(data);

        };

        fetchSongs();
    }, []);

    return (
        <>
            <div style={{
                display: "flex",
                padding: 2,
                marginBottom: '1rem',
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
        </>
    );
};
