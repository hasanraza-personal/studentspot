import Moment from 'react-moment';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { QnAContext } from '../../helper/context';
import { useContext, useEffect, useState } from 'react';

const QnaQuestionItem = (props) => {
    const location = useLocation()
    const { question } = props;
    const { handleDelete } = useContext(QnAContext);
    const [history, setHistory] = useState(location.state)
    // console.log('history: ', history);

    const [authUser, setAuthUser] = useState();
    const [user, setUser] = useState(question.userid);

    useEffect(() => {
        // Fetch userid for delete icon
        const getUser = async () => {
            const response = await fetch('http://localhost:5000/api/common/getuserid', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            let json = await response.json();
            setAuthUser(json._id)
        }
        getUser();
        // eslint-disable-next-line
    }, []);

    return (
        
            <div className="container-fluid col-md-9 my-2 qna_container">
                <div className="qna_head_container d-flex justify-content-between align-items-center py-1">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <img src={`http://localhost:5000/images/profile_picture/${question.photo}`} className="qna_profile_picture" alt="profile" />
                        </div>
                        <div className='qna_head_details mx-2'>
                            <div>{question.fullname}</div>
                            <div>
                                <Moment from={new Date()}>{question.createdat}</Moment>
                            </div>
                        </div>
                    </div>
                    {user === authUser ? 
                    (
                        <div>
                            <i className="fa-solid fa-trash-can" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(question._id)}></i>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>

                <div className="qna_body_container mt-2">{question.question}</div>

                <div className='d-flex justify-content-between align-items-center'>
                    <div className="qna_footer_container mb-1">Answers Given: {question.answer.length}</div>
                    <Link className="nav-link question_link" to={`${question._id}`} state={history} >
                        <Button variant="outline-success" size='sm'>View</Button>
                    </Link>
                </div>
            </div>
    )
}

export default QnaQuestionItem