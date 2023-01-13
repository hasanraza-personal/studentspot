import { Button, Card } from 'react-bootstrap';
import { useContext } from "react";
import { ProjectContext } from "../../../helper/context";

const ProjectItem = (props) => {
    const { handleDelete } = useContext(ProjectContext);
    const { project, handleEdit } = props;
    return (
        <>
            <div className='col-md-3' >
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Img variant="top" src={process.env.PUBLIC_URL + "../images/project-image.png"} alt="Project" />
                        <Card.Title style={{ textAlign: "left" }}>{project.projectname}</Card.Title>
                        <h5>{project.projectlang}</h5>
                        <Card.Text style={{ textAlign: "left" }}>
                            {project.projectdesc}
                        </Card.Text>
                        <h6>
                            <a href={`http://localhost:5000/project_file/?filename=${project.projectfile}`} rel="noreferrer">Download</a>
                        </h6>
                        <div className='d-flex justify-content-around'>
                            <Button variant="outline-secondary" size="sm" onClick={() => handleDelete(project._id)}>Delete</Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleEdit(project)}>Edit</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default ProjectItem