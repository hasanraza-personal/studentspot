import { useEffect, useState } from 'react'
import '../../css/sidebar.css';
import { NavLink } from 'react-router-dom';

const StudentSidebar = () => {
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
                    <h5>Student</h5>
                </center>
                {/* <br /> */}
                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/student/home">
                        <i className="fas fa-home">
                            <span>Home</span>
                        </i>
                    </NavLink>
                </li>

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/student/profile" >
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
                        to="/student/achievement">
                        <i className="fa-solid fa-trophy">
                            <span>Achievement</span>
                        </i>
                    </NavLink>
                </li>

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/student/internship">
                        <i className="fa-solid fa-laptop-code">
                            <span>Internship</span>
                        </i>
                    </NavLink>
                </li>

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/student/project">
                        <i className="fa-solid fa-laptop-file">
                            <span>Project</span>
                        </i>
                    </NavLink>
                </li>

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/qna" state="student" id="side-menu5">
                        <i className="fa-solid fa-question">
                            <span>Q&A</span>
                        </i>
                    </NavLink>
                </li>

                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/student/newsletter" state="student" >
                        <i className="fa-regular fa-comment">
                            <span>Newsletter</span>
                        </i>
                    </NavLink>
                </li>

                {/* <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/student/mentor">
                        <i className="fa-solid fa-chalkboard-user">
                            <span>Mentor</span>
                        </i>
                    </NavLink>
                </li> */}

                {/* <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/student/notification" >
                        <i className="fa-regular fa-bell">
                            <span>Notification</span>
                        </i>
                    </NavLink>
                </li> */}

            </div>
        </>
    )
}

export default StudentSidebar
