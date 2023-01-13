import { Button, Card } from 'react-bootstrap';
import { useContext } from "react";
import { InternshipContext } from "../../../helper/context";

const InternshipItem = (props) => {
    const { handleDelete } = useContext(InternshipContext);
    const { internship, handleEdit } = props;
    return (
        <>
            <div className='col-md-3' >
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
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
                        <div className='d-flex justify-content-around'>
                            <Button variant="outline-secondary" size="sm" onClick={() => handleDelete(internship._id)}>Delete</Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleEdit(internship)} >Edit</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default InternshipItem
