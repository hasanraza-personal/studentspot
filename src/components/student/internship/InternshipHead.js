import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import { InternshipContext } from '../../../helper/context';

const InternshipHead = () => {
    const { setShow } = useContext(InternshipContext);

    const openAchievementModal = () => {
        setShow(true);
    }

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <div className="profile_head_text">Your Internship</div>
                <div className="profile_head_btn">
                    <Button variant="outline-danger" onClick={openAchievementModal}>Add Internship</Button>
                </div>
            </div>
        </>
    )
}

export default InternshipHead
