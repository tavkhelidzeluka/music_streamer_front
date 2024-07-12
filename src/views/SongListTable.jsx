import {Box} from "@mui/material";
import {SongCard} from "../components/SongCard";

export const SongListTable = ({songs}) => {
    return (
        <Box>
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
            {songs.map((song, i) => <SongCard key={song.id} song={song} number={i + 1}/>)}
        </Box>
    );
};


export default SongListTable;