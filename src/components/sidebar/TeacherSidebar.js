import { useEffect, useState } from 'react'
import '../../css/sidebar.css';
import { NavLink } from 'react-router-dom';

const TeacherSidebar = () => {
    const [userDetails, setUserDetails] = useState({ fullname: '', designation: '' });
    const [userPhoto, setUserPhoto] = useState('');
    useEffect(() => {
        const getUser = async () => {
            const response = await fetch('http://localhost:5000/api/common/getuserdetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            let json = await response.json();
            setUserDetails({ fullname: json.fullname });
            setUserPhoto(`http://localhost:5000/images/profile_picture/${json.photo}`);
        }
        getUser();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="side-menu">
                <center>
                    <img src={userPhoto} alt="profile" className="profile-picture" />
                    <div className="admin-name">
                        <h2>{userDetails.fullname}</h2>
                        <img src={process.env.PUBLIC_URL + "/images/check.png"} className="verfied-badge" alt="badge" />
                    </div>
                    <h5>Teacher</h5>
                </center>
                {/* <br /> */}
                {/* <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/teacher/home">
                        <i className="fas fa-home">
                            <span>Home</span>
                        </i>
                    </NavLink>
                </li> */}

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/teacher/profile" >
                        <i className="fa-regular fa-user">
                            <span>Profile</span>
                        </i>
                    </NavLink>
                </li>

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }}
                        to="/teacher/studentachievement">
                        <i className="fa-solid fa-trophy">
                            <span>View Achievement</span>
                        </i>
                    </NavLink>
                </li>

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/teacher/studentinternship">
                        <i className="fa-solid fa-laptop-code">
                            <span>View Internship</span>
                        </i>
                    </NavLink>
                </li>

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/teacher/studentproject">
                        <i className="fa-solid fa-laptop-file">
                            <span>View Project</span>
                        </i>
                    </NavLink>
                </li>

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/qna" state='teacher' id="side-menu5">
                        <i className="fa-solid fa-question">
                            <span>Q&A</span>
                        </i>
                    </NavLink>
                </li>

                {/* <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/teacher/notification" >
                        <i className="fa-regular fa-comment">
                            <span>Notification</span>
                        </i>
                    </NavLink>
                </li> */}

                {/* <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/teacher/profile" >
                        <i className="fa-regular fa-user">
                            <span>Profile</span>
                        </i>
                    </NavLink>
                </li> */}

            </div>
        </>
    )
}

export default TeacherSidebar