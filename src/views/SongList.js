import {useEffect, useState} from "react";
import {config} from "../config";
import {useNavigate} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box} from "@mui/material";
import AvatarWithUserControls from "../components/AvatarWithUserControls";
import SongListTable from "./SongListTable";
import InfiniteScrollBox from "../components/InfiniteScrollBox";

export const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const fetchSongs = async () => {
        try {
            console.debug(`Fetch Songs page: ${page}`);
            setLoading(true);
            const response = await APIClientSecure.get(`${config.api.songs}?page=${page}`);
            const {results} = await response.data;
            setSongs(prev => [...prev, ...results]);
            setLoading(false);
        } catch (error) {
            if (error?.response) {
                if (error.response?.status === 401) {
                    navigate("/sign/in/");
                }
            }
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

    useEffect(() => {
        fetchAlbums();
    }, []);

    useEffect(() => {
        fetchSongs();
    }, [page]);

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
            <InfiniteScrollBox
                sx={{
                    marginTop: "64px"
                }}
                loading={loading}
                onLoad={() => setPage((prev) => prev + 1)}
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
                                <img src={album.cover} width={50}
                                     style={{borderRadius: "6px", marginRight: "1rem"}}/>
                                {album.title}
                            </div>
                        )
                    })}

                </div>
                <SongListTable
                    songs={songs}
                />
            </InfiniteScrollBox>


        </Box>
    );
};
