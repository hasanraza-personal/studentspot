import { Form, Button, Modal } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { InternshipContext } from '../../../helper/context';
import alertContext from '../../../context/alertContext';

const AddInternshipForm = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;
    const { show, setShow, addInternship } = useContext(InternshipContext);

    const [credentials, setCredentials] = useState({companyname: '', workduration: '1 Month', stipends: 'Paid', languages: '', workdesc: ''});
    const [file, setFile] = useState();

    const onTextChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const onImageChange = (e) => {
        setFile(e.target.files[0]);
    }

    const closeInternshipModal = () => setShow(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('companyname', credentials.companyname);
        formData.append('workduration', credentials.workduration);
        formData.append('stipends', credentials.stipends);
        formData.append('languages', credentials.languages);
        formData.append('workdesc', credentials.workdesc);

        const response = await fetch('http://localhost:5000/api/student/internship/addinternship', {
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
            setCredentials({companyname: '', workduration: '1 Month', stipends: 'Paid', languages: '', workdesc: ''});
            addInternship(json.newInternship);
        }
        console.log('json: ', json);
    }

    return (
        <>
        <Modal show={show} onHide={closeInternshipModal} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <div className="modal_form_heading" style={{ fontSize: "24px", color: '#407BFF' }}>Add your intrenship</div>
                    <div className="modal_form_body">
                        <Form onSubmit={handleSubmit}>

                            <Form.Group controlId="companyname">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Company name</Form.Label>
                                <Form.Control type="text" placeholder="Enter company name" name="companyname" value={credentials.companyname} onChange={onTextChange} />
                                <Form.Text className="text-muted">
                                    Where you have done your internship
                                </Form.Text>
                            </Form.Group>

                            <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Select work duration</Form.Label>
                            <Form.Select id="workduration" name="workduration" value={credentials.workduration} onChange={onTextChange}>
                                <option>1 Month</option>
                                <option>3 Month</option>
                                <option>6 Month</option>
                            </Form.Select>

                            <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Stipends</Form.Label>
                            <Form.Select id="stipends" name="stipends" value={credentials.stipends} onChange={onTextChange}>
                                <option>Paid</option>
                                <option>Unpaid</option>
                            </Form.Select>

                            <Form.Group controlId="languages">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Progamming Language</Form.Label>
                                <Form.Control type="text" placeholder="Enter progamming language" name="languages" value={credentials.languages} onChange={onTextChange} />
                                <Form.Text className="text-muted">
                                    Languages in which you have workend during internship
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="workdesc">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Work description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Enter your description here..." name="workdesc" value={credentials.workdesc} onChange={onTextChange} />
                            </Form.Group>

                            {/* Image input field */}
                            <Form.Group controlId="formFileSm" className="my-3">
                                <Form.Label style={{ marginBottom: "0px" }}>Select certificate image</Form.Label>
                                <Form.Control type="file" name="photo" onChange={onImageChange} />
                            </Form.Group>

                            <div className='d-flex justify-content-around mt-3'>
                                <Button variant="outline-secondary" onClick={closeInternshipModal}>Cancel</Button>
                                <Button type="submit" variant="outline-danger" onClick={closeInternshipModal}>Save Internship</Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddInternshipForm
