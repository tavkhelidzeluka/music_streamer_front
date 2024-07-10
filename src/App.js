import './App.css';
import {useEffect, useState} from "react";
import {config} from "./config";
import {SongContext} from './context/songContext';
import {ViewContext} from "./context/viewContext";
import {routes} from "./routes";
import {Route, Routes, useNavigate} from "react-router-dom";
import RequireAuth from "./routePermissions/RequireAuth";
import {HomeView, SignInView} from "./views";

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
                        <Route path="/" element={<HomeView/>}/>
                    </Route>
                    <Route path="/sign/in/" element={<SignInView/>}/>
                    <Route path="/sign/out/" element={<SignOutView/>}/>
                </Routes>
            </SongContext.Provider>
        </ViewContext.Provider>
    );
}

export default App;
