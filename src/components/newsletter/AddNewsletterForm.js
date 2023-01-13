import { Form, Button, Modal } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { NewsletterContext } from '../../helper/context';
import alertContext from '../../context/alertContext';

const AddNewsletterForm = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;
    const { show, setShow, addNewsletter } = useContext(NewsletterContext);

    const [credentials, setCredentials] = useState({ title: '', desc: '' });
    const [file, setFile] = useState();

    const onTextChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const onImageChange = (e) => {
        setFile(e.target.files[0]);
    }

    const closeNewsletterModal = () => setShow(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('title', credentials.title);
        formData.append('desc', credentials.desc);

        const response = await fetch('http://localhost:5000/api/newsletter/addnewsletter', {
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
            setBodyText(json.err);
            handleShow();
        } else {
            setHeadText('Success');
            setBodyText(json.msg);
            handleShow();
            setCredentials({ title: '', desc: '' });
            addNewsletter(json.newNewsletter);
        }
        console.log('json: ', json);
    }

    return (
        <>
            <Modal show={show} onHide={closeNewsletterModal} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <div className="modal_form_heading" style={{ fontSize: "24px", color: '#407BFF' }}>Add your Newsletter</div>
                    <div className="modal_form_body">
                        <Form onSubmit={handleSubmit}>

                            <Form.Group controlId="title">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Newsletter title</Form.Label>
                                <Form.Control type="text" placeholder="Enter title" name="title" value={credentials.title} onChange={onTextChange} />
                            </Form.Group>

                            <Form.Group controlId="desc">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Newsletter description</Form.Label>
                                <Form.Control type="text" placeholder="Enter description" name="desc" value={credentials.desc} onChange={onTextChange} />
                            </Form.Group>

                            {/* Image input field */}
                            <Form.Group controlId="formFileSm" className="my-3">
                                <Form.Label style={{ marginBottom: "0px" }}>Select newsletter image</Form.Label>
                                <Form.Control type="file" name="photo" onChange={onImageChange} />
                            </Form.Group>

                            <div className='d-flex justify-content-around mt-3'>
                                <Button variant="outline-secondary" onClick={closeNewsletterModal}>Cancel</Button>
                                <Button type="submit" variant="outline-danger" onClick={closeNewsletterModal}>Save Newsletter</Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddNewsletterForm