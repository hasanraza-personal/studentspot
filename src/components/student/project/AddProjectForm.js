import { Form, Button, Modal } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { ProjectContext } from '../../../helper/context';
import alertContext from '../../../context/alertContext';

const AddProjectForm = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;
    const { show, setShow, addProject } = useContext(ProjectContext);

    const [credentials, setCredentials] = useState({projectname: '', projectlang: '', projectdesc: ''});
    const [file, setFile] = useState();

    const closeProjectModal = () => setShow(false);

    const onTextChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('filename', file);
        formData.append('projectname', credentials.projectname);
        formData.append('projectlang', credentials.projectlang);
        formData.append('projectdesc', credentials.projectdesc);

        const response = await fetch('http://localhost:5000/api/student/project/addproject', {
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
            addProject(json.newProject);
            setCredentials({projectname: '', projectlang: '', projectdesc: ''})
        }
        console.log('json: ', json);
    }

    return (
        <Modal show={show} onHide={closeProjectModal} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                <div className="modal_form_heading" style={{ fontSize: "24px", color: '#407BFF' }}>Add your project</div>
                <div className="modal_form_body">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="projectname">
                            <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Project name</Form.Label>
                            <Form.Control type="text" placeholder="Enter project name" name="projectname" value={credentials.projectname} onChange={onTextChange} />
                            <Form.Text className="text-muted">
                                Example, StudentSpot
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="projectlang">
                            <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Languages used in your project</Form.Label>
                            <Form.Control type="text" placeholder="Enter programming language" name="projectlang" value={credentials.projectlang} onChange={onTextChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="projectdesc">
                            <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Project description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Write your description here..." name="projectdesc" value={credentials.projectdesc} onChange={onTextChange} />
                        </Form.Group>

                        {/* Image input field */}
                        <Form.Group controlId="formFileSm" className="my-3">
                            <Form.Label style={{ marginBottom: "0px" }}>Select .zip file of your source code</Form.Label>
                            <Form.Control type="file" name="filename" onChange={onFileChange} />
                        </Form.Group>

                        <div className='d-flex justify-content-around mt-3'>
                            <Button variant="outline-secondary" onClick={closeProjectModal}>Cancel</Button>
                            <Button type="submit" variant="outline-danger" onClick={closeProjectModal}>Save Project</Button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default AddProjectForm