import React from 'react'
import {Container,Row,Col} from 'react-bootstrap'
import MessageForm from '../components/MessageForm'
import SideBar from '../components/SideBar'

function Chat() {
  return (
    <Container>
        <Row>
            <Col md={4}><SideBar/></Col>
            <Col md={8}><MessageForm/></Col>
        </Row>
    </Container>
  )
}

export default Chat