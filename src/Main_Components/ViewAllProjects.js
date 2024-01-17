import React, { useEffect , useState} from 'react';
import './ViewAllProjects.css';
import Project from './Project.Main'
import { Link } from 'react-router-dom';

function ViewAllProjects(props) {
    const [projects, setProjects] = useState([]);
    const close = () => {
        props.close()
    }


    useEffect(() => {
        setProjects(props.OProjects);
    }, []);
  return (
    <div className='view_all_project_main'>
                    <p className='close_vlpc' onClick={close}>Close</p>

        <div className='view_all_project_cotainer'>
            {projects.map((project) => (
                 <Link key={project.id} to={`/vr/viewProject?id=${project.id}`} style={{ textDecoration: 'none' }}>
                 <Project id={project.id} name={project.name} admin={project.admin} />
               </Link>
            ))}
        </div>
    </div>
  )
}

export default ViewAllProjects