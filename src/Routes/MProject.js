import React, { useState, useContext, Suspense, useEffect } from 'react';
import './Project.css';
import Sidebar from '../Main_Components/Home_subs/Sidebar';
import { Outlet, useSearchParams } from 'react-router-dom';
import Kanban from '../Main_Components/Home_subs/Kanban';
import Psetting from '../Main_Components/Home_subs/Psetting';
import Members from '../Main_Components/Home_subs/Members';
import { ProjectContext } from '../Context/ProjectProvider';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MProject() {
  const { id } = useParams();

  const { state, dispatch } = useContext(ProjectContext);
  const [currentProject, setCurrentProject] = useState({});
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('kanban');

  const fetchProject = async (projectId) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));

      const response = await axios.get(`https://synchronaut-backend.onrender.com/api/project/getProject?projectID=${projectId}`, {
        headers: {
          'auth-token': token
        }
      });

      const project = response.data.project;

      dispatch({ type: 'SET_PROJECT', payload: project });

      const auth = checkAuthorization(project);
      setAuthorized(auth);
      setCurrentProject(project);
    } catch (error) {
      console.log(error);
      alert("Project not found. Try logging in again. It may be deleted or you may not have access to it.")
      window.location.href = '/vr';
    }
  };

  const checkAuthorization = (pro) => {
    const userId = JSON.parse(localStorage.getItem('user')).userID;
    const projectMods = pro.projectMods;
    if (projectMods.includes(userId)) {
      return true;
    }
    return false;



  }
  useEffect(() => {
    const projectId = id
    if (projectId) {
      fetchProject(projectId);
    }
  }, []);

  return (
    <div className='in_project'>

      <Sidebar currentProject={currentProject} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'kanban' && <Kanban isAuthorized={authorized} currentProject={currentProject} />}
      {activeTab === 'members' && <Members currentProject={currentProject} />}
      {activeTab === 'project-settings' && <Psetting currentProject={currentProject} />}

    </div>
  );
}

export default MProject;
