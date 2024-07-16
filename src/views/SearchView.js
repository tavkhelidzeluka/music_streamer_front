import {useEffect, useState} from "react";
import {Box, TextField} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import AvatarWithUserControls from "../components/AvatarWithUserControls";
import {APIClientSecure} from "../api";
import {config} from "../config";
import {useNavigate} from "react-router-dom";
import SongListTable from "./SongListTable";
import InfiniteScrollBox from "../components/InfiniteScrollBox";

const SearchView = () => {
    const [search, setSearch] = useState("");
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const searchSongs = async (newSearch) => {
        setLoading(true);
        try {
            const response = await APIClientSecure.get(
                `${config.api.songs}?search=${search}&page=${page}`
            )
            const {results} = response.data;

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

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setSongs([]);
        setPage(1);
    }

    useEffect(() => {
        searchSongs(true);
    }, [search, page]);


    return (
        <Box
            sx={{
                position: "relative",
                padding: 0,
                overflowY: "hidden",
                maxHeight: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Grid2
                container
                sx={{
                    position: "absolute",
                    width: "100%",
                    padding: "0.5rem 1rem",
                    background: "#121212",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 64
                }}
            >
                <Grid2 xs={10}>
                    <TextField
                        value={search}
                        onChange={handleSearch}
                        variant="outlined"
                        size="small"
                        placeholder="What do you want to play?"
                        sx={{
                            background: "#2a2a2a",
                            borderRadius: 12,
                            color: "#fff",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 12,
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: '#757575'
                                },
                            }
                        }}
                    />
                </Grid2>
                <Grid2
                    xs={2}
                    container
                    sx={{
                        justifyContent: "end"
                    }}
                >
                    <AvatarWithUserControls/>

                </Grid2>
            </Grid2>
            <InfiniteScrollBox
                sx={{
                    marginTop: "64px",
                }}
                loading={loading}
                onLoad={() => setPage(prev => prev + 1)}
            >
                <SongListTable
                    songs={songs}
                />
            </InfiniteScrollBox>
        </Box>
    )
};


export default SearchView;