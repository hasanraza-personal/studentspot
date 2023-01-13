import { useEffect, useState } from 'react'
import '../../css/sidebar.css';
import { NavLink } from 'react-router-dom';

const NewsletterSidebar = () => {
    return (
        <>
            <div className="side-menu">
                <center>
                    <img src={process.env.PUBLIC_URL + "/images/writer_img.png"} alt="profile" className="profile-picture" />
                    <div className="admin-name">
                        <h2>M.H.S.S.C.O.E.</h2>
                        <img src={process.env.PUBLIC_URL + "/images/check.png"} className="verfied-badge" alt="badge" />
                    </div>
                    <h5>Writer</h5>
                </center>
                {/* <br /> */}
                <li className="panel-link-wrapper">
                    <NavLink style={({ isActive }) => {
                        return {
                            borderLeft: isActive ? '7px solid #ffb833' : '',
                            backgroundColor: isActive ? '#0750d8' : '',
                        };
                    }} to="/newsletter">
                        <i className="fa-solid fa-pen">
                            <span>Newsletter</span>
                        </i>
                    </NavLink>
                </li>

            </div>
        </>
    )
}

export default NewsletterSidebar