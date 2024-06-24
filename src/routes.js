import {SongList} from "./views/SongList";
import {AlbumView} from "./views/AlbumView";
import {PlaylistView} from "./views/PlaylistView";

export const routes = {
    songs: <SongList/>,
    album: (id) => <AlbumView id={id}/>,
    playlist: (id) => <PlaylistView id={id}/>
};