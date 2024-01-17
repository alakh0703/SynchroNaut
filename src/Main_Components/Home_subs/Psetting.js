import React from 'react';
import './Psetting.css'
import AccessSett from './Setting_subs/AccessSett';

import ProDetails from './Setting_subs/ProDetails';
import DeletePro from './Setting_subs/DeletePro';


function Psetting({ currentProject }) {


  const [settType, setSettType] = React.useState('access');

  const [access, setAccess] = React.useState(true);
  const [details, setDetails] = React.useState(false);
  const [deletePro, setDeletePro] = React.useState(false);
  const handleDetails = (e) => {
    setSettType('details');
    setAccess(false);
    setDetails(true);
    setDeletePro(false);
  }

  const handleAccess = (e) => {
    setSettType('access');
    setAccess(true);
    setDetails(false);
    setDeletePro(false);
  }

  const handleDelete = (e) => {
    setSettType('delete');
    setAccess(false);
    setDetails(false);
    setDeletePro(true);
  }

  return (
    <div className='Psetting_main'>
      <div className='Psetting_main_navbar'>
        <p className='pn_path'>Projects / {currentProject.projectName} / Project Setting</p>
        <div className='Psetting_main_navbar_2'>
          <p className='pn_title'>Project Setting</p>
        </div>
      </div>
      <div className='Psetting_main_body'>
        <div className='Psetting_main_body_header'>
          <div className='Psetting_main_body_header_left'>
            <div className='Psetting_main_body_header_left_icon'>
              <img src='http://localhost:3000/static/media/soft.8a2b5ebd6b32f8c0f3242fc73fc17450.svg' alt='icon' />
            </div>
            {/* <div className='change_icon'>Change Icon</div> */}
          </div>
          <div className='Psetting_main_body_header_right'>
            <div className='Psetting_main_body_header_right_title'>
              <p>Project Name: </p>
              <input type='text' value={currentProject.projectName} disabled />
            </div>
            <div className='Psetting_main_body_header_right_leader'>
              <p>Project Lead: </p>
              <input type='text' value={currentProject.projectLead} disabled />
            </div>

          </div>
        </div>
        <div className='Psetting_main_otherSettings'>
          <div className='Psettubg_mos_nav'>
            <div className={access ? 'Psettubg_mos_nav_1 active' : 'Psettubg_mos_nav_1'} onClick={handleAccess}>
              <p>Access</p>
            </div>
            <div className={details ? 'Psettubg_mos_nav_2 active' : 'Psettubg_mos_nav_2'} onClick={handleDetails}>
              <p>Project Details</p>
            </div>

            <div className={deletePro ? 'Psettubg_mos_nav_4 active' : 'Psettubg_mos_nav_4'} onClick={handleDelete}>
              <p>Delete Project</p>
            </div>
          </div>
          <div className='Psetting_mos_body'>
            {settType === 'access' && <AccessSett currentProject={currentProject} />}
            {settType === 'details' && <ProDetails />}
            {settType === 'delete' && <DeletePro />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Psetting