import {useEffect, useState} from "react";
import {config} from "../config";
import {useNavigate} from "react-router-dom";
import {APIClientSecure} from "../api";
import {Box, Skeleton} from "@mui/material";
import AvatarWithUserControls from "../components/AvatarWithUserControls";
import SongListTable from "./SongListTable";
import InfiniteScrollBox from "../components/InfiniteScrollBox";
import useSongQueue from "../hooks/useSongQueue";

export const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {songQueue, setSongQueue} = useSongQueue();


    const fetchSongs = async () => {
        try {
            console.debug(`Fetch Songs page: ${page}`);
            setLoading(true);
            const response = await APIClientSecure.get(`${config.api.songs}?page=${page}`);
            const {results, count} = await response.data;
            setTotalPages(count / 20);
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
        if (songQueue.length === 0) {
            setSongQueue(songs);
        }
    }, [songs]);

    useEffect(() => {
        fetchAlbums();
    }, []);

    useEffect(() => {
        if (totalPages === 0 || page <= totalPages)
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
                onLoad={() => {
                    setPage((prev) => prev + 1)
                }}
            >
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridTemplateRows: "repeat(2, 60px)",
                    marginBottom: "1rem",
                    gap: "1rem",
                    width: "100%",
                }}>

                    {albums.length === 0 ? (
                        <>
                            {Array.from({length: 8}).map((_, index) => (
                                <Skeleton key={index} variant="rectangular" height="100%"/>
                            ))}
                        </>
                    ) : (
                        albums.map(album => {
                            return (
                                <div key={album.id}
                                     className="albumCard"
                                     onClick={() => navigate(`/album/${album.id}/`)}>
                                    <img src={album.cover} width={50}
                                         style={{borderRadius: "6px", marginRight: "1rem"}}/>
                                    {album.title}
                                </div>
                            )
                        })
                    )}

                </div>
                <SongListTable
                    songs={songs}
                />
            </InfiniteScrollBox>


        </Box>
    );
};
