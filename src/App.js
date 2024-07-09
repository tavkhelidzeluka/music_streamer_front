import './App.css';
import {useEffect, useState} from "react";
import {config} from "./config";
import {SongContext} from './contexts/songContext';
import {ViewContext} from "./contexts/viewContext";
import {UserContext} from "./contexts/userContext";
import {routes} from "./routes";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {getUser, refreshToken} from "./authentication";
import axios from "axios";
import IsAuthenticatedRoute from "./routePermissions/IsAuthenticated";
import {HomeView, SignInView} from "./views";
import {setupAxiosInterceptors, useAxiosSetup} from "./axiosSetup";


const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <IsAuthenticatedRoute>
                <HomeView/>
            </IsAuthenticatedRoute>
        ),
    },
    {
        path: "/sign/in/",
        element: <SignInView/>,
    }
]);

function App() {
    const [currentSong, setCurrentSong] = useState(
        JSON.parse(localStorage.getItem("currentSong"))
    );
    const [sound, setSound] = useState(false);
    const [currentView, setCurrentView] = useState(routes.songs);
    const [user, setUser] = useState(getUser());


    useEffect(() => {
        localStorage.setItem("currentSong", JSON.stringify(currentSong));
    }, [currentSong]);


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
