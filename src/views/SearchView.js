import {useEffect, useRef, useState} from "react";
import {Box, Input, TextField, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import AvatarWithUserControls from "../components/AvatarWithUserControls";
import {APIClientSecure} from "../api";
import {config} from "../config";
import {useNavigate} from "react-router-dom";
import {SongCard} from "../components/SongCard";

const SearchView = () => {
    const [search, setSearch] = useState("");
    const [songs, setSongs] = useState([]);
    const navigate = useNavigate();
    const scrollableRef = useRef();


    useEffect(() => {
        const searchSongs = async () => {
            console.log(search);
            try {
                const response = await APIClientSecure.get(
                    `${config.api.songs}?search=${search}`
                )
                setSongs(response.data);
            } catch (e) {
                navigate("/");
            }
        }

        searchSongs();
    }, [search]);

    return (
        <Box>
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
                sx={{
                    padding: 2
                }}
            >
                <div>
                    <Box
                        sx={{
                            display: "flex",
                            padding: 1,
                            marginBottom: '1rem',
                            borderBottom: "1px solid gray"
                        }}
                    >
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
                    </Box>
                    {
                        songs.length > 0 ? (
                            songs.map((song, i) => <SongCard key={song.id} song={song} number={i + 1}/>)
                        ) : (
                            <Typography>
                                No Matching Results ...
                            </Typography>
                        )

                    }
                </div>
            </Box>
        </Box>
    )
};


export default SearchView;