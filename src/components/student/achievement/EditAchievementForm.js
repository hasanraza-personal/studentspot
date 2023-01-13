import { Form, Button, Modal } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { AchievementContext } from '../../../helper/context';
import alertContext from '../../../context/alertContext';

const EditAchievementform = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;
    const { editShow, setEditShow, image, setImage, eCredentials, setECredentials, updateAchievement } = useContext(AchievementContext);

    const [updateFile, setUpdateFile] = useState();

    const onImageUpdate = (e) => {
        setUpdateFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    const onTextUpdate = (e) => {
        setECredentials({ ...eCredentials, [e.target.name]: e.target.value });
    }

    const closeEditAchievement = () => setEditShow(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('photo', updateFile);
        formData.append('competitionid', eCredentials.competitionid);
        formData.append('competitionname', eCredentials.competitionname);
        formData.append('competitionlevel', eCredentials.competitionlevel);
        formData.append('competitiondesc', eCredentials.competitiondesc);

        const response = await fetch('http://localhost:5000/api/student/achievement/updateachievement', {
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
            updateAchievement(json.newAchievement);
        }
    }

    return (
        <>
            <Modal show={editShow} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <div className="modal_form_heading" style={{ fontSize: "24px", color: '#407BFF' }}>Update your achievement</div>
                    <div className="modal_form_body">
                        <Form onSubmit={handleUpdate}>
                            <Form.Control type="hidden" name="competitionid" value={eCredentials.competitionid} />

                            <Form.Group controlId="competitionname">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Competition name</Form.Label>
                                <Form.Control type="text" placeholder="Enter competition name" name="competitionname" value={eCredentials.competitionname} onChange={onTextUpdate} />
                                <Form.Text className="text-muted">
                                    Example, Hackathon
                                </Form.Text>
                            </Form.Group>

                            <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Select competition level</Form.Label>
                            <Form.Select id="competitionlevel" name="competitionlevel" value={eCredentials.competitionlevel} onChange={onTextUpdate} >
                                <option>Intra Level</option>
                                <option>Inter Level</option>
                                <option>State Level</option>
                                <option>Country Level</option>
                                <option>International Level</option>
                            </Form.Select>

                            <Form.Group className="mb-3" controlId="competitiondesc">
                                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Competition description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Enter your description here..." name="competitiondesc" value={eCredentials.competitiondesc} onChange={onTextUpdate} />
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
                                <Button variant="outline-secondary" onClick={closeEditAchievement}>Cancel</Button>
                                <Button type="submit" variant="outline-danger" onClick={closeEditAchievement}>Update Achievement</Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default EditAchievementform
