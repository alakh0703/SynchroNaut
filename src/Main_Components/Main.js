import React, { useEffect, useState } from 'react';
import './Main.css';
import Project from './Project.Main';
import hangoutImg from '../Images/meeting.png';
import taskManagerImg from '../Images/test.png';
import { Link } from 'react-router-dom';
import ViewAllProjects from './ViewAllProjects';


function Main() {
  const [viewAllProjects, setViewAllProjects] = useState(false);
  const [originalProjects, setOriginalProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const text1 = 'View all projects';
  const [showText1, setShowText1] = useState(false);

  const goToHangout = () => {
    // get base url
    const baseUrl = window.location.origin;
    window.open(`${baseUrl}/vr/hangout-login`, '_blank');
  }
  const goToTaskManager = () => {
    const baseUrl = window.location.origin;

    window.open(`${baseUrl}/vr/taskManager`, '_blank');
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));

    if (!user && !token) {
      // Redirect to the login page if user or token is missing.
      window.location.href = '/';
      return;
    }

    if (user && token) {
      // Set the original projects from the user's data.
      if (user.projects.length > 0) {
        setOriginalProjects(user.projects);
      }
    }
  }, []);

  // Update the projects and showText1 based on originalProjects.
  useEffect(() => {
    if (originalProjects.length > 6) {
      setShowText1(true);
      setProjects(originalProjects.slice(0, 6));
    } else {
      setShowText1(false);
      setProjects(originalProjects);
    }
  }, [originalProjects]);

  const viewAllProjectsHandler = () => {
    setViewAllProjects((prev) => !prev);
  }
  return (
    <div className="main">
      <div className="main_nav">
        <h3 className="main_yourwork" >Your Work</h3>
        {showText1 && <p className="main_nav_viewall" onClick={viewAllProjectsHandler}>{text1}</p>}
      </div>
      <div className="main_rprojects">
        {projects.length === 0 && <p className="no_projects_found">No projects found. &nbsp; <Link to="/vr/createProject"><span className='no_pf_create'>Create a project</span></Link></p>}
        {projects.map((project) => (
          <Link key={project.id} to={`/vr/viewProject/${project.id}`} style={{ textDecoration: 'none' }}>
            <Project id={project.id} name={project.name} admin={project.admin} />
          </Link>
        ))}
      </div>
      {viewAllProjects && <ViewAllProjects OProjects={originalProjects} close={viewAllProjectsHandler} />}
      <div className="main_nav2">
        <h3 className="main_activities">Activities</h3>
      </div>
      <div className="main_activities_main">
        <div className="main_a1">
          <div className="main_a1_profile" onClick={goToHangout}>
            <img src={hangoutImg} alt="" className="main_a1_img" />
            <h3 className="main_a1_h3">Hangout</h3>
          </div>
          <div className="main_a1_profile" onClick={goToTaskManager}>
            <img src={taskManagerImg} alt="" className="main_a1_img2" />
            <h3 className="main_a1_h3">Task Manager</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
