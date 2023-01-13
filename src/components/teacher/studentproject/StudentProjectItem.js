import { Card } from 'react-bootstrap';

const StudentProjectItem = (props) => {
    const { project } = props;
    return (
        <div className='col-md-3' >
            <Card style={{ width: '18rem' }}>
                <Card.Body>

                    <div className="qna_head_container d-flex justify-content-between align-items-center py-1">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <img src={process.env.PUBLIC_URL + "../images/student_user.png"} className="qna_profile_picture" alt="profile" />
                            </div>
                            <div className='qna_head_details mx-2'>
                                <div>{project.fullname}</div>
                                <div>{project.semester}</div>
                            </div>
                        </div>
                    </div>

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
    )
}

export default StudentProjectItem