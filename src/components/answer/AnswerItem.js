import Moment from 'react-moment';
import { AnswerContext } from '../../helper/context';
import { useContext, useState, useEffect } from 'react';

const AnswerItem = (props) => {
    const { handleDelete } = useContext(AnswerContext);
    const { answers } = props;
    
    const [setDiv, showSetDiv] = useState(answers.verified ? true : false);
    const [authUser, setAuthUser] = useState();
    const [user, setUser] = useState(answers.userid);
    const [designation, setDesignation] = useState();

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
            setDesignation(json.designation);
        }
        getUser();
        // eslint-disable-next-line
    }, []);

    const handleVerify = async (id) => {
        const response = await fetch('http://localhost:5000/api/qna/verifyanswer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ answerid: id })
        });
        const json = await response.json();

        if (setDiv) {
            showSetDiv(false);
        } else {
            showSetDiv(true);
        }
    }

    return (
        <>
            <div className="container-fluid col-md-8 my-2 qna_ans_container">
                <div className="qna_head_container d-flex justify-content-between align-items-center py-1">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <img src={`http://localhost:5000/images/profile_picture/${answers.photo}`} className="answer_profile_picture" alt="profile" />
                        </div>
                        <div className='answer_head_details mx-2'>
                            <div>{answers.fullname}</div>
                            <div>
                                <Moment from={new Date()}>{answers.createdat}</Moment>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex align-items-center'>
                        {setDiv ? (
                            <>
                                <div>
                                    <img src={process.env.PUBLIC_URL + "/images/check.png"} className="verfied-badge" alt="badge" />
                                </div>
                                <div className='prof_name'>Verified</div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                <div className="answer_body_container mt-2">{answers.answer}</div>

                <div className='d-flex align-items-center justify-content-between'>
                    <div>
                        {designation === 'Teacher' ? (
                            <>
                                {setDiv ? (
                                    <i className="fa-solid fa-check ans_verified_icon" onClick={() => handleVerify(answers._id)}></i>
                                ) : (
                                    <i className="fa-solid fa-check ans_verify_icon" onClick={() => handleVerify(answers._id)}></i>
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </div>

                    {user === authUser ? (
                        <div>
                            <i className="fa-solid fa-trash-can ans_delete_icon" onClick={() => handleDelete(answers._id)}></i>
                        </div>
                    ) : (
                        <></>
                    )}

                </div>
            </div>
        </>
    )
}

export default AnswerItem