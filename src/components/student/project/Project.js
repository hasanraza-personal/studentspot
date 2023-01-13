import Navbar from '../../Navbar';
import StudentSidebar from '../../sidebar/StudentSidebar';
import '../../../css/achievement.css';
import { ProjectContext } from '../../../helper/context';
import { useState, useEffect, useContext } from "react";
import alertContext from '../../../context/alertContext';
import ProjectHead from './ProjectHead';
import AddProjectForm from './AddProjectForm';
import ProjectItem from './ProjectItem';
import EditProjectForm from './EditProjectForm';

const Project = () => {
  const context = useContext(alertContext);
  const { handleShow, setHeadText, setBodyText } = context;

  // Bootstrap Modal
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editShow, setEditShow] = useState(false);
  const [eCredentials, setECredentials] = useState('');

  useEffect(() => {
    const getProject = async () => {
      const response = await fetch('http://localhost:5000/api/student/project/getproject', {
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

  const addProject = (project) => {
    setProjects(projects.concat(project))
  }

  const handleDelete = async (id) => {
    const response = await fetch('http://localhost:5000/api/student/project/deleteproject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ projectid: id })
    });
    const json = await response.json();

    // display modal when response received
    if (!json.success) {
      setHeadText('Warning');
      setBodyText(json.error);
      handleShow();
    } else {
      setHeadText('Success');
      setBodyText(json.msg);
      handleShow();

      let newproject = projects.filter((project) => { return project._id !== id })
      setProjects(newproject);
    }
  }

  const handleEdit = (currentProject) => {
    setEditShow(true);
    setECredentials({ projectid: currentProject._id, projectname: currentProject.projectname, projectlang: currentProject.projectlang, projectdesc: currentProject.projectdesc });
  }

  const updateProject = (newproject) => {
    let currentProject = JSON.parse(JSON.stringify(projects))

    for (let index = 0; index < currentProject.length; index++) {
      const element = currentProject[index]
      if (element._id === newproject._id) {
        currentProject[index].projectname = newproject.projectname
        currentProject[index].projectlang = newproject.projectlang
        currentProject[index].projectdesc = newproject.projectdesc
        currentProject[index].projectfile = newproject.projectfile
      }
    }
    setProjects(currentProject);
  }

  return (
    <>
      <ProjectContext.Provider value={{ show, setShow, addProject, handleDelete, editShow, setEditShow, eCredentials, setECredentials, updateProject }}>
        <Navbar />
        <StudentSidebar />
        <div className="container-fluid">
          <div className='profile_container'>
            <div className="sub_profile_container col-md-12 px-2 mt-2">

              <ProjectHead />
              <AddProjectForm />
              <EditProjectForm />

              <div className="all_achievement_container my-3">
                {projects.length !== 0 ? (
                  <div className="row achievement_container">
                    {projects.map((project) => {
                      return <ProjectItem key={project._id} handleEdit={handleEdit} project={project} />
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
      </ProjectContext.Provider>
    </>
  )
}

export default Project