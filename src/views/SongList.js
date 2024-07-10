import {useEffect, useState} from "react";
import {config} from "../config";
import {SongCard} from "../components/SongCard";
import {useNavigate} from "react-router-dom";
import {APIClientSecure} from "../api";

export const SongList = () => {
    const [songs, setSongs] = useState([]);
    const navigate = useNavigate();

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

        fetchSongs();
    }, []);

    return (
        <>
            <div style={{
                display: "flex",
                padding: 6,
                marginBottom: '1rem',
                borderBottom: "1px solid gray"
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
            </div>
            {songs.map((song, i) => <SongCard key={song.id} song={song} number={i + 1}/>)}
        </>
    );
};
