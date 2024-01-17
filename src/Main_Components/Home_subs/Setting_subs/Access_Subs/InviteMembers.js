import React from 'react';
import './InviteMembers.css'
import { useRef } from 'react';

import axios from "axios";
import { useContext } from 'react';
import { ProjectContext } from '../../../../Context/ProjectProvider';





function InviteMembers(props) {
    const currentProject = props.currentProject;
    const emailRef = useRef();
    const { state, dispatch } = useContext(ProjectContext);


    const goback = () => {
        props.goback();
    }

    const invite = async () => {
        const isAuthorized = checkAuthorization();

        if (!isAuthorized) {
            alert("You are not authorized to invite members");
            return
        }
        const email = emailRef.current.value;
        if (email === '') {
            alert('Please enter email address');
            return
        }
        if (!email.includes('@')) {
            alert('Please enter valid email address');
            return
        }
        alert(`Invite sent to ${email}`);


        const projectID = state.project.projectID;

        try {
            const res = await axios.post("https://synchronaut-backend.onrender.com/api/project/inviteUser", { email: email, projectId: projectID });
            if (res.status !== 200) {
                alert('Something went wrong');
                goback();
                return
            }

        } catch (error) {
            alert(error.response.data.message)
        }


        goback();

    }
    const checkAuthorization = () => {
        const userId = JSON.parse(localStorage.getItem('user')).userID;
        const projectMods = currentProject.projectMods;
        if (projectMods.includes(userId)) {
            return true;
        }
        return false;

    }
    return (
        <div className='invite_members_main'>
            <h3>Invite Members</h3>
            <input type='text' ref={emailRef} className='invite_members_main_inputI' placeholder='Enter email address' />
            <button className='invite_members_button2' onClick={invite}>Invite</button>
            <p className='disclaimer_inviteMembers'>*invite will be sent if the user is on SynchroNaut Platform</p>
            <p className='cancelBtn_inviteMembers' onClick={goback}>Cancel</p>
        </div>
    )
}

export default InviteMembers