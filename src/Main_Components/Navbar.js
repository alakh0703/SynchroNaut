import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { storage } from '../Firebase'
import { ref, getDownloadURL } from 'firebase/storage'
import ProfileDiv from './Navbar_subs/ProfileDiv';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import Invites from './Navbar_subs/Invites';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import InviteIcon from "../Images/letter.png"
import notiIcon from "../Images/notification.png"
import Notifications from './Navbar_subs/Notifications';

function Navbar(props) {
  const [showNotifications, setShowNotifications] = useState(false)

  if (props.firstTime === true) {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { element: '.navbar_center', popover: { title: 'Welcome to SynchroNaut', description: "Let's have a small walkthrough" } },

        { element: '#create_project_dj', popover: { title: 'Create Project', description: 'Click here to create a new project' } },
        { element: '.nav_right_profile', popover: { title: 'Profile', description: 'Click here to view your profile and perform other actions like Logout, Change Profile Picture and Change Password' } },
        { element: '#invites_dj', popover: { title: 'Invites', description: 'Click here to view the project you have been invited to' } },
        { element: '#notifications_dj', popover: { title: 'Notifications', description: 'Click here to view your notifications' } }

      ]
    });
    driverObj.drive();

    props.setFirstTime(false)
  }

  // Use destructuring to extract the state from the context.
  const { state } = useContext(AuthContext);
  const [newNoti, setNewNoti] = useState(false)
  const inviteRef = React.createRef();

  const [Image, setImage] = useState(null)
  const Navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileClick, setProfileClick] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const handleProfileClick = () => {
    setProfileClick(!profileClick);
  }

  const handleCreateProject = () => {
    Navigate('/vr/createProject');
  }

  const GoToDash = () => {
    Navigate('/vr');
  }

  const handleInviteClick = () => {
    setShowInvite(!showInvite);
  }

  // Simplify the authentication check.
  useEffect(() => {
    console.log("NAVBAR")
    setIsAuthenticated(state.isAuthenticated);

    const user = localStorage.getItem('user')
    if (!user) {
      return
    }
    const user10 = JSON.parse(user)

    const newNoti = user10.newNotifications
    setNewNoti(newNoti)
    if (!user) {

      return
    }
    const user2 = JSON.parse(user)
    const userID = user2.userID
    setImage(user2.profilePic)


  }, [state]);

  const toggleNoti = () => {
    setShowNotifications(!showNotifications)
    const user = JSON.parse(localStorage.getItem("user"));
    user.newNotifications = false
    localStorage.setItem("user", JSON.stringify(user));
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return
    }
    const newNoti = user.newNotifications
    setNewNoti(newNoti)
  }, [localStorage.getItem("user")])


  return (
    <div className='navbar'>
      <div className='navbar_left'>
        <div className='nav_left_invites'>
          {isAuthenticated &&
            <img src={InviteIcon} alt='Invites Icon' className='invite_icon'
              onClick={handleInviteClick} title='View Invites' id='invites_dj' />
          }
          {/* {isAuthenticated &&   <p  className='nav_li_btn' onClick={handleInviteClick} title='View Invites' id='invites_dj'>invites</p>} */}
          {showInvite && <Invites ref={inviteRef} />}
          {showNotifications && <Notifications toggle={toggleNoti} />}
          {isAuthenticated && <img src={notiIcon} alt="Notification Icon" className={newNoti ? 'notification_icon newNoti' : 'notification_icon'} title='View Notifications' id='notifications_dj' onClick={toggleNoti} />}
        </div>
      </div>
      <div className='navbar_center' onClick={GoToDash}>
        <p>SyncroNaut</p>
      </div>
      {isAuthenticated && (
        <div className='navbar_right' id='profile_dj'>
          <div className='nav_right_create' >
            <button id='create_project_dj' className='nav_right_create_button' title='Craete New Project' onClick={handleCreateProject}>Create Project</button>
          </div>
          <div className={profileClick ? 'nav_right_profile2' : 'nav_right_profile'} title='Profile' onClick={handleProfileClick}>
            {Image == null && <p>A</p>}
            {Image && <img className='nav_right_profile_pic' src={Image} alt='Profile' />}
          </div>
        </div>
      )}
      {profileClick && <ProfileDiv setProfileClick={setProfileClick} />}
    </div>
  );
}

export default Navbar;
