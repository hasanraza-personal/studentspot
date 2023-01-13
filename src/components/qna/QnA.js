import React from 'react'
import '../../css/qna.css';
import { QnAContext } from '../../helper/context'
import { useEffect, useState, useContext } from 'react';
import Navbar from '../Navbar'
import StudentSidebar from '../sidebar/StudentSidebar'
import QnAHead from './QnAHead'
import QnaQuestionItem from './QnaQuestionItem';
import AddQnAQuestion from './AddQnAQuestion';
import alertContext from '../../context/alertContext';
import { useLocation } from 'react-router-dom'
import TeacherSidebar from '../sidebar/TeacherSidebar';
import SearchQnA from './SearchQnA';


const QnA = () => {
    const location = useLocation()
    // console.log(location.state)

    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    // Bootstrap Modal
    const [show, setShow] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [history, setHistory] = useState(location.state)
    // console.log('history: ', history);

    useEffect(() => {
        const getQuestion = async () => {
            const response = await fetch('http://localhost:5000/api/qna', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            const json = await response.json();
            // console.table('json: ', json);
            setQuestions(json.Qna);
        }
        getQuestion();

        //eslint-disable-nextline
    }, []);

    const addQuestion = (question) => {
        setQuestions([].concat(question, questions));
    }

    const handleDelete = async (id) => {
        console.log('id: ', id);
        const response = await fetch('http://localhost:5000/api/qna/deletequestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ id })
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

            let newQuestions = questions.filter((question) => { return question._id !== id })
            setQuestions(newQuestions);
        }
    }

    return (
        <>
            <QnAContext.Provider value={{ show, setShow, addQuestion, handleDelete }} >
                <Navbar />
                {history === 'teacher' ? (
                    <TeacherSidebar />
                ) : (
                    <StudentSidebar />
                )}

                <div className="container-fluid">
                    <div className='profile_container'>
                        <div className="sub_profile_container col-md-12 px-2 mt-2">

                            <QnAHead />
                            <AddQnAQuestion />
                            <div className='container-fluid col-md-10 my-4'>
                                <SearchQnA />
                            </div>

                            <div className="all_achievement_container">
                                <div className="empty_achievement_container mt-5">
                                    {questions.length === 0 && "No question availabe be the first one to ask the question"}
                                </div>

                                <div className="row achievement_container">
                                    {questions.map((question) => {
                                        return <QnaQuestionItem key={question._id} question={question} />
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </QnAContext.Provider>
        </>
    )
}

export default QnA