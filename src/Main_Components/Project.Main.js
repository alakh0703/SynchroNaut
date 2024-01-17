import React from 'react';
import './Project.Main.css';
import p1 from '../Images/p1.avif'

function Project(props) {
  return (
    <div className='projectm_main'>
    
      <div className='projectm_main_main'>
      <div className='project_main_info'>
         <h3  style={{textDecoration: 'none'}}>{props.name}</h3>
         <p>Managed by @{props.admin}</p>
      </div>
          <div className='pmm_profile'>
            <img src={p1} alt='' className='pmm_img'/>
          </div>
          <h3 className='pmm_h3c'>{props.name}</h3>

      </div>
    </div>
  )
}

export default Project