import Navbar from '../Main_Components/Navbar';
import Main from '../Main_Components/Main';
import CreateProject from '../Main_Components/CreateProject';
import './Home.css'
import { Routes } from 'react-router-dom';
import MProject from './MProject';
import { Route } from 'react-router-dom';
import Login from '../Main_Components/Login/Login';
import AccountSettings from '../Main_Components/AccountSettings';
import TaskManager from '../Main_Components/TaskManager/TaskManager';
import ProjectProvider from '../Context/ProjectProvider'
import TaskProvider from '../Context/TaskProvider';
import { useState } from 'react';
import ChatAppHome from '../ChatApp/ChatAppHome';
import Hangout from '../ChatApp/Hangout';
import { ChatContextProvider } from '../Context/ChatProvider';

function Home() {

  const [firstTime, setFirstTime] = useState(false)

  return (
    <div className="App">
      <Navbar firstTime={firstTime} setFirstTime={setFirstTime} />

      <Routes>
        <Route path='/' element={<Login setFirstTime={setFirstTime} />} />
        <Route path='/vr' element={<Main />} />
        <Route path='/vr/viewProject/:id' element={<ProjectProvider><TaskProvider><MProject /></TaskProvider></ProjectProvider>} />
        <Route path='/vr/hangout-login' element={<ChatAppHome />} />
        <Route path='/vr/hangout' element={<ChatContextProvider><Hangout /></ChatContextProvider>} />
        <Route path='/vr/createProject' element={<CreateProject />} />
        <Route path='/vr/accountSettings' element={<AccountSettings />} />
        <Route path='/vr/taskManager' element={<TaskManager />} />
      </Routes>
    </div>
  );
}

export default Home;
