import React, { useState, useContext, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap';
import alertContext from '../context/alertContext';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Signup() {
    let navigate = useNavigate();

    // useEffect(() => {
    //     if (localStorage.getItem('token')) {
    //         navigate('/student/home')
    //     } else {
    //         navigate('/signup')
    //     }
    //     // eslint-disable-next-line
    // }, []);

    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    const [credentials, setCredentials] = useState({ fullname: '', email: '', username: '', password: '', gender: 'Male', code: '' });

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/createuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password, username: credentials.username, fullname: credentials.fullname, gender: credentials.gender, code: credentials.code })
        });
        const json = await response.json();

        // display modal when error occured
        if (!json.success) {
            setHeadText('Warning');
            setBodyText(json.error);
            handleShow();
        } else {
            localStorage.setItem('token', json.authtoken)

            if(json.designation === 'Student'){
                navigate('/student/profile')
            }else if(json.designation === 'Teacher'){
                navigate('/teacher/profile')
            }else if(json.designation === 'Mentor'){
                navigate('/mentor/home')
            }
        }
        console.log(json);
    }

    return (
        <>
            <Navbar />
            <div style={{ backgroundColor: '#fff', paddingTop: '50px', height: '92vh' }}>
                <div className="container col-md-5" style={{ boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px', paddingTop: '10px' }}>
                    <div className='mt-2 mb-2' style={{ fontWeight: 'bold', fontSize: '20px' }}>Don't have an account? Signup here!</div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="fullname">
                            <Form.Label style={{ marginBottom: "0px" }}>Fullname</Form.Label>
                            <Form.Control type="text" placeholder="Enter fullname" name="fullname" onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label style={{ marginBottom: "0px" }}>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label style={{ marginBottom: "0px" }}>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" name="username" onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label style={{ marginBottom: "0px" }}>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" name="password" onChange={onChange} autoComplete="on" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ marginBottom: "0px" }}>Select gender</Form.Label>
                            <Form.Select id="gender" name="gender" onChange={onChange}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="code">
                            <Form.Label style={{ marginBottom: "0px" }}>Code</Form.Label>
                            <Form.Control type="text" placeholder="Enter your code" name="code" onChange={onChange} />

                            <Form.Text className="text-muted">
                                This field is not for students
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit">Signup</Button>
                    </Form>
                    <NavLink className="nav-link" to="/login">Already have an account?</NavLink>
                </div>
            </div>
        </>
    )
}

export default Signup
