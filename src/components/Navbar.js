import React from 'react';
import '../css/navbar.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    let navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    return (
        <>
            <nav className='navbar_container d-flex justify-content-between'>
                <div className="navbar_title">
                    <Link className="nav-link" style={{ color: 'white' }} to="/">StudentSpot</Link>
                </div>

                <div className="bavbar_button" style={{ marginRight: '20px' }}>
                    {!localStorage.getItem('token') ?
                        <div>
                            <Link type="button" className="btn btn-danger mx-2" to="/signup">Signup</Link>
                            <Link type="button" className="btn btn-danger" to="/login">Login</Link>
                        </div> :
                        <div>
                            <Button variant="danger" onClick={handleLogout} type="button">Logout</Button>
                        </div>
                    }
                </div>
            </nav>
        </>
    )
}

export default Navbar
