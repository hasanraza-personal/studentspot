import { Button, Card } from 'react-bootstrap';
import { useContext } from "react";
import { AchievementContext } from "../../../helper/context";

const AchievementItem = (props) => {
    const { handleDelete } = useContext(AchievementContext);
    const { achievement, handleEdit } = props;
    return (
        <>
            <div className='col-md-3' >
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Img variant="top" src={process.env.PUBLIC_URL + "../images/achievement-image.png"} alt="Achievement" />
                        <Card.Title style={{ textAlign: "left" }}>{achievement.competitionname}</Card.Title>
                        <h5>{achievement.competitionlevel}</h5>
                        <Card.Text style={{ textAlign: "left" }}>
                            {achievement.competitiondesc}
                        </Card.Text>
                        <h6>
                            <a href={`http://localhost:5000/images/achievement_certificate/${achievement.competitioncert}`} target="_blank" rel="noreferrer">View Certificate</a>
                        </h6>
                        <div className='d-flex justify-content-around'>
                            <Button variant="outline-secondary" size="sm" onClick={() => handleDelete(achievement._id)}>Delete</Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleEdit(achievement)} >Edit</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default AchievementItem
