import React, { useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/signup.css"
import Botimg from '../assets/images/bot.jpeg'
import { useSignupUserMutation } from "../services/appApi";



function Signup() {
    const [email,setEmail]=useState("")
    const [name,setName]=useState("")
    const [password,setPassword] = useState("")
    const [signupUser,{isLoading,error}]=useSignupUserMutation()
    const navigate = useNavigate()

    //image upload state
    const [image,setImage]=useState(null)
    const [uploadin,setUploading]=useState(false)
    const [imagePreview,setImagePreview]= useState(null)

    function validateImg(e) {
        const file = e.target.files[0];
        if(file.size >= 1048576){
            return alert("max file size is 1mb")
        }else{
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    async function uploadImage(){
        const data = new FormData();
        data.append('file',image)
        data.append('upload_preset','vtpkm5pi')
        try{
            setUploading(true);
            let res = await fetch("https://api.cloudinary.com/v1_1/dgohtamsw/image/upload",{
                method:'post',
                body:data
            })
            const urlData = await res.json();
            setUploading(false)
            return urlData.url

        }catch(error){
            setUploading(false)
            console.log(error);
        }
    }

    async function handleSignup(e){
        e.preventDefault()
        if(!image) return alert("please upload your profile picture");
        const url = await uploadImage(image)
        console.log(url);
        //signup the user
        signupUser({name,email,password,url}).then(({data})=>{
            if(data){
                console.log(data);
                navigate('/chat')
            }
        })

    }
    return (
        <Container>
            <Row>
                <Col
                    md={7}
                    className="d-flex align-items-center justify-content-center flex-direction-column"
                >
                    <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={(e)=>handleSignup(e)}>
                        <h1 className="text-center">Create Account</h1>
                        <div className="signup-profile-pic__container">
                            <img src={imagePreview || Botimg} className="signup-profile-pic" />
                            <label htmlFor="image-upload" className="image-upload-label">
                                <i className="fas fa-plus-circle add-picture-icon"></i>
                            </label>
                            <input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={(e)=>validateImg(e)}/>
                        </div>
                    <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Your Name"
                                onChange={(e)=>setName(e.target.value)}
                                value={name}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                onChange={(e)=>setEmail(e.target.value)}
                                value={email}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="formBasicPassword"
                        >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e)=>setPassword(e.target.value)}
                                value={password}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicCheckbox"
                        >
                            <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {uploadin ? 'Signing you up ...' : "Signup"}
                        </Button>
                        <div className="py-4">
                            <p className="text-center">
                                Already have account ?{" "}
                                <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </Form>
                </Col>
                <Col md={5} className="signup__bg"></Col>
            </Row>
        </Container>
    );
}

export default Signup;
