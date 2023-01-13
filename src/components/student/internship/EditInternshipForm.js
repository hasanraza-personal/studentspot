import { Form, Button, Modal } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { InternshipContext } from '../../../helper/context';
import alertContext from '../../../context/alertContext';

const EditInternshipForm = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;
    const { editShow, setEditShow, image, setImage, eCredentials, setECredentials, updateInternship } = useContext(InternshipContext);

    const [updateFile, setUpdateFile] = useState();

    const onImageUpdate = (e) => {
        setUpdateFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    const onTextUpdate = (e) => {
        setECredentials({ ...eCredentials, [e.target.name]: e.target.value });
    }

    const closeEditInternship = () => setEditShow(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('photo', updateFile);
        formData.append('internshipid', eCredentials.internshipid);
        formData.append('companyname', eCredentials.companyname);
        formData.append('workduration', eCredentials.workduration);
        formData.append('stipends', eCredentials.stipends);
        formData.append('languages', eCredentials.languages);
        formData.append('workdesc', eCredentials.workdesc);

        const response = await fetch('http://localhost:5000/api/student/internship/updateinternship', {
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
            updateInternship(json.newInternship);
        }
        console.log('json: ', json);
    }

    return (
        <>
            <Modal show={editShow} onHide={closeEditInternship} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <div className="modal_form_heading" style={{ fontSize: "24px", color: '#407BFF' }}>Add your intrenship</div>
                    <div className="modal_form_body">
                        <Form onSubmit={handleUpdate}>
                            <Form.Control type="hidden" name="internshipid" value={eCredentials.internshipid} />

                            <Form.Group controlId="companyname">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Company name</Form.Label>
                                <Form.Control type="text" placeholder="Enter company name" name="companyname" value={eCredentials.companyname} onChange={onTextUpdate} />
                                <Form.Text className="text-muted">
                                    Where you have done your internship
                                </Form.Text>
                            </Form.Group>

                            <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Select work duration</Form.Label>
                            <Form.Select id="workduration" name="workduration" value={eCredentials.workduration} onChange={onTextUpdate}>
                                <option>1 Month</option>
                                <option>3 Month</option>
                                <option>6 Month</option>
                            </Form.Select>

                            <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Stipends</Form.Label>
                            <Form.Select id="stipends" name="stipends" value={eCredentials.stipends} onChange={onTextUpdate}>
                                <option>Paid</option>
                                <option>Unpaid</option>
                            </Form.Select>

                            <Form.Group controlId="languages">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Progamming Language</Form.Label>
                                <Form.Control type="text" placeholder="Enter progamming language" name="languages" value={eCredentials.languages} onChange={onTextUpdate} />
                                <Form.Text className="text-muted">
                                    Languages in which you have workend during internship
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="workdesc">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Work description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Enter your description here..." name="workdesc" value={eCredentials.workdesc} onChange={onTextUpdate} />
                            </Form.Group>

                            <div className='d-flex justify-content-center'>
                                <img src={image} alt="certificate" width={'165px'} />
                            </div>

                            {/* Image input field */}
                            <Form.Group controlId="formFileSm" className="my-3">
                                <Form.Label style={{ marginBottom: "0px" }}>Select certificate image</Form.Label>
                                <Form.Control type="file" name="photo" onChange={onImageUpdate} />
                            </Form.Group>

                            <div className='d-flex justify-content-around mt-3'>
                                <Button variant="outline-secondary" onClick={closeEditInternship}>Cancel</Button>
                                <Button type="submit" variant="outline-danger" onClick={closeEditInternship}>Save Internship</Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default EditInternshipForm
