import {SongList} from "./views/SongList";
import {AlbumView} from "./views/AlbumView";

export const routes = {
    'songs': <SongList/>,
    'album': (id) => <><AlbumView id={id}/></>
};