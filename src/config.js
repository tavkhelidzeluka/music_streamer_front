const API_BASE_URL = 'http://localhost:8000';
export const config = {
    api: {
        songs: `${API_BASE_URL}/songs/`,
        stream: (id) => `${API_BASE_URL}/songs/${id}/stream/`,
        album: {
            list: `${API_BASE_URL}/albums/`,
            detail: (id) => `${API_BASE_URL}/albums/${id}/`,
        },
        playlist: {
            list: `${API_BASE_URL}/playlists/`,
            names: `${API_BASE_URL}/playlists/names/`,
            detail: (id) => `${API_BASE_URL}/playlists/${id}/`,
            addSong: (id) => `${API_BASE_URL}/playlists/${id}/add_song/`,
            updatePlaylists: `${API_BASE_URL}/playlists/update_playlists/`
        },
        auth: {
            token: `${API_BASE_URL}/api/token/`,
            refresh: `/api/token/refresh/`,
            verify: `${API_BASE_URL}/api/token/verify/`,
        }
    }
};