import React, { useContext } from 'react'
import { Modal, Button } from 'react-bootstrap';
import alertContext from '../context/alertContext';

function EmptyAlert() {
    const context = useContext(alertContext);
    const {handleClose,showModal,headText,bodyText} = context;

    return (
        <>
            <Modal show={showModal} onHide={handleClose}  backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <div className="modal_heading">{headText}</div>
                    <div className="modal_body mt-3">{bodyText}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EmptyAlert
