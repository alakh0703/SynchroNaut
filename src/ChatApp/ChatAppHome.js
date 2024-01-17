import React, { useEffect } from 'react';
import './ChatAppHome.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../Firebase';
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';


function ChatAppHome() {
  const [login, setLogin] = React.useState(true);
  const { state, dispatch } = useContext(AuthContext);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profilePic, setProfilePic] = useState('')

  const navigate = useNavigate();


  const signupPasswordRef = React.useRef(null);
  const signupConfirmPasswordRef = React.useRef(null);
  const loginPasswordRef = React.useRef(null);



  const switchForm = () => {
    setLogin((prevLogin) => !prevLogin);
  };



  const handleLogin = async () => {
    const password = loginPasswordRef.current.value;

    if (password === '') {
      alert('Password cannot be empty');
      return;
    }

    let res;

    try {
      res = await signInWithEmailAndPassword(auth, email, password);
      console.log(res)
      navigate('/vr/hangout');
    } catch (error) {
      console.log(error);
      if (error.message === 'Firebase: Error (auth/invalid-credential).') {
        alert('Invalid Credential. If you are a new user, please sign up first.')
      }

    }
  }
  const handleSignUp = async () => {
    const password = signupPasswordRef.current.value;
    const confirmPassword = signupConfirmPasswordRef.current.value;

    if (password === '' || confirmPassword === '') {
      alert('Password cannot be empty');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    let res; // Declare res outside the try block

    try {
      res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(await res.user, {
        displayName: name,
        photoURL: profilePic,
      });


      await setDoc(doc(db, 'users', state.user.userID), {
        uid: state.user.userID,
        name: name,
        email: email,
        profilePic: profilePic,
      });


      await setDoc(doc(db, "userChats", state.user.userID), {})



      navigate('/vr/hangout');


    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("You already have an account. Please login.")
        return
      }
      if (error.code === 'auth/weak-password') {
        alert("Password should be at least 6 characters")
        return
      }

      console.log(error.code);
    }


  };

  useEffect(() => {

    if (state.user) {
      setName(state.user.name)
      setEmail(state.user.email)
      setProfilePic(state.user.profilePic)
    }


  }, [state.user])


  return (
    <div className='chat_app_home_main'>
      <div className='chat_app_home_main_container'>
        <div className='chat_app_home_main_con_navbar'>
          <div
            className={!login ? 'chat_app_home_main_con_navbar_login' : 'chat_app_home_main_con_navbar_active'}
            onClick={() => setLogin(true)}
          >
            Login
          </div>
          <div
            className={login ? 'chat_app_home_main_con_navbar_signup' : 'chat_app_home_main_con_navbar_active'}
            onClick={() => setLogin(false)}
          >
            Sign Up
          </div>
        </div>

        <div className='chat_app_home_main_con_main'>
          {login ? (
            <div className='chat_app_home_main_con_main_login'>
              <input
                type='text'
                placeholder='Email'
                className='chat_app_home_main_con_main_login_email'
                value={email}
                disabled
              />
              <input
                type='password'
                placeholder='Password'
                className='chat_app_home_main_con_main_login_password'
                ref={loginPasswordRef}
              />
              <button className='chat_app_home_main_con_main_button' onClick={handleLogin}>
                Login
              </button>
            </div>
          ) : (
            <div className='chat_app_home_main_con_main_signup'>
              <input
                type='text'
                placeholder='Email'
                className='chat_app_home_main_con_main_signup_email'

                value={email}
                disabled

              />
              <input
                type='password'
                placeholder='Password'
                className='chat_app_home_main_con_main_signup_password'
                ref={signupPasswordRef}
              />
              <input
                type='password'
                placeholder='Confirm Password'
                className='chat_app_home_main_con_main_signup_confirm_password'
                ref={signupConfirmPasswordRef}
              />
              <button className='chat_app_home_main_con_main_button' onClick={handleSignUp}>
                Start Chatting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatAppHome;
