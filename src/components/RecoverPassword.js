import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSearchParams } from "react-router-dom";
import alertContext from '../context/alertContext';
import { Link } from 'react-router-dom';

const RecoverPassword = () => {
    const context = useContext(alertContext);
    const {handleShow, setHeadText, setBodyText } = context;

    const [searchParams] = useSearchParams();
    const urlEmail = searchParams.get("qpvnfhdoeG3YDBybcbTljMdrshsynTWMZIRVDbs")
    
    const [credentials, setCredentials] = useState({email: urlEmail, password: '', confirmpassword: ''})

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password, confirmpassword: credentials.confirmpassword})
        });
        const json = await response.json();

         // display modal
         if(!json.success){
            setHeadText('Warning');
            setBodyText(json.error);
            handleShow();
        }else{
            setHeadText('Success');
            setBodyText(json.msg);
            handleShow();
        }
        console.log('json: ', json);
    }
    return (
        <>
            <nav className='navbar_container d-flex justify-content-between'>
                <div className="navbar_title">
                    <Link className="nav-link" style={{ color: 'white' }} to="/">StudentSpot</Link>
                </div>
            </nav>

            <div className="container col-md-5" style={{ boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px', marginTop: '50px', paddingBottom: '20px', paddingTop: '10px'}}>
            <div className='mt-2 mb-2' style={{fontWeight: 'bold', fontSize: '20px'}}>Change your password</div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Control type="hidden" name="email" value={credentials.email}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label style={{ marginBottom: "0px" }}>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" name="password" onChange={onChange} autoComplete="on" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmpassword">
                        <Form.Label style={{ marginBottom: "0px" }}>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter confirm password" name="confirmpassword" onChange={onChange} autoComplete="on" />
                    </Form.Group>

                    <Button variant="primary" type="submit">Change Password</Button>
                </Form>
            </div>
        </>
    )
}

export default RecoverPassword
