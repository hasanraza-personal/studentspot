import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import { ProjectContext } from '../../../helper/context';

const ProjectHead = () => {
    const { setShow } = useContext(ProjectContext);
    
    const openProjectModal = () => {
        setShow(true);
    }
  return (
    <>
            <div className='d-flex justify-content-between align-items-center'>
                <div className="profile_head_text">Your Project</div>
                <div className="profile_head_btn">
                    <Button variant="outline-danger" onClick={openProjectModal}>Add Project</Button>
                </div>
            </div>
        </>
  )
}

export default ProjectHead