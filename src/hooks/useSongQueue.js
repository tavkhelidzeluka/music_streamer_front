import {useContext} from "react";
import {SongQueueContext} from "../context/SongQueueProvider";

const useSongQueue = () => useContext(SongQueueContext);

export default useSongQueue;