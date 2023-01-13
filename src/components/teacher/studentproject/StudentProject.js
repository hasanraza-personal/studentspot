import '../../../css/achievement.css';
import TeacherSidebar from '../../sidebar/TeacherSidebar'
import Navbar from "../../Navbar"
import { useState, useEffect } from "react";
import '../../../css/qna.css';
import { Form } from 'react-bootstrap';
import StudentProjectItem from './StudentProjectItem';

const StudentProject = () => {
    const [projects, setProjects] = useState([]);

    const onChange = async (e) => {
        const response = await fetch('http://localhost:5000/api/teacher/studentproject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ semester: e.target.value })
        });
        const json = await response.json();
        setProjects(json.project);
    }

    useEffect(() => {
        const getProject = async () => {
            const response = await fetch('http://localhost:5000/api/teacher/studentproject', {
                method: 'GET',
                headers: {
                    'auth-token': localStorage.getItem('token')
                },
            });
            const json = await response.json();
            setProjects(json.project);
        }
        getProject();

        //eslint-disable-nextline
    }, []);
    return (
        <>
            <Navbar />
            <TeacherSidebar />

            <div className="container-fluid">
                <div className='profile_container'>
                    <div className="sub_profile_container col-md-12 px-2 mt-2">

                        <div className='d-flex justify-content-between align-items-center'>
                            <div className="profile_head_text">Student's Projects</div>
                            <div className="profile_head_btn">
                                <Form.Select id="semester" name="semester" onChange={onChange}>
                                    <option>All Semester</option>
                                    <option>First Semester</option>
                                    <option>Second Semester</option>
                                    <option>Third Semester</option>
                                    <option>Fourth Semester</option>
                                    <option>Fifth Semester</option>
                                    <option>Sixth Semester</option>
                                    <option>Seventh Semester</option>
                                    <option>Eighth Semester</option>
                                </Form.Select>
                            </div>
                        </div>

                        <div className="all_achievement_container my-3">
                            {projects.length !== 0 ? (
                                <div className="row achievement_container">
                                    {projects.map((project) => {
                                        return <StudentProjectItem key={project._id} project={project} />
                                    })}
                                </div>
                            ) : (
                                <div className="empty_achievement_container mt-5">
                                    No project has been uploaded by any of your students
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentProject