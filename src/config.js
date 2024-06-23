const API_BASE_URL = 'http://localhost:8000';
export const config = {
    api: {
        songs: `${API_BASE_URL}/songs/`,
        stream: (id) => `${API_BASE_URL}/songs/${id}/stream/`
    }
};