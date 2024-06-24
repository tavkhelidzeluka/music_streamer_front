import './App.css';
import {useContext, useEffect, useReducer, useState} from "react";
import {MediaPlayer} from "./MediaPlayer";
import {config} from "./config";
import {HomeOutlined, LibraryMusic, Search} from "@mui/icons-material";
import {SongContext} from './contexts/songContext';
import {ViewContext} from "./contexts/viewContext";
import {UserContext} from "./contexts/userContext";
import {routes} from "./routes";
import {createBrowserRouter, redirect, RouterProvider, useNavigate} from "react-router-dom";
import {authenticate, getUser, validateToken} from "./authentication";

const Home = () => {
    const [playlists, setPlaylists] = useState([]);
    const [currentView, setCurrentView] = useState(routes.songs);
    const {user} = useContext(UserContext);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchAlbums = async () => {
            const response = await fetch(
                config.api.playlist.list,
                {
                    headers: {
                        "Authorization": `Bearer ${user.access}`
                    }
                }
            );
            const data = await response.json();
            setPlaylists(data);
        }
        user && fetchAlbums();
    }, [user]);


    return (
        <div style={{display: "flex", flexFlow: "column", height: "100%"}}>
            <div style={{
                display: "flex",
                gap: 10,
                padding: 10,
                flex: "1 1 auto",
                maxHeight: "87%",
            }}>
                <div style={{flex: 3, display: "flex", flexFlow: "column", gap: 10}}>
                    <div className="contentTile">
                        <div className="buttonLink" style={{marginBottom: "1rem", padding: 6}}
                             onClick={() => setCurrentView(routes.songs)}>
                            <HomeOutlined style={{fontSize: 30}}/> Home
                        </div>
                        <div className="buttonLink" style={{padding: 6}}>
                            <Search style={{fontSize: 30}}/> Search
                        </div>
                    </div>
                    <div className="contentTile" style={{flex: "1 1 auto"}}>
                        {playlists.map(playlist => (
                            <div key={playlist.id}
                                 className="albumCard"
                                 style={{
                                     display: "flex",
                                     alignItems: "center",
                                     gap: 10,
                                     marginBottom: 10
                                 }}
                                 onClick={() => {
                                     setCurrentView(routes.playlist(playlist.id));
                                 }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    background: "#272727",
                                    width: 56,
                                    height: 56,
                                    borderRadius: 10
                                }}>
                                    <LibraryMusic style={{width: 23, height: 23}}/>
                                </div>
                                {playlist.name}
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className="contentTile"
                    style={{
                        flex: 6,
                        overflowY: "scroll",
                        maxHeight: "100%",
                    }}>
                    {currentView}
                </div>
                <div className="contentTile" style={{flex: 3}}>

                </div>
            </div>
            <MediaPlayer/>
        </div>
    );
};

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();


    const submit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const userData = await authenticate(username, password);
        if (userData) {
            setUser(userData);
            navigate("/");
        }
    };

    return (
        <form>
            <label>
                Username:
                <input onChange={(e) => setUsername(e.target.value)} value={username}/>
            </label>
            <label>
                Password
                <input onChange={(e) => setPassword(e.target.value)} value={password}/>
            </label>
            <button onClick={submit}>Sign In</button>
        </form>
    );
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
        loader: async () => {
            const tokenIsValid = await validateToken();
            console.log(tokenIsValid)

            if (!tokenIsValid)
                throw redirect('/sign/in/');

            return null;
        }
    },
    {
        path: '/sign/in/',
        element: <SignIn/>,
    }
]);

function App() {
    const [currentSong, setCurrentSong] = useState(null);
    const [sound, setSound] = useState(false);
    const [currentView, setCurrentView] = useState(routes.songs);
    const [user, setUser] = useState(getUser());

    return (
        <UserContext.Provider value={{user, setUser}}>
            <ViewContext.Provider value={{currentView, setCurrentView}}>
                <SongContext.Provider value={{currentSong, setCurrentSong, sound, setSound}}>
                    <RouterProvider router={router}/>
                </SongContext.Provider>
            </ViewContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
