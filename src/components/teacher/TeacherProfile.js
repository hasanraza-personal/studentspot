import React, { useContext } from 'react'
import alertContext from '../../context/alertContext';
import Navbar from '../Navbar'
import TeacherSidebar from '../sidebar/TeacherSidebar'
import UpdateAccountDetails from '../UpdateAccountDetails';
import UpdatePassword from '../UpdatePassword';
import UpdatePhoto from '../UpdatePhoto';
const TeacherProfile = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

        return (
        <>
            <Navbar />
            <TeacherSidebar />

            <div className="container-fluid">
                <div className='profile_container'>
                    <div className="sub_profile_container col-md-6">
                        <div className="profile_head_text">Profile Section</div>

                        <UpdatePhoto />

                        <UpdateAccountDetails />

                        <UpdatePassword />

                    </div>
                </div>
            </div>
        </>
    )
}

export default TeacherProfile