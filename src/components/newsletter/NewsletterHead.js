import { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { NewsletterContext } from '../../helper/context';

const NewsletterHead = () => {
    const { setShow } = useContext(NewsletterContext)

    const openNewsletterModal = () => {
        setShow(true);
    }

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <div className="profile_head_text">Your Newsletter</div>
                <div className="profile_head_btn">
                    <Button variant="outline-danger" onClick={openNewsletterModal}>Add Newsletter</Button>
                </div>
            </div>
        </>
    )
}

export default NewsletterHead