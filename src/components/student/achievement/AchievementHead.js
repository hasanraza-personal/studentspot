import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import { AchievementContext } from '../../../helper/context';

const AchievementHead = () => {
    const { setShow } = useContext(AchievementContext);
    
    const openAchievementModal = () => {
        setShow(true);
    }

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <div className="profile_head_text">Your Achievement</div>
                <div className="profile_head_btn">
                    <Button variant="outline-danger" onClick={openAchievementModal}>Add Achievement</Button>
                </div>
            </div>
        </>
    )
}

export default AchievementHead
