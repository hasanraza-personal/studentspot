import React, { useEffect } from 'react'
import Navbar from './Navbar'
import '../css/home.css';
import { Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/student/home')
        } else {
            navigate('/')
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Navbar />
            <div style={{backgroundColor: '#fff'}}>
                <div className="container-fluid col-md-10 home_container">

                    <div className="sub_container_one d-flex">
                        <div className="main_text_conatiner">
                            <div className="main_text_title">
                                Buid Development Skills with StudentSpot Anytime, Anywhere
                            </div>
                            <div className="main_text_desc">
                                Here, you will find peoplewho has skill. You will get to see
                                many projects. You will get an idea what other people are doing around you.
                            </div>
                            <div className="main_text_btn">
                                <Button variant="danger" type="button">
                                    <Link style={{ color: 'white', textDecoration: 'none' }} to="/login">Join For Free</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="main_image">
                            <img src={process.env.PUBLIC_URL + "images/main-image.png"} className="img-fluid" width="600px" height="400px" alt="homepage" />
                        </div>
                    </div>

                    {/* Student container */}
                    <div className="sub_container_two">
                        <div className="sub_container_title">What Students can do?</div>
                        <div className="student_card d-flex justify-content-around">
                            <Card style={{ width: '19rem' }}>
                                <Card.Img variant="top" src={process.env.PUBLIC_URL + "images/project-image.png"} />
                                <Card.Body>
                                    <Card.Title>Project</Card.Title>
                                    <Card.Text>
                                        You can see projects of other people. You will get an idea of what kind of projects you can make.
                                        It is good place to start. Check what you friend have made.
                                    </Card.Text>
                                    <div className="d-flex justify-content-center">
                                        <Button variant="danger">
                                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/login">Join Now!</Link>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card style={{ width: '19rem' }}>
                                <Card.Img variant="top" src={process.env.PUBLIC_URL + "images/q_and_a-image.png"} />
                                <Card.Body>
                                    <Card.Title>Q&A</Card.Title>
                                    <Card.Text>
                                        Got a question but not getting any answers then you have come to a roght place.
                                        Here you can ask questions to your friends and you can even answer.
                                    </Card.Text>
                                    <div className="d-flex justify-content-center">
                                        <Button variant="danger">
                                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/login">Join Now!</Link>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card style={{ width: '19rem' }}>
                                <Card.Img variant="top" src={process.env.PUBLIC_URL + "images/rooms-image.png"} width="100px" />
                                <Card.Body>
                                    <Card.Title>Newsletter</Card.Title>
                                    <Card.Text>
                                        Suddenly, heard some competition that is going around or some fest and you missed it.
                                        But don't worry in this platorm you will get every news that is going in college. 
                                    </Card.Text>
                                    <div className="d-flex justify-content-center">
                                        <Button variant="danger">
                                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/login">Join Now!</Link>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                    {/* Teacher Section */}
                    <div className="sub_container_two">
                        <div className="sub_container_title">What Teachers can do?</div>
                        <div className="student_card d-flex justify-content-around">
                            <Card style={{ width: '19rem' }}>
                                <Card.Img variant="top" src={process.env.PUBLIC_URL + "images/achievement-image.png"} />
                                <Card.Body>
                                    <Card.Title>Achievements</Card.Title>
                                    <Card.Text>
                                        Have you ever thought what your students have done in their life, have achieve anything
                                        beside studies. tf you thought about this, then you have come to a right place.
                                    </Card.Text>
                                    <div className="d-flex justify-content-center">
                                        <Button variant="danger">
                                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/login">Join Now!</Link>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card style={{ width: '19rem' }}>
                                <Card.Img variant="top" src={process.env.PUBLIC_URL + "images/Internship-image.png"} />
                                <Card.Body>
                                    <Card.Title>Internships</Card.Title>
                                    <Card.Text>
                                        Tired of saying that "Please students submit your Internship Certificate to us".
                                        Not anymore. Students can upload Internship Certificate and you just have to see it.
                                    </Card.Text>
                                    <div className="d-flex justify-content-center">
                                        <Button variant="danger">
                                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/login">Join Now!</Link>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card style={{ width: '19rem' }}>
                                <Card.Img variant="top" src={process.env.PUBLIC_URL + "images/notice-image.png"} width="100px" />
                                <Card.Body>
                                    <Card.Title>Projects</Card.Title>
                                    <Card.Text>
                                        Tired of telling students to take reference from senior projects. Don't worry about
                                        we have covered it for you. We have provided student projects for you.
                                    </Card.Text>
                                    <div className="d-flex justify-content-center">
                                        <Button variant="danger">
                                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/login">Join Now!</Link>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
