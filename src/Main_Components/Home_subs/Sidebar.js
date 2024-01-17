import React from 'react';
import './Sidebar.css';
import softIcon from '../../Images/soft.svg'
import arrowIcon from '../../Images/next.png'
import kanbanIcon from '../../Images/task-list.png'
import memIcon from '../../Images/team.png'
import proIcon from '../../Images/folder.png'

function Sidebar(props) {

    const [toggleSidebar1, setToggleSidebar1] = React.useState(true)
    const [isK, setIsK] = React.useState(true)
    const [isM, setIsM] = React.useState(false)
    const [isS, setIsS] = React.useState(false)




    const currentProject = props.currentProject;
    const toggleSidebar = () => {
        setToggleSidebar1(!toggleSidebar1)
    }

    const handleKanban = () => {

        props.setActiveTab('kanban')
        setIsK(true)
        setIsM(false)
        setIsS(false)
    }
    const handleMembers = () => {
        props.setActiveTab('members')
        setIsK(false)
        setIsM(true)
        setIsS(false)

    }
    const handleSettings = () => {

        props.setActiveTab('project-settings')
        setIsK(false)
        setIsM(false)
        setIsS(true)
    }

    return (
        <div className={toggleSidebar1 ? 'sidebar' : 'sidebar_closed'}>
            <div className='sb_mainn'>
                <div className={toggleSidebar1 ? 'sidebar_nav' : 'sidebar_nav_closed'}>
                    <div className='sbn_main'>
                        <div className='sbn_main_left'>
                            <img src={softIcon} alt='' className='softicon' />
                        </div>
                        <div className='sbn_main_right'>
                            <p className='sbn_mr_p1'>{currentProject.projectName}</p>
                            <p className='sbn_mr_p2'>Managed by @{currentProject.projectLead}</p>
                        </div>
                    </div>

                </div>
                <div className={toggleSidebar1 ? 'sidebar_body' : 'sidebar_body_closed'}>
                    <div className={isK ? 'sb_kanban sb_tab activeT' : 'sb_kanban sb_tab'} onClick={handleKanban}>
                        <img src={kanbanIcon} alt='' className='kanbanicon' />
                        <p className='sb_kanban_p'>Kanban</p>
                    </div>
                    <div className={isM ? 'sb_members sb_tab activeT' : 'sb_members sb_tab'} onClick={handleMembers}>
                        <img src={memIcon} alt='' className='memicon' />
                        <p className='sb_members_p'>Members</p>
                    </div>
                    <hr className='hr1' />
                    <div className={isS ? 'sb_settings sb_tab activeT' : 'sb_settings sb_tab'} onClick={handleSettings}>
                        <img src={proIcon} alt='' className='proicon' />
                        <p className='sb_settings_p'>Project Settings</p>

                    </div>

                </div>
            </div>

            <div className='line'>
                <div className='line_arrow' onClick={toggleSidebar}>
                    <img src={arrowIcon} alt='' className={toggleSidebar1 ? 'arrowicon' : 'arrowicon2'} />
                </div>
            </div>
        </div>
    )
}

export default Sidebar