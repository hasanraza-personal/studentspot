import Moment from 'react-moment';
import { AnswerContext } from '../../helper/context';
import { useContext } from 'react';

const QuestionItem = (props) => {
    const { question } = props;
    
    return (
        <>
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
                    {/* <div><i className="fa-solid fa-trash-can" style={{ color: 'red', cursor: 'pointer' }}></i></div> */}
                </div>

                <div className="qna_body_container my-2">{question.question}</div>
            </div>
        </>
    )
}

export default QuestionItem