import { Card } from 'react-bootstrap';

const StudentInternshipItem = (props) => {
    const { internship } = props;
    return (
        <>
            <div className='col-md-3' >
                <Card style={{ width: '18rem' }}>
                    <Card.Body>

                        <div className="qna_head_container d-flex justify-content-between align-items-center py-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <img src={process.env.PUBLIC_URL + "../images/student_user.png"} className="qna_profile_picture" alt="profile" />
                                </div>
                                <div className='qna_head_details mx-2'>
                                    <div>{internship.fullname}</div>
                                    <div>{internship.semester}</div>
                                </div>
                            </div>
                        </div>

                        <Card.Img variant="top" src={process.env.PUBLIC_URL + "../images/internship-image.png"} alt="Achievement" />
                        <Card.Title style={{ textAlign: "left" }}>{internship.companyname}</Card.Title>
                        <h5>{internship.workduration}</h5>
                        <h5>{internship.stipends}</h5>
                        <h5>{internship.languages}</h5>
                        <Card.Text style={{ textAlign: "left" }}>
                            {internship.workdesc}
                        </Card.Text>
                        <h6>
                            <a href={`http://localhost:5000/images/internship_certificate/${internship.internshipcert}`} target="_blank" rel="noreferrer">View Certificate</a>
                        </h6>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default StudentInternshipItem