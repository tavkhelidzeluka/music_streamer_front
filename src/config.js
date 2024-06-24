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
            detail: (id) => `${API_BASE_URL}/playlists/${id}/`,
        },
        auth: {
            token: `${API_BASE_URL}/api/token/`,
            refresh: `${API_BASE_URL}/api/token/refresh/`,
            verify: `${API_BASE_URL}/api/token/verify/`,
        }
    }
};