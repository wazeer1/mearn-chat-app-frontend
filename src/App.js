import logo from "./logo.svg";
import "./App.css";
import Navigation from "./components/Navigation";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useSelector } from "react-redux";
import { useState } from "react";
import {appContext,socket} from './context/appContext'

function App() {
    const user = useSelector((state) => state.user);
    const [rooms,setRooms]=useState([])
    const [currentRoom,setCurrentRoom]=useState([])
    const [members,setMembers]=useState([])
    const [messages,setMessages]=useState([])
    const [privateMemeberMsg,setPrivateMemberMsg]=useState({})
    const [newMessages,setNewMessages] = useState({})
    return (
      <appContext.Provider value={{socket,currentRoom,setCurrentRoom,members,setMembers,messages,setMessages,privateMemeberMsg,setPrivateMemberMsg,rooms,setRooms,newMessages,setMessages}}>
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                {!user && (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </>
                )}
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </BrowserRouter>
        </appContext.Provider>
    );
}

export default App;
