import { Card } from 'react-bootstrap';

const StudentAchievementItem = (props) => {
    const { achievement } = props;
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
                                    <div>{achievement.fullname}</div>
                                    <div>{achievement.semester}</div>
                                </div>
                            </div>
                        </div>

                        <Card.Img variant="top" src={process.env.PUBLIC_URL + "../images/achievement-image.png"} alt="Achievement" />
                        <Card.Title style={{ textAlign: "left" }}>{achievement.competitionname}</Card.Title>
                        <h5>{achievement.competitionlevel}</h5>
                        <Card.Text style={{ textAlign: "left" }}>
                            {achievement.competitiondesc}
                        </Card.Text>
                        <h6>
                            <a href={`http://localhost:5000/images/achievement_certificate/${achievement.competitioncert}`} target="_blank" rel="noreferrer">View Certificate</a>
                        </h6>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default StudentAchievementItem