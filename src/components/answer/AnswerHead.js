import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import { AnswerContext } from '../../helper/context';

const AnswerHead = () => {
    const { setShow } = useContext(AnswerContext);

    const openAnswerModal = () => {
        setShow(true);
    }
    return (
        <div className='d-flex justify-content-between align-items-center'>
            <div className="profile_head_text">Answer Section</div>
            <div className="profile_head_btn">
                <Button variant="outline-danger" onClick={openAnswerModal}>Give Your Answer</Button>
            </div>
        </div>
    )
}

export default AnswerHead