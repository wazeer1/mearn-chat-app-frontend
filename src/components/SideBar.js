import React, { useContext, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { appContext } from "../context/appContext";

function SideBar() {
    // const rooms = ["first room", "second room", "third room"];
    const user = useSelector((state) => state.user);
    const {
        socket,
        currentRoom,
        setCurrentRoom,
        members,
        setMembers,
        messages,
        privateMemeberMsg,
        setPrivateMemberMsg,
        rooms,
        setRooms,
        newMessages,
        setMessages,
    } = useContext(appContext);
    useEffect(()=>{
        if(user){
            setCurrentRoom('general')
            getRooms();
            socket.emit('join-room','general')
            socket.emit('new-user')
        }
    },[])
    
    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
    });

    if (!user) {
        return <></>;
    }

    function getRooms() {
        fetch("http://localhost:5001/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }
    function joinRoom(room,isPublic=true){
        if(!user){
            return alert("please login")
        }
        socket.emit('join-room',room);
        setCurrentRoom(room)
        if(isPublic){
            setPrivateMemberMsg(null)
        }
        //dispatch notifications
    }
    return (
        <>
            <h2>Available Rooms</h2>
            <ListGroup>
                {rooms.map((room, idx) => (
                    <ListGroup.Item key={idx} onClick={()=>joinRoom(room)} active={room == currentRoom} style={{cursor:"pointer",display:'flex',justifyContent:'space-between'}}>{room}{currentRoom !==room && <span></span>}</ListGroup.Item>
                ))}
            </ListGroup>
            <h2>Members</h2>
            {members.map((member) => (
                <ListGroup.Item key={member.id} style={{ cursor: "pointer" }}>
                    {member.name}
                </ListGroup.Item>
            ))}
        </>
    );
}

export default SideBar;
