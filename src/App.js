import './App.css';
import {useEffect, useState} from "react";
import {config} from "./config";
import {SongContext} from './context/songContext';
import {ViewContext} from "./context/viewContext";
import {routes} from "./routes";
import {Route, Routes, useNavigate} from "react-router-dom";
import RequireAuth from "./routePermissions/RequireAuth";
import {HomeView, SignInView} from "./views";
import {AlbumView} from "./views/AlbumView";
import {SongList} from "./views/SongList";
import {PlaylistView} from "./views/PlaylistView";
import SearchView from "./views/SearchView";

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
    const [currentView, setCurrentView] = useState(routes.songs);


    useEffect(() => {
        localStorage.setItem("currentSong", JSON.stringify(currentSong));
    }, [currentSong]);


    return (
        <ViewContext.Provider value={{currentView, setCurrentView}}>
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
        </ViewContext.Provider>
    );
}

export default App;
