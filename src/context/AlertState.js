import React, { useState } from 'react'
import AlertContext from './alertContext';

function AlertState(props) {
    const [showModal, setShowModal] = useState(false);
    const [headText, setHeadText] = useState(null)
    const [bodyText, setBodyText] = useState(null)

    const handleClose = () => {
        setShowModal(false);
    }
    const handleShow = () => {
        setShowModal(true);
    }

    return (
        <AlertContext.Provider value={{handleClose,handleShow, showModal, headText,setHeadText, bodyText,setBodyText }}>
            {props.children}
        </AlertContext.Provider>
    )
}

export default AlertState
