import { AnswerContext } from "../../helper/context"
import { Form, Button, Modal } from 'react-bootstrap';
import { useContext, useState } from 'react';
import alertContext from "../../context/alertContext";
import { useLocation } from "react-router-dom";

const AddAnswer = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;
    const { show, setShow, addAnswer } = useContext(AnswerContext);

    const [credentials, setCredentials] = useState({ answer: '' });

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const closeAnswerModal = () => setShow(false);

    const location = useLocation();
    let currentQuestionId = location.pathname.split('/').pop();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/qna/addanswer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ questionid: currentQuestionId, answer: credentials.answer })
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
            setCredentials({ answer: '' });
            addAnswer(json.newAnswer);
        }
        console.log('json: ', json);
    }

    return (
        <>
            <Modal show={show} onHide={closeAnswerModal} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <div className="modal_form_heading mb-1" style={{ fontSize: "24px", color: '#407BFF' }}>Give Your Answer</div>
                    <div className="modal_form_body">
                        <Form onSubmit={handleSubmit}>

                            <Form.Group className="mb-3" controlId="competitiondesc">
                                <Form.Control as="textarea" rows={6} placeholder="Enter your answer here..." name="answer" value={credentials.answer} onChange={onChange} />
                            </Form.Group>

                            <div className='d-flex justify-content-around mt-3'>
                                <Button variant="outline-secondary" onClick={closeAnswerModal}>Cancel</Button>
                                <Button type="submit" variant="outline-danger" onClick={closeAnswerModal}>Post Answer</Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddAnswer