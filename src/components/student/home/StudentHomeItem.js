import { Button, Card } from 'react-bootstrap';
import { useContext } from "react";

const StudentHomeItem = (props) => {
    const { project } = props;
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
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default StudentHomeItem