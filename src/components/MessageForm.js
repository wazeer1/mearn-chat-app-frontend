import React, { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import '../assets/css/message.css'
import { appContext } from "../context/appContext";

function MessageForm() {
    const user = useSelector((state)=>state.user)
    const [message,setMessage] = useState("");
    // const user = useSelector((state)=>user.state)
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
    function getFormattedDate(){
        const date = new Date()
        const year = date.getFullYear()
        let month = (1+date.getMonth()).toString();

        month = month.length > 1 ? month : '0' + month;
        let day = date.getDate().toString()
        day = day.length > 1 ? day : "0" + day;
        return month + "/" + day + "/" + year
    }
    function handleSubmit(e) {
        e.preventDefault();
        if(!message) return;
        const today = new Date()
        const minutes = today.getMinutes() > 10 ? "0" +  today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        socket.emit('message-room', roomId, message,user,time,todayDate)
        setMessage("")

    }
    const todayDate = getFormattedDate();
    socket.off('room-messages').on('room-messages',(roomMessage)=>{
        console.log("room-messages",roomMessage);
        setMessages(roomMessage)
    })

    return (
        <div>
            <div className="messages-output">
                {!user && <div className="alert alert-danger">Please login to chats</div>}
                {user && messages.map(({_id:date,messagesByDate},idx)=>(
                    <div key={idx}>
                        <p className="alert alert-info text-center message-date-indicator">{date}</p>
                        {messagesByDate?.map(({content, time, from:sender},msgIdx)=>(
                            <div className="message" key={msgIdx}>
                                <p>{content}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Form onSubmit={(e) => handleSubmit(e)}>
                <Row>
                    <Col md={11}>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="type your message"
                                disabled={!user}
                                value={message}
                                onChange={(e)=>setMessage(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Button
                            varient="primary"
                            type="submit"
                            style={{ width: "100%", backgroundColor: "orange" }}
                            disabled={!user}
                        >
                            <i className="fas fa-paper-plane"></i>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default MessageForm;
