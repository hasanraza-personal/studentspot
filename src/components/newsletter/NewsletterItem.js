import { Button, Card } from 'react-bootstrap';
import { useContext, useState } from "react";
import { NewsletterContext } from '../../helper/context';
import { useLocation } from 'react-router-dom'

const NewsletterItem = (props) => {
    const location = useLocation()
    const { handelDelete } = useContext(NewsletterContext);
    const { newsletter } = props;

    const [history, setHistory] = useState(location.state)

    return (
        <div className='col-md-3 my-2' >
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Img variant="top" src={process.env.PUBLIC_URL + "../images/newsletter-image.png"} alt="Achievement" />
                    <Card.Title style={{ textAlign: "left" }}>{newsletter.companyname}</Card.Title>
                    <h5>{newsletter.title}</h5>
                    <Card.Text style={{ textAlign: "left" }}>
                        {newsletter.desc}
                    </Card.Text>

                    {history !== 'student' ? (
                        <div className='d-flex justify-content-around'>
                            <Button variant="outline-secondary" size="sm" onClick={() => handelDelete(newsletter._id)}>Delete</Button>
                        </div>
                    ) : (
                        <></>
                    )}
                    </Card.Body>
            </Card>
        </div>
    )
}

export default NewsletterItem