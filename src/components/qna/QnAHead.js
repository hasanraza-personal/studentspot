import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import { QnAContext } from '../../helper/context';

const QnAHead = () => {
    const { setShow } = useContext(QnAContext);
    
    const openQuestionModal = () => {
        setShow(true);
    }

    return (
        <div className='d-flex justify-content-between align-items-center'>
            <div className="profile_head_text">Q&A</div>
            <div className="profile_head_btn">
                <Button variant="outline-danger" onClick={openQuestionModal}>Ask Your Question</Button>
            </div>
        </div>
    )
}

export default QnAHead