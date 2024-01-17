import React from 'react';
import './ProfileDiv.css';
// Images
import profileIcon from '../../Images/user.png'
import logoutIcon from '../../Images/power-off.png'
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../Firebase'
import { ref, getDownloadURL } from 'firebase/storage'

function ProfileDiv(props) {
    const { state, dispatch } = useContext(AuthContext);
    const [pic, setPic] = useState(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')
    const Navigate = useNavigate()
    const logout = () => {
        localStorage.clear()
        dispatch({
            type: "LOGOUT",
        });
        props.setProfileClick(false)
        Navigate("/")

    }

    const go2AccountSetting = () => {
        props.setProfileClick(false)
        Navigate("/vr/accountSettings")
    }

    useEffect(() => {
        const user = state.user

        if (!user) {
            window.location.href = "/"
            return
        }

        setName(user.name)
        setEmail(user.email)


        const user2 = localStorage.getItem('user')

        const user3 = JSON.parse(user2)
        const userID = user3.userID

        setImage(user3.profilePic)
        // const imageRef = ref(storage, `profile-pics/${userID}`);
        // getDownloadURL(imageRef)
        // .then((url) => {
        //   // Set the URL to your component's state
        //   setImage(url);
        // })
        // .catch((error) => {
        //   console.error('Error getting image download URL:', error);
        // });

    }
        , [])


    return (
        <div className='profile_div'>
            <div className='pd_nav'>
                <div className='pd_nav_left'>
                    <div className='pd_nav_left_circle'>
                        {image == null && <p>{name[0]}</p>}
                        {image && <img src={image} alt='profile' className='pd_nav_left_circle_img' />}
                    </div>
                </div>
                <div className='pd_nav_right'>
                    <p className='pd_nav_right_Name'>{name}</p>
                    <p className='pd_nav_right_Email'>{email}</p>
                </div>
            </div>
            <div className='pd_body'>
                <div className='pd_body_accountSettings' onClick={go2AccountSetting}>
                    <img src={profileIcon} alt='profileIcon' className='pba_picon' />
                    <p >Account Settings</p>
                </div>
                <div className='pb_body_log'>
                    <img src={logoutIcon} alt='logoutIcon' className='pbl_licon' />
                    <p onClick={logout}>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileDiv