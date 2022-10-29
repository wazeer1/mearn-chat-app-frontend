import React, { useContext, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { appContext } from "../context/appContext";
import {addNotifications,resetNotifications} from '../features/userSlice'

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
    const dispatch = useDispatch()
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
        dispatch(resetNotifications(room));
        socket.off('notifications').on('notifications',(room)=>{
            dispatch(addNotifications(room))
        })

    }
    function orderIds(id1,id2){
        if(id1 > id2){
            return id1 + '-' +id2
        }else{
            return id2 + "-" + id1
        }
    }
    function handlePrivateMemberMsg(member){
        setPrivateMemberMsg(member);
        const roomId = orderIds(user._id,member._id);

        joinRoom(roomId,false)
    }
    return (
        <>
            <h2>Available Rooms</h2>
            <ListGroup>
                {rooms?.map((room, idx) => (
                    <ListGroup.Item key={idx} onClick={()=>joinRoom(room)} active={room == currentRoom} style={{cursor:"pointer",display:'flex',justifyContent:'space-between'}}>{room}{currentRoom !==room && <span className="badge rounded-pill bg-primary">{user.newMessage[room]}</span>}</ListGroup.Item>
                ))}
            </ListGroup>
            <h2>Members</h2>
            {members.map((member) => (
                <ListGroup.Item key={member.id} style={{ cursor: "pointer" }} active={privateMemeberMsg?._id == member?.__id} onClick={()=>handlePrivateMemberMsg(member)} disabled={member._id === user._id}>
                    {member.name}
                </ListGroup.Item>
            ))}
        </>
    );
}

export default SideBar;
