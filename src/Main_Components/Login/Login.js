import React, { useEffect, useState, useContext } from 'react';
import './Login.css'; // Import your CSS file
import axios from "axios";
import { AuthContext } from '../../Context/AuthProvider';

import { v4 as uuvid } from "uuid";
import { useNavigate } from 'react-router-dom';


function Login(props) {
  const { dispatch } = useContext(AuthContext);
  const Navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const signUpInstead = () => {
    setShowLogin(!showLogin)
  }

  const loginInstead = () => {
    setShowLogin(!showLogin)
  }

  // login
  const [Lemail, setLemail] = useState('');
  const [password, setPassword] = useState('');
  //signup
  const [name, setName] = useState('');
  const [Semail, setSemail] = useState('');
  const [Spassword, setSpassword] = useState('');
  const [Spassword2, setSpassword2] = useState('');

  const setUser = (user) => {


    dispatch({
      type: "LOGIN",
      payload: user,
    });

    Navigate("/vr")
  };
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (Lemail && password) {
      const user = {
        email: Lemail,
        password: password,
      };

      try {
        const res = await axios.post("https://synchronaut-backend.onrender.com/api/user/login", user);

        if (res.data.code != '0') {
          alert(res.data.message)
          return
        }
        if (res.data.code == '1') {
          alert(res.data.message)
          return
        }
        if (res) {
          const user = {
            name: res.data.user.name,
            email: res.data.user.email,
            userID: res.data.user.userID,
            projects: res.data.user.projects,
            invites: res.data.user.invites,
            profilePic: res.data.user.profilePicture,
            newNotifications: res.data.user.newNotifications,
          }
          const token = res.data.token
          const payload = {
            user,
            token
          }
          setUser(payload)
          setLoading(false)
        }
      }
      catch (err) {
        alert("Account not found")
        setLoading(false)
      }

    }

  };

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true(
    try {
      if (name && Semail && Spassword && Spassword2) {
        if (Spassword === Spassword2) {

          const userID = uuvid()
          const user = {
            name,
            email: Semail,
            password: Spassword,
            userID
          }
          const res = await axios.post("https://synchronaut-backend.onrender.com/api/user/register", user);
          alert("User Created")

          if (res) {
            const user = {
              name: res.data.name,
              email: res.data.email,
              userID: res.data.userID,
              projects: res.data.projects,
              invites: res.data.invites,
              profilePic: res.data.profilePicture

            }
            const token = res.data.token
            const payload = {
              user,
              token
            }
            props.setFirstTime(true)
            setLoading(false)
            setUser(payload)
          }


        }
        else {
          alert("Passwords do not match")
          setLoading(false)
        }
      }

    }
    catch (err) {
      alert("Email already exists")
    setLoading(false)
    }
  };




  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("token"));

    if (user && token) {
      window.location.href = "/vr";
    }
  }, []);

  return (
    <>
      {showLogin ? <form className="login-container" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          className='input_l'
          value={Lemail}
          required
          onChange={(e) => setLemail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className='input_l'

          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='button_login' onClick={handleLogin}>{loading ? "verifying" : "Login"}</button>
        <p className='changeLoginType' onClick={signUpInstead}>Sign Up Instead</p>
      </form> :
        <form className="login-container" onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Name"
            className='input_l'

            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={Semail}
            className='input_l'
            onChange={(e) => setSemail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={Spassword}
            className='input_l'

            onChange={(e) => setSpassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className='input_l'

            value={Spassword2}
            onChange={(e) => setSpassword2(e.target.value)}
          />
          <button className='button_login' onClick={handleSignUp}>{loading ? "Creating your account" : "Create Account" }</button>
          <p className='changeLoginType' onClick={loginInstead}>Login Instead</p>
        </form>}
    </>
  );
}

export default Login;
