import React, { useState } from 'react'

import './DeleteProject.css'
import { useRef } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { ProjectContext } from '../../../../Context/ProjectProvider';
import { AuthContext } from '../../../../Context/AuthProvider';




function DeleteProject(props) {

    const { state: projectState, dispatch: projectDispatch } = useContext(ProjectContext);
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

    const confirmref = useRef(null);
    const [cf, setCf] = useState(false);

    function handleClick() {
        if (confirmref.current.value === 'delete this project') {
            setCf(true);
        }
        else {
            setCf(false);
        }
    }

    function handleCancel() {
        props.delete1();
    }

    async function handleDelete() {
        const projectID = projectState.project.projectID
        const userID = authState.user.userID;

        if (userID != projectState.project.projectLeadId) {
            alert("You cannot delete this project as you are not the project lead");
            return
        }

        if (projectID) {
            const res = await axios.post("https://synchronaut-backend.onrender.com/api/project/deleteTheProject", {
                projectID: projectID
            })
            console.log(res);
            if (res.status === 200) {
                alert("Project Deleted Successfully")
                authDispatch({ type: "DELETE_ONE_PROJECT", payload: { projectID: projectID } })
                props.delete1();
            }

        }
    }



    return (
        <div className='DA_main_main'>
            <div className={'DA_main'}>
                <p>Are you sure to Delete Your Account ?</p>
                <p>Type <span className='span_d'>'delete this project'</span> to confirm</p>
                <input className='DA_input' onChange={handleClick} ref={confirmref} type='text' placeholder='delete this project' />
                <div className='DA_buttons'>
                    <div className='DA_cancel'>
                        <p onClick={handleCancel}>Cancel</p>

                    </div>
                    {cf ? <div className='DA_delete' onClick={handleDelete}>
                        <p>Delete</p>
                    </div> : null}

                </div>
            </div>
        </div>
    )
}

export default DeleteProject