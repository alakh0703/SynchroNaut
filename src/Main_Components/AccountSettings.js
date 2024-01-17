import React, { useState, useRef, useEffect } from 'react';

import app from '../Firebase'
import { storage } from '../Firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import './AccountSettings.css';
import axios from 'axios';
import olo from '../Images/brain.png'
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';

function AccountSettings() {
    const { state, dispatch } = useContext(AuthContext);
    const [showChangePass_POP, setShowChangePass_POP] = useState(false)
    const [Image, setImage] = useState(null)
    const [acc_sett_err, setAcc_sett_err] = useState('')
    const [settImage, setSetImage] = useState(false)
    const [user, setUser] = useState({})
    const oldPassRef = useRef()
    const newPassRef = useRef()
    const previewImg = useRef()
    const selectedImgRef = useRef()

    const showCP_POP = () => {
        setShowChangePass_POP(true)
    }

    const closeCP_POP = () => {
        setShowChangePass_POP(false)
    }

    const handleChangePass = async () => {
        const oldPassword = oldPassRef.current.value
        const newPassword = newPassRef.current.value

        if (oldPassword === '' || newPassword === '') {
            setAcc_sett_err('Please fill all the fields')
            return
        }
        if (oldPassword === newPassword) {
            setAcc_sett_err('Old and New Passwords are same')
            return
        }
        if (newPassword.length < 6) {
            setAcc_sett_err('Password must be atleast 6 characters long')
            return
        }
        setAcc_sett_err('')
        const token = localStorage.getItem('token')
        try {
            const res = await axios.post('https://synchronaut-backend.onrender.com/api/user/change-password', { oldPassword, newPassword, token })
            if (res.status === 200) {
                alert('Password Changed Successfully')
                oldPassRef.current.value = ''
                newPassRef.current.value = ''
                closeCP_POP()
                return
            }
            else if (res.status === 400) {
                setAcc_sett_err(res.data.message)
            }
            else {
                setAcc_sett_err(res.message)
                return
            }

        } catch (error) {
            setAcc_sett_err("Invalid Old Password")
        }


        // API call to change password

    }

    const handleImageUpload = async (e) => {

        const file = e.target.files[0];
        const src = URL.createObjectURL(file)
        setImage(src)
        if (Image === null) {
            return
        }
        previewImg.current.src = URL.createObjectURL(file)

        const imageName = file.name;

        await uploadImage(file, imageName);
    }
    const uploadImage = (file, imageName) => {
        const user = localStorage.getItem('user')
        const user2 = JSON.parse(user)
        const userID = user2.userID

        const imageRef = ref(storage, `profile-pics/${userID}`);

    };
    const uploadImageFinal = () => {
        const file = selectedImgRef.current.files[0];
        if (file === undefined) {
            return
        }
        const user = localStorage.getItem('user')

        const user2 = JSON.parse(user)
        const userID = user2.userID


        const imageRef = ref(storage, `profile-pics/${userID}`);
        uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(imageRef)
                .then((downloadURL) => {



                    dispatch(
                        {
                            type: "UPDATE_PROFILE_PIC",
                            payload: downloadURL
                        }
                    )
                    // Store the downloadURL in MongoDB or use it as needed
                })
                .catch((error) => {
                    console.error('Error getting download URL:', error);
                });
            alert('Profile Picture Changed Successfully')


        }
        );
        setSetImage(false)
    }

    const setImagePOP = () => {
        setSetImage(true)
    }
    const cancel_upload = () => {
        setSetImage(false)
        window.location.reload()
    }
    useEffect(() => {
        setAcc_sett_err('')

        const user = localStorage.getItem('user')
        const user2 = JSON.parse(user)
        setUser({
            name: user2.name,
            email: user2.email,
            dp: user2.profilePic
        })


        const userID = user2.userID
        setImage(user2.profilePic)

    }
        , [showChangePass_POP])

    return (
        <div className='acc_sett'>
            <div className='acc_sett_main'>
                <div className='acc_sett_main_head'>
                    <div className='acc_sett_main_head_left'>
                        <div className='acc_sett_main_head_left_circle'>
                            {Image === null && <p>A</p>}
                            {Image && <img className='acc_sett_profilePic' src={Image} alt='Profile' />}
                        </div>

                        <button className='acc_sett_main_head_left_btn' onClick={setImagePOP}>Change Profile Picture</button>
                        {settImage && <div className='acc_sett_main_head_left_upload'>

                            <div className='acc_sett_main_head_left_upload_main_1'>
                                <div className='acc_sett_main_head_left_upload_main'>
                                    <img className='acc_sett_previewImg' alt='Preview' ref={previewImg} src={Image} />
                                </div>
                                <input type="file" onChange={handleImageUpload} id="fileInput" accept="image/*" ref={selectedImgRef} />
                                <button className='acc_sett_final_upload' onClick={uploadImageFinal}>Upload</button>
                                <button className='acc_sett_final_upload' onClick={cancel_upload}>Cancel</button>

                            </div>
                        </div>}
                    </div>
                    <div className='acc_sett_main_head_right'>
                        <input className='acc_sett_main_head_right_name' disabled type='text' value={user.name} placeholder='Name' />
                        <input className='acc_sett_main_head_right_email' disabled type='text' value={user.email} placeholder='Email' />
                        <button className='acc_sett_main_head_right_changePass' onClick={showCP_POP}>Change Password</button>
                    </div>
                </div>
            </div>
            {showChangePass_POP && <div className='acc_sett_changePass_POP'>
                <div className='acc_sett_changePass_POP_main'>
                    <div className='acc_sett_changePass_POP_main_head'>
                        <input className='acc_sett_changePass_POP_main_head_oldPass' ref={oldPassRef} type='password' placeholder='Old Password' />
                        <input className='acc_sett_changePass_POP_main_head_newPass' ref={newPassRef} type='password' placeholder='New Password' />
                    </div>
                    <div className='acc_sett_changePass_POP_main_body'>
                        <button className='acc_sett_changePass_POP_main_body_cancelBtn' onClick={closeCP_POP}>Cancel</button>
                        <button className='acc_sett_changePass_POP_main_body_saveBtn' onClick={handleChangePass}>Change</button>
                    </div>
                    <p className='acc_sett_error'>{acc_sett_err}</p>
                </div>
            </div>}
        </div>
    )
}

export default AccountSettings