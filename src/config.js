import {BASE_URL} from "./api/APIClient";

export const config = {
    api: {
        songs: `/songs/`,
        stream: (id) => `${BASE_URL}/songs/${id}/stream/`,
        favorites: `/songs/favorites/`,
        like: (id) => `/songs/${id}/like/`,
        isLiked: (id) => `/songs/${id}/is_liked/`,
        album: {
            list: `/albums/`,
            detail: (id) => `/albums/${id}/`,
        },
        playlist: {
            list: `/playlists/`,
            names: `/playlists/names/`,
            detail: (id) => `/playlists/${id}/`,
            addSong: (id) => `/playlists/${id}/add_song/`,
            updatePlaylists: `/playlists/update_playlists/`
        },
        auth: {
            token: `/token/`,
            refresh: `/token/refresh/`,
            clear: `/token/clear/`,
        }
    }
};