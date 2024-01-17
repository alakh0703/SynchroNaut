import axios from 'axios';
import React, { createContext, useReducer, useEffect } from 'react';



export const AuthContext = createContext();
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};


const updateUserFromDB = async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const userID2 = JSON.parse(localStorage.getItem("user")).userID;

  const res = await axios.get(`https://synchronaut-backend.onrender.com/api/user/refreshUser`, {
    params: {
      userID: userID2,
      token: token
    }
  });


  if (res.status === 200) {

    const user = res.data.user
    const user2 = {
      name: user.name,
      email: user.email,
      userID: user.userID,
      projects: user.projects,
      invites: user.invites,
      profilePic: user.profilePic
    }

    // update local storage
    localStorage.setItem("user", JSON.stringify(user2));
    // refresh the window
    window.location.href = "/vr";


  }
  else {
    alert("Something went wrong while refreshing user from DB")
  }
}
const updateProfilePic = async (url) => {
  // update the profile pic url
  const userID2 = JSON.parse(localStorage.getItem("user")).userID;
  const res = await axios.post("https://synchronaut-backend.onrender.com/api/user/updateProfilePic", { downloadURL: url, userID: userID2 })

  if (res.status === 200) {
    updateUserFromDB()
  }
}


const reducer = (state, action) => {

  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case "UPDATE_PROJECTS":
      const projects = state.user.projects
      projects.push(action.payload.projects)
      const user = state.user
      user.projects = projects
      localStorage.setItem("user", JSON.stringify(user));
      return {
        ...state,
        user: user
      }
    case "UPDATE_LOCALSTORAGE_USER_FROM_DB":
      updateUserFromDB()
      return {
        ...state
      }
    case 'DELETE_ONE_PROJECT':
      const projectss = state.user.projects

      const projectID = action.payload.projectID
      const updatedProjects = projectss.filter(project => project.id !== projectID)
      const user2 = state.user
      user2.projects = updatedProjects
      localStorage.setItem("user", JSON.stringify(user2));
      window.location.href = "/vr";
      return {
        ...state,
        user: user2
      }


    case "UPDATE_PROFILE_PIC":
      updateProfilePic(action.payload)
      return {
        ...state
      }

    case "LOGOUT":
      localStorage.clear();
      //reload the page

      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      };

    default:
      return state;
  }
};
function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("token"));

    if (user) {
      refreshUser(user.userID)
    }
    if (user && token) {
      dispatch({
        type: "LOGIN",
        payload: {
          user: user,
          token: token
        },
      });
    }
    else {
      dispatch({
        type: "LOGOUT",
      });
    }

  }, [])

  const refreshUser = async (userId) => {
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const res = await axios.get(`https://synchronaut-backend.onrender.com/api/user/refreshUser`, {
        params: {
          userID: userId,
          token: token
        }
      });
      const user = res.data.user
      dispatch({
        type: "LOGIN",
        payload: {
          user: user,
          token: JSON.parse(localStorage.getItem("token"))
        },
      });
    }
    catch (err) {
      alert("Your Session Expired. Please Login Again")
      dispatch({
        type: "LOGOUT",
      });

      window.location.href = "/";
    }


  }


  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}


export default AuthProvider;