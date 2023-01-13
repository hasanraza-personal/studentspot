import React from 'react'
import '../../css/qna.css';
import { AnswerContext } from '../../helper/context'
import { useEffect, useState, useContext } from 'react';
import Navbar from '../Navbar'
import StudentSidebar from '../sidebar/StudentSidebar'
import alertContext from '../../context/alertContext';
import AnswerHead from './AnswerHead';
import { useLocation } from 'react-router-dom';
import AnswerItem from './AnswerItem';
import AddAnswer from './AddAnswer';
import QuestionItem from './QuestionItem';
import TeacherSidebar from '../sidebar/TeacherSidebar';

const Answer = () => {
    const location = useLocation()
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;
    
    // Bootstrap Modal
    const [show, setShow] = useState(false);
    const [questions, setQuestion] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [history, setHistory] = useState(location.state)
    console.log('history: ', history);
    console.log('location.state: ', location.state);

    let currentQuestionId = location.pathname.split('/').pop();

    useEffect(() => {
        const getAnswer = async () => {
            const response = await fetch(`http://localhost:5000/api/qna/${currentQuestionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            const json = await response.json();
            setQuestion(json.singleQna);
            setAnswers(json.singleQna.answer);
        }
        getAnswer();

        //eslint-disable-nextline
    }, []);

    const addAnswer = (answer) => {
        setAnswers([].concat(answers, answer));
    }

    const handleDelete = async (id) => {
        // console.log('id: ', id);
        const response = await fetch('http://localhost:5000/api/qna/deleteanswer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ answerid: id })
        });
        const json = await response.json();

        // display modal when response received
        if (!json.success) {
            setHeadText('Warning');
            setBodyText(json.error);
            handleShow();
        } else {
            setHeadText('Success');
            setBodyText(json.msg);
            handleShow();

            let newAnswers = answers.filter((answer) => { return answer._id !== id })
            setAnswers(newAnswers);
        }
    }

    return (
        <>
            <AnswerContext.Provider value={{ show, setShow, addAnswer, handleDelete }} >
                <Navbar />
                {history === 'teacher' ? (
                    <TeacherSidebar />
                ) : (
                    <StudentSidebar />
                )}

                <div className="container-fluid">
                    <div className='profile_container'>
                        <div className="sub_profile_container col-md-12 px-2 mt-2">

                            <AnswerHead />
                            <AddAnswer />

                            <div className="all_achievement_container">

                                <div className="row achievement_container">
                                    <QuestionItem question={questions} />

                                    {answers.length !== 0 ? (
                                        answers.map((ans) => {
                                            return <AnswerItem key={ans._id} answers={ans} />
                                        })
                                    ) : (
                                        <div>
                                            Be the first to answer this question
                                        </div>
                                    )}

                                    {/* <AnswerItem answers={answers} /> */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </AnswerContext.Provider>
        </>
    )
}

export default Answer