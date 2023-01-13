// import { useEffect } from 'react'
import { useEffect, useState } from 'react';
import Navbar from '../../Navbar'
import StudentSidebar from '../../sidebar/StudentSidebar'
import StudentHomeHead from './StudentHomeHead'
import StudentHomeItem from './StudentHomeItem';

const StudentHome = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const getProject = async () => {
      const response = await fetch('http://localhost:5000/api/student/project/getallproject', {
        method: 'GET',
        // headers: {
        //   'auth-token': localStorage.getItem('token')
        // },
      });
      const json = await response.json();
      setProjects(json.project);
    }
    getProject();

    //eslint-disable-nextline
  }, []);
  console.log(projects);

  return (
    <>
      <Navbar />
      <StudentSidebar />
      <div className="container-fluid">
        <div className='profile_container'>
          <div className="sub_profile_container col-md-12 px-2 mt-2">

            <StudentHomeHead />

            <div className="all_achievement_container my-3">
              {projects.length !== 0 ? (
                <div className="row achievement_container">
                  {projects.map((project) => {
                    return <StudentHomeItem key={project._id} project={project} />
                  })}
                </div>
              ) : (
                <div className="empty_achievement_container mt-5">
                  You have not added any of your projects
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default StudentHome