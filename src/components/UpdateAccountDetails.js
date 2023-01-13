import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import alertContext from '../context/alertContext';

const UpdateAccountDetails = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    const [credentials, setCredentials] = useState({email: '', username: '', fullname: '', gender: ''});

    useEffect(() => {
        const getUser = async() => {
            const response = await fetch('http://localhost:5000/api/common/getuserdetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            let json = await response.json();
            setCredentials({email: json.email, username: json.username, fullname: json.fullname, gender: json.gender});
        }
        getUser();
        // eslint-disable-next-line
    }, []);

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/common/updateprofiledetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ email: credentials.email, username: credentials.username, fullname: credentials.fullname, gender: credentials.gender })
        });
        const json = await response.json();

        // display modal when error occured
        if (!json.success) {
            setHeadText('Warning');
            setBodyText(json.error);
            handleShow();
        }else{
            setHeadText('Success');
            setBodyText(json.msg);
            handleShow();
        }
    }

    return (
        <>
            <div className="change_container">
                <div className="change_container_text mb-2">Update Account Details</div>

                <div className="account_details_form_div">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label style={{ marginBottom: "0px" }}>Email</Form.Label>
                            <Form.Control type="email" name="email" value={credentials.email} onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label style={{ marginBottom: "0px" }}>Username</Form.Label>
                            <Form.Control type="text" name="username" value={credentials.username} onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="fullname">
                            <Form.Label style={{ marginBottom: "0px" }}>Fullname</Form.Label>
                            <Form.Control type="text" name="fullname" value={credentials.fullname} onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ marginBottom: "0px" }}>Select gender</Form.Label>
                            <Form.Select id="gender" name="gender" value={credentials.gender} onChange={onChange}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </Form.Select>
                        </Form.Group>

                        <div className='d-flex justify-content-end'>
                            <Button type='submit' variant="outline-danger">Update Account Details</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default UpdateAccountDetails
