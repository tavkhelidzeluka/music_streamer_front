import {useState} from "react";
import {Input, TextField} from "@mui/material";

const SearchView = () => {
    const [search, setSearch] = useState(null);

    return (
        <>
            <div>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="What do you want to play?"
                    sx={{
                        background: "#2a2a2a",
                        borderRadius: 6,
                        color: "#fff",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 6,
                            '& .MuiInputBase-input': {
                                color: 'white',
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: '#757575'
                            },
                        }
                    }}
                />
            </div>
        </>
    )
};


export default SearchView;