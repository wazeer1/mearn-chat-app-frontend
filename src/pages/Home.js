import React from 'react'
import {Row, Col, Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import '../assets/css/home.css'

function Home() {
  return (
    <Row>
        <Col md={6} className="d-flex fle-direction-colum align-items-center justify-content-center">
            <div>
                <h1>Share the world with your friend</h1>
                <p>chat app lets you connect with the world</p>
                <LinkContainer to="/chat">
                    <Button varien="success">Get Started<i className='fas fa-comments home-message-icon'></i></Button>
                </LinkContainer>
            </div>
        </Col>
        <Col md={6} className="home__bg">
        
        </Col>
    </Row>
  )
}

export default Home