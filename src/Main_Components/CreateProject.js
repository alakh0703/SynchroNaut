import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';
import { AuthContext } from '../Context/AuthProvider';
import brainIcon from "../Images/brain.png"
import mounIcon from "../Images/mountain.png"
import robotIcon from "../Images/robot.png"
import defaultIcon from "../Images/soft.svg"
import arrowIcon from "../Images/arrowIcon.png"
import tickIcon from "../Images/tickIcon.png"
import axios from 'axios';
import { db } from '../Firebase'
import { collection, query, where, getDoc, getDocs, setDoc, doc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'

function CreateProject() {
  const { dispatch } = useContext(AuthContext);
  const { state } = useContext(AuthContext);
  const Navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1);


  // form
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLead, setProjectLead] = useState(state.user.name);
  const [invites, setInvites] = useState([])
  const [chooseIcon, setChooseIcon] = useState("soft")

  const handleSubmit = (e) => {
    e.preventDefault();

    if (projectName === '' || projectDescription === '' || projectLead === '') {

      alert('Please fill all the fields')
      return
    }
    if (chooseIcon === mounIcon) {
      setChooseIcon("mountain")
    } else if (chooseIcon === brainIcon) {
      setChooseIcon("brain")
    } else if (chooseIcon === robotIcon) {
      setChooseIcon("robot")
    } else {
      setChooseIcon("soft")
    }


    if (projectName.length > 15) {
      alert("Project name must be under 15 characters")
      return
    }
    const project = {
      projectName: projectName,
      projectDescription: projectDescription,
      projectLead: projectLead,
      projectLeadId: state.user.userID,
      projectIcon: chooseIcon,
      projectInvitees: invites,
      projectLeadEmail: state.user.email,
      memberPic: state.user.profilePic

    };


    addProject(project);
    // console.log(project)
  };

  const addProject = async (project) => {

    const token = localStorage.getItem('token');


    //
    const config = {
      headers: {
        'auth-token': token,
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('https://synchronaut-backend.onrender.com/api/project/addProject', project, config);
    console.log(res.data); // Log the response data if needed

    alert('Project Created')
    const newProject = res.data.savedProject
    const pro = {
      id: newProject.projectID,
      name: newProject.projectName,
      admin: newProject.projectLead

    }


    dispatch({
      type: "UPDATE_PROJECTS",
      payload: {
        projects: pro
      }
    })

    const groupChatID = newProject.projectID + newProject.projectID
    // creating chat for the project in firestore
    await setDoc(doc(db, "groupChat", groupChatID), {
      chatName: newProject.projectName,
      chatId: groupChatID,
      lastMessage: '',
      messages: [],
    });

    const userDocRef = doc(db, "users", state.user.userID);

    // Retrieve the current document data
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();


    Navigate('/vr')


  }


  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleRadioClick = (e) => {
    const icon = e.target.value
    setChooseIcon(icon)
  }

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleInvite = (e) => {
    e.preventDefault()
    const email = e.target[0].value
    if (email.includes('@') && email.slice(-4) === '.com') {
      setInvites([...invites, email])
      e.target[0].value = ''
    }
    else {
      alert('Enter a valid email')
    }
  }

  return (
    <div className='create_project'>
      <div className='create_project_main'>
        {currentStep === 1 && (
          <div className='create_project_main_one'>
            <p className='one_head'>Let's Start</p>
            <input className='one_name one_input' type='text'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder='Project Name' />
            <p className='precaution_projectname'>* Project name must be under 15 characters</p>
            <textarea className='one_proj_description one_input'
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder='Project Description' />

            <input className='one_proj_lead one_input' type='text' value={projectLead} disabled />
          </div>
        )}



        <div className='create_project_main_Btn'>

          {
            currentStep === 1 &&
            <button className='submitBtn' id='submitBtn7' onClick={handleSubmit}>
              <img src={tickIcon} alt='tick' className='tickIcon' />
            </button>
          }
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
