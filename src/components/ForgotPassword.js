import React, { useState, useContext, useEffect } from 'react'
import { Form, Button, Modal } from 'react-bootstrap';
import alertContext from '../context/alertContext';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function ForgotPassword() {
    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/student/home')
        } else {
            navigate('/forgotpassword')
        }
        // eslint-disable-next-line
    }, []);

    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    const [credentials, setCredentials] = useState({ email: '' });

    const [msgLoading, showMsgLoading] = useState(false);

    const openMsgLoading = () => {
        showMsgLoading(true);
    }
    const closeMsgLoading = () => {
        showMsgLoading(false);
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        openMsgLoading();
        const response = await fetch('http://localhost:5000/api/auth/sendrecoverylink', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email })
        });
        const json = await response.json();
        // display modal when error occured
        if (!json.success) {
            setHeadText('Warning');
            setBodyText(json.error);
            handleShow();
        } else {
            setHeadText('Success');
            setBodyText(json.msg);
            handleShow();
        }
        closeMsgLoading();
        console.log(json);
    }

    return (
        <>
            <Modal show={msgLoading} onHide={closeMsgLoading} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <div className="msg_loader_container d-flex justify-content-center">
                        <div className="msg_loader">
                            <img src={process.env.PUBLIC_URL + "images/msg-loader.gif"} className="img-fluid" width="300px" height="200px" alt="sending" />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Navbar />
            <div style={{ backgroundColor: '#fff', paddingTop: '50px', height: '92vh' }}>
                <div className="container col-md-4" style={{ boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px', marginTop: '50px', paddingTop: '10px' }}>
                    <div className='mt-2 mb-2' style={{ fontWeight: 'bold', fontSize: '20px' }}>Enter your email address</div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label style={{ marginBottom: "0px" }}>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" onChange={onChange} />
                        </Form.Group>

                        <Button variant="primary" type="submit">Send Recovery Link</Button>
                    </Form>
                    <NavLink className="nav-link" to="/login">Already have an account?</NavLink>
                    <NavLink className="nav-link" to="/signup">Create an account</NavLink>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword
