import React, { useContext, useState, useEffect } from 'react'
import Navbar from '../Navbar'
import StudentSidebar from '../sidebar/StudentSidebar'
import '../../css/profile.css';
import { Form, Button } from 'react-bootstrap';
import UpdatePhoto from '../UpdatePhoto';
import UpdateAccountDetails from '../UpdateAccountDetails';
import UpdatePassword from '../UpdatePassword';
import alertContext from '../../context/alertContext';

const StudentProfile = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    const [credentials, setCredentials] = useState({year: '', semester: '', batch: '', mentor: ''});

    useEffect(() => {
        const getBasicDetails = async() => {
            const response = await fetch('http://localhost:5000/api/student/getbasicdetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            let json = await response.json();
            if(json){
                setCredentials({year: json.year, semester: json.semester, batch: json.batch, mentor: json.mentor});
            }
        }
        getBasicDetails();
        // eslint-disable-next-line
    }, []);

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/student/updatebasicdetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ year: credentials.year, semester: credentials.semester, batch: credentials.batch, mentor: credentials.mentor })
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
            <Navbar />
            <StudentSidebar />

            <div className="container-fluid">
                <div className='profile_container'>
                    <div className="sub_profile_container col-md-6">
                        <div className="profile_head_text">Profile Section</div>

                        <UpdatePhoto />

                        <UpdateAccountDetails />

                        <UpdatePassword />

                        <div className="change_container">
                            <div className="change_container_text mb-2">Update Basic Details</div>

                            <div className="account_details_form_div">
                                <Form onSubmit={handleSubmit}>

                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Select Year</Form.Label>
                                        <Form.Select id="year" name="year" onChange={onChange} value={credentials.year}>
                                            <option></option>
                                            <option>First Year</option>
                                            <option>Second Year</option>
                                            <option>Third Year</option>
                                            <option>Fourth Year</option>
                                        </Form.Select>

                                        <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Select Semester</Form.Label>
                                        <Form.Select id="semester" name="semester" onChange={onChange} value={credentials.semester}>
                                            <option></option>
                                            <option>First Semester</option>
                                            <option>Second Semester</option>
                                            <option>Third Semester</option>
                                            <option>Fourth Semester</option>
                                            <option>Fifth Semester</option>
                                            <option>Sixth Semester</option>
                                            <option>Seventh Semester</option>
                                            <option>Eighth Semester</option>
                                        </Form.Select>

                                        <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Select Batch</Form.Label>
                                        <Form.Select id="batch" name="batch" onChange={onChange} value={credentials.batch}>
                                            <option></option>
                                            <option>A Batch</option>
                                            <option>B Batch</option>
                                            <option>C Batch</option>
                                        </Form.Select>

                                        {/* <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Select Mentor</Form.Label> */}
                                        {/* <Form.Select id="mentor" name="mentor" onChange={onChange} value={credentials.mentor}>
                                            <option></option>
                                            <option>No mentor available yet</option>
                                        </Form.Select> */}
                                    </Form.Group>

                                    <div className='d-flex justify-content-end'>
                                        <Button type="submit" variant="outline-danger">Update Basic Details</Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentProfile
