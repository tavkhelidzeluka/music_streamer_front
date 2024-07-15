import {useEffect, useRef, useState} from "react";
import {Box, Input, TextField, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import AvatarWithUserControls from "../components/AvatarWithUserControls";
import {APIClientSecure} from "../api";
import {config} from "../config";
import {useNavigate} from "react-router-dom";
import SongListTable from "./SongListTable";
import ScrollBar from "../components/ScrollBar";
import Loading from "../components/Loading";

const SearchView = () => {
    const [search, setSearch] = useState("");
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const scrollableRef = useRef();


    useEffect(() => {
        const searchSongs = async () => {
            setLoading(true);
            try {
                const response = await APIClientSecure.get(
                    `${config.api.songs}?search=${search}`
                )
                setSongs(response.data);
                setLoading(false);
            } catch (e) {
                navigate("/");
            }
        }

        searchSongs();
    }, [search]);

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
                        onChange={(event) => setSearch(event.target.value)}
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
            <Box
                ref={scrollableRef}
                sx={{
                    marginTop: "64px",
                    overflowY: "scroll",
                    padding: 2,
                }}
            >
                {loading ? (
                    <Loading/>
                ) : (
                    <SongListTable
                        songs={songs}
                    />
                )}

            </Box>
            <ScrollBar
                scrollableRef={scrollableRef}
                offset={64}
            />
        </Box>
    )
};


export default SearchView;