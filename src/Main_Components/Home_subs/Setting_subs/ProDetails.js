import React, { useEffect } from 'react';
import './ProDetails.css';
import { ProjectContext } from '../../../Context/ProjectProvider';


function ProDetails() {
  const {state, dispatch} = React.useContext(ProjectContext);
  const [description, setDescription] = React.useState('');

  useEffect(() => {
    setDescription(state.project.projectDescription);
  }
  , []);
  return (
    <div className='project_details_main'>
      <textarea className='project_details_textarea' value={description} disabled />
    </div>
  )
}

export default ProDetails