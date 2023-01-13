import { QnAContext } from "../../helper/context"
import { Form, Button, Modal } from 'react-bootstrap';
import { useContext, useState } from 'react';
import alertContext from "../../context/alertContext";

const AddQnAQuestion = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;
    const { show, setShow, addQuestion } = useContext(QnAContext);

    const [credentials, setCredentials] = useState({ question: '' });

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const closeQuestionModal = () => setShow(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/qna/addquestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ question: credentials.question })
        });
        const json = await response.json();

        // display modal when response received
        if (!json.success) {
            setHeadText('Warning');
            setBodyText(json.err);
            handleShow();
        } else {
            setHeadText('Success');
            setBodyText(json.msg);
            handleShow();
            setCredentials({ question: '' });
            addQuestion(json.newQuestion);
        }
        console.log('json: ', json);
    }

    return (
        <>
            <Modal show={show} onHide={closeQuestionModal} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <div className="modal_form_heading mb-1" style={{ fontSize: "24px", color: '#407BFF' }}>Ask your question</div>
                    <div className="modal_form_body">
                        <Form onSubmit={handleSubmit}>
                            
                            <Form.Group className="mb-3" controlId="competitiondesc">
                                <Form.Control as="textarea" rows={6} placeholder="Enter your question here..." name="question" value={credentials.question} onChange={onChange} />
                            </Form.Group>

                            <div className='d-flex justify-content-around mt-3'>
                                <Button variant="outline-secondary" onClick={closeQuestionModal}>Cancel</Button>
                                <Button type="submit" variant="outline-danger" onClick={closeQuestionModal}>Post Question</Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddQnAQuestion