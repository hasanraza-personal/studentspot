import { Form, Button, Modal } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { ProjectContext } from '../../../helper/context';
import alertContext from '../../../context/alertContext';

const EditProjectForm = () => {
  const context = useContext(alertContext);
  const { handleShow, setHeadText, setBodyText } = context;
  const { editShow, setEditShow, eCredentials, setECredentials, updateProject } = useContext(ProjectContext);

  const [updateFile, setUpdateFile] = useState();

  const closeEditProject = () => setEditShow(false);

  const onFileUpdate = (e) => {
    setUpdateFile(e.target.files[0]);
  }

  const onTextUpdate = (e) => {
    setECredentials({ ...eCredentials, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('filename', updateFile);
    formData.append('projectid', eCredentials.projectid)
    formData.append('projectname', eCredentials.projectname);
    formData.append('projectlang', eCredentials.projectlang);
    formData.append('projectdesc', eCredentials.projectdesc);

    const response = await fetch('http://localhost:5000/api/student/project/updateproject', {
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
      updateProject(json.newProject);
      console.log('json.newProject: ', json.newProject);
    }
    console.log('json: ', json);
  }

  return (
    <>
      <Modal show={editShow} onHide={closeEditProject} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body>
          <div className="modal_form_heading" style={{ fontSize: "24px", color: '#407BFF' }}>Add your project</div>
          <div className="modal_form_body">
            <Form onSubmit={handleSubmit}>
              <Form.Control type="hidden" name="projectid" value={eCredentials.projectid} />

              <Form.Group controlId="projectname">
                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Project name</Form.Label>
                <Form.Control type="text" placeholder="Enter project name" name="projectname" value={eCredentials.projectname} onChange={onTextUpdate} />
                <Form.Text className="text-muted">
                  Example, StudentSpot
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="projectlang">
                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Languages used in your project</Form.Label>
                <Form.Control type="text" placeholder="Enter programming language" name="projectlang" value={eCredentials.projectlang} onChange={onTextUpdate} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="projectdesc">
                <Form.Label style={{ marginBottom: "0px" }} className="mt-3">Project description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Write your description here..." name="projectdesc" value={eCredentials.projectdesc} onChange={onTextUpdate} />
              </Form.Group>

              {/* Image input field */}
              <Form.Group controlId="formFileSm" className="my-3">
                <Form.Label style={{ marginBottom: "0px" }}>Select .zip file of your source code</Form.Label>
                <Form.Control type="file" name="filename" onChange={onFileUpdate} />
              </Form.Group>

              <div className='d-flex justify-content-around mt-3'>
                <Button variant="outline-secondary" onClick={closeEditProject}>Cancel</Button>
                <Button type="submit" variant="outline-danger" onClick={closeEditProject}>Save Project</Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default EditProjectForm