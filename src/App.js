import './App.css';
import {useEffect, useState} from "react";
import {SongContext} from './context/songContext';
import {Route, Routes, useNavigate} from "react-router-dom";
import RequireAuth from "./routePermissions/RequireAuth";
import {HomeView, SignInView} from "./views";
import {AlbumView} from "./views/AlbumView";
import {SongList} from "./views/SongList";
import {PlaylistView} from "./views/PlaylistView";
import SearchView from "./views/SearchView";
import PlaylistProvider from "./context/PlaylistProvider";

const SignOutView = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/sign/in/");
    }, []);

    return (<></>);
}


function App() {
    const [currentSong, setCurrentSong] = useState(
        JSON.parse(localStorage.getItem("currentSong"))
    );
    const [sound, setSound] = useState(false);


    useEffect(() => {
        localStorage.setItem("currentSong", JSON.stringify(currentSong));
    }, [currentSong]);


    return (
        <PlaylistProvider>
            <SongContext.Provider value={{currentSong, setCurrentSong, sound, setSound}}>
                <Routes>
                    <Route element={<RequireAuth/>}>
                        <Route element={<HomeView/>}>
                            <Route path="/" element={<SongList/>}/>
                            <Route path="/album/:id/" Component={AlbumView}/>
                            <Route path="/playlist/:id/" Component={PlaylistView}/>
                            <Route path="/search/" Component={SearchView}/>
                        </Route>
                    </Route>
                    <Route path="/sign/in/" element={<SignInView/>}/>
                    <Route path="/sign/out/" element={<SignOutView/>}/>
                </Routes>
            </SongContext.Provider>
        </PlaylistProvider>
    );
}

export default App;
