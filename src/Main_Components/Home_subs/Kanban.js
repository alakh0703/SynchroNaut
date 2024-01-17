import React, { useEffect } from 'react'
import './Kanban.css'
import Board from './Kanban_subs/Board';
import AddTask from './Kanban_subs/Task_Subs/AddTask';
import { ProjectContext } from '../../Context/ProjectProvider';
import deleteIcon from "../../Images/delete3.png"
import { TaskContext } from '../../Context/TaskProvider';


function Kanban(props) {
  const { state, dispatch } = React.useContext(ProjectContext);
  const { state: taskState, dispatch: taskDispatch } = React.useContext(TaskContext);
  const [authorized, setAuthorized] = React.useState(false);
  const [assigned2Me, setAssigned2Me] = React.useState(false);
  const [currentProject, setCurrentProject] = React.useState(props.currentProject);
  const [showAddTodoForm, setShowAddTodoForm] = React.useState(false)

  const toggleAddTodoForm = () => {
    setShowAddTodoForm(!showAddTodoForm)
  }
  const isAssigned2Me = () => {
    setAssigned2Me(!assigned2Me)
  }

  const deleteCompletedTask = () => {
    const answer = window.confirm("Are you sure you want to delete all completed task?");
    if (answer) {
      taskDispatch({ type: 'DELETE_ALL_COMPLETED_TASKS', payload: currentProject.projectID })
      alert("All completed task deleted");

    }
  }



  useEffect(() => {
    console.log("Kanban.js useEffect")
    const auth = props.isAuthorized;
    setAuthorized(auth);
  }, [props])



  const [path, setPath] = React.useState(`Projects /  ${currentProject.projectName}  / Kanban`)
  return (
    <div className='kanban'>
      <div className='kanban__header'>
        <p className='kh_path'>{path}</p>
        <h1 className='kh_title'>Kanban</h1>
        {authorized && <button className='kh_addTask' onClick={toggleAddTodoForm}>+</button>}

        <div className='filter_assignedToME'>
          <input type='checkbox' onChange={isAssigned2Me} className='kh_check' />
          <p>Assigned to Me</p>
        </div>
        {authorized && <div className='delete_doneTask'>
          <img className='deleteIcon' alt='deleteIcon' src={deleteIcon} title='Delete all completed task' onClick={deleteCompletedTask} />
        </div>}

        <Board assigned2Me={assigned2Me} projectID={state.project.projectID} />

      </div>
      {showAddTodoForm &&
        <div className='kanban__addNewTaskFormDiv'>
          <button onClick={toggleAddTodoForm}>Close</button>
          <AddTask close={toggleAddTodoForm} />
        </div>}
    </div>
  )
}

export default Kanban