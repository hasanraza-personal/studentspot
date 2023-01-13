import { Form, Button, Modal } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { AchievementContext } from '../../../helper/context';
import alertContext from '../../../context/alertContext';

const AddAchievementForm = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;
    const { show, setShow, addAchievement } = useContext(AchievementContext);

    const [credentials, setCredentials] = useState({competitionname: '', competitionlevel: 'Intra Level', competitiondesc: ''});
    const [file, setFile] = useState();
    
    const onTextChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const onImageChange = (e) => {
        setFile(e.target.files[0]);
    }

    const closeAchievementModal = () => setShow(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('competitionname', credentials.competitionname);
        formData.append('competitionlevel', credentials.competitionlevel);
        formData.append('competitiondesc', credentials.competitiondesc);

        const response = await fetch('http://localhost:5000/api/student/achievement/addachievement', {
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
            setCredentials({competitionname: '', competitionlevel: 'Intra Level', competitiondesc: ''});
            addAchievement(json.newAchievement);
        }
        console.log('json: ', json);
    }

    return (
        <>
            <Modal show={show} onHide={closeAchievementModal} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <div className="modal_form_heading" style={{ fontSize: "24px", color: '#407BFF' }}>Add your achievement</div>
                    <div className="modal_form_body">
                        <Form onSubmit={handleSubmit}>
                            <Form.Control type="hidden" name="competitionid" />

                            <Form.Group controlId="competitionname">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Competition name</Form.Label>
                                <Form.Control type="text" placeholder="Enter competition name" name="competitionname" value={credentials.competitionname} onChange={onTextChange} />
                                <Form.Text className="text-muted">
                                    Example, Hackathon
                                </Form.Text>
                            </Form.Group>

                            <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Select competition level</Form.Label>
                            <Form.Select id="competitionlevel" name="competitionlevel" value={credentials.competitionlevel} onChange={onTextChange}>
                                <option>Intra Level</option>
                                <option>Inter Level</option>
                                <option>State Level</option>
                                <option>Country Level</option>
                                <option>International Level</option>
                            </Form.Select>

                            <Form.Group className="mb-3" controlId="competitiondesc">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Competition description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Enter your description here..." name="competitiondesc" value={credentials.competitiondesc} onChange={onTextChange} />
                            </Form.Group>

                            {/* Image input field */}
                            <Form.Group controlId="formFileSm" className="my-3">
                                <Form.Label style={{ marginBottom: "0px" }}>Select certificate image</Form.Label>
                                <Form.Control type="file" name="photo" onChange={onImageChange} />
                            </Form.Group>

                            <div className='d-flex justify-content-around mt-3'>
                                <Button variant="outline-secondary" onClick={closeAchievementModal}>Cancel</Button>
                                <Button type="submit" variant="outline-danger" onClick={closeAchievementModal}>Save Achievement</Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddAchievementForm
