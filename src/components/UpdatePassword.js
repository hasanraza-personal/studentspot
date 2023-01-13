import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import alertContext from '../context/alertContext';

const UpdatePassword = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    const [credentials, setCredentials] = useState({oldpassword: '', newpassword: '', confirmpassword: ''});

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/common/updatepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ oldpassword: credentials.oldpassword, newpassword: credentials.newpassword, confirmpassword: credentials.confirmpassword })
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
                <div className="change_container_text mb-2">Change Password</div>

                <div className="account_details_form_div">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="oldpassword">
                            <Form.Label style={{ marginBottom: "0px" }}>Old password</Form.Label>
                            <Form.Control type="password" placeholder="Enter old password" name="oldpassword" autoComplete="on" onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label style={{ marginBottom: "0px" }}>New password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" name="newpassword" autoComplete="on" onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="confirmpassword">
                            <Form.Label style={{ marginBottom: "0px" }}>Confirm password</Form.Label>
                            <Form.Control type="password" placeholder="Enter confirm password" name="confirmpassword" autoComplete="on" onChange={onChange} />
                        </Form.Group>

                        <div className='d-flex justify-content-end'>
                            <Button type='submit' variant="outline-danger">Change Password</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default UpdatePassword
