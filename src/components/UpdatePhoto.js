import React, { useState, useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import alertContext from '../context/alertContext';


const UpdatePhoto = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    const [file, setFile] = useState('');
    const [image, setImage] = useState('');

    const onChange = (e) => {
        setFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(() => {
        const getUserPhoto = async() => {
            const response = await fetch('http://localhost:5000/api/common/getuserdetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            let json = await response.json();
            setImage(`http://localhost:5000/images/profile_picture/${json.photo}`);
        }
        getUserPhoto();
        // eslint-disable-next-line
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('photo', file);
        const response = await fetch('http://localhost:5000/api/common/updateprofilephoto', {
            method: 'POST',
            headers: {
                'auth-token': localStorage.getItem('token')
            },
            body: formData
        });
        const json = await response.json();

        // display modal when response received
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
                <div className="change_container_text mb-2">Update Profile Picture</div>
                <div className="change_photo_image_div d-flex justify-content-center">
                    {/* <img src={process.env.PUBLIC_URL + "/images/default_profile_photo.png"} alt="profile" className="profile_picture" /> */}
                    <img src={image} alt="profile" className="profile_picture" />
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formFileSm" className="my-3">
                        <Form.Label>Choose profile photo</Form.Label>
                        <Form.Control type="file" name="photo" onChange={onChange} />
                    </Form.Group>

                    <div className='d-flex justify-content-end'>
                        <Button type="submit" variant="outline-danger">Update Profile Photo</Button>
                    </div>
                </Form>
            </div>
        </>
    )
}

export default UpdatePhoto
