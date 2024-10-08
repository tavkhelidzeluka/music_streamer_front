import {useContext} from "react";
import {PlaylistContext} from "../context/PlaylistProvider";

const usePlaylists = () => useContext(PlaylistContext);

export default usePlaylists;