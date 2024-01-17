import React, { useEffect } from 'react';
import './PTM_Main.css'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import deleteIcon from '../Images/delete3.png'

function PTM_Main() {
  const [selectedTask, setSelectedTask] = React.useState({
    pTaskId: '12',
    pTaskName: 'Season 7',
    pTaskDescription: 'Finish Season 7 dddddddddddf ewfwefew9 wfg we9 9gw  lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  })
  const [showSelectedTask, setShowSelectedTask] = React.useState(false)
  const todoRef = React.useRef(null)
  const todoDesRef = React.useRef(null)
  const [deletePopup, setDeletePopup] = React.useState(false)

  const [showAddTodo, setShowAddTodo] = React.useState(false)
  const [todo, setTodo] = React.useState([

  ])

  const [done, setDone] = React.useState([


  ])


  const move2done = async (id) => {
    const taskToMove = todo.find((task) => task.pTaskId === id);
    setTodo((prevTodo) => prevTodo.filter((task) => task.pTaskId !== id));
    setDone((prevDone) => [taskToMove, ...prevDone]);


    const user = localStorage.getItem('user')
    const userId = JSON.parse(user).userID

    const res = await axios.post(
      `https://synchronaut-backend.onrender.com/api/user/move2Completed`,
      { userId, taskId: id },

    );


  };

  const move2todo = async (id) => {
    const taskToMove = done.find((task) => task.pTaskId === id);
    setDone((prevDone) => prevDone.filter((task) => task.pTaskId !== id));
    setTodo((prevTodo) => [taskToMove, ...prevTodo]);

    const user = localStorage.getItem('user')
    const userId = JSON.parse(user).userID

    const res = await axios.post(`https://synchronaut-backend.onrender.com/api/user/move2Pending`, { userId, taskId: id })




  };
  const showAddTodoHandler = () => {
    setShowAddTodo(!showAddTodo)
  }
  const addTodoHandler = async () => {
    const todoTitle = todoRef.current.value;
    const todoDescription = todoDesRef.current.value;

    // Simple validation to check if the title is not blank
    if (todoTitle.trim() !== '') {
      const taskId = uuidv4();
      const newTodo = { pTaskId: taskId, pTaskName: todoTitle, pTaskDescription: todoDescription };
      setTodo((prevTodo) => [newTodo, ...prevTodo]);


      const user = localStorage.getItem('user')
      const userId = JSON.parse(user).userID
      const data = {
        pTaskId: taskId,
        pTaskName: todoTitle,
        pTaskDescription: todoDescription,
      }

      await axios.post(`https://synchronaut-backend.onrender.com/api/user/addPersonalTask`, { userId, data })

      todoRef.current.value = null;
      todoDesRef.current.value = null;

      setShowAddTodo(false);
    } else {
      alert('Please enter a valid todo title.');

      return
    }



  };


  useEffect(() => {
    const user = localStorage.getItem('user')
    const userId = JSON.parse(user).userID


    getAllPTasks(userId)



  }, [])


  const showDeletePopup = () => {
    setDeletePopup(!deletePopup)

  }

  const handleShowTask = (id) => {
    const task = todo.find((task) => task.pTaskId === id);
    setSelectedTask(task)
  }
  const showSelectedTaskHandler = (id) => {

    const task = todo.find((task) => task.pTaskId === id);
    const task2 = done.find((task) => task.pTaskId === id);
    if (task) {
      setSelectedTask(task)
    }
    if (task2) {
      setSelectedTask(task2)
    }



    setShowSelectedTask(true)
  }


  const handleDeleteTasks = async () => {
    const user = localStorage.getItem('user')
    const userId = JSON.parse(user).userID

    const res = await axios.post(`https://synchronaut-backend.onrender.com/api/user/deletePTask`, { userId: userId })


    setDone([])
    showDeletePopup()

  }

  const getAllPTasks = async (userId) => {
    const personalTasks = await axios.get(`https://synchronaut-backend.onrender.com/api/user/getPersonalTasks?userId=${userId}`,
    )
    console.log("PT: ", personalTasks)
    if (!personalTasks.data.personalTasks) {
      return
    }

    const personalTasks12 = personalTasks.data.personalTasks

    const todo = personalTasks12.filter((task) => task.pCompleted === false)
    const done = personalTasks12.filter((task) => task.pCompleted === true)
    setTodo(todo)
    setDone(done)
  }
  const hideSelectedTaskHandler = () => {
    setShowSelectedTask(false)
  }

  if (!todo) {
    return <div>Loading...</div>;
  }
  return (
    <div className='ptm_main'>
      {showSelectedTask &&
        <div className='ptm_main_selected_task'>
          <div className='ptm_main_selected_task_container'>
            <h2>{selectedTask.pTaskName}</h2>
            <p>{selectedTask.pTaskDescription}</p>
            <button className='ptm_main_selected_task_btn' onClick={hideSelectedTaskHandler}>Close</button>
          </div>

        </div>}
      {showAddTodo && (
        <div className='ptm_main_addTodo_container'>
          <div className='ptm_main_addTodo'>
            <input type='text' placeholder='Add Todo' className='add_todo_input_ptm' ref={todoRef} id='addTodoInput' />
            <textarea placeholder='Description' ref={todoDesRef} className='add_todo_input_desc_ptm' id='addTodoDescription' />
            <div className='bla_bla_bla_ptm'>
              <button className='add_todo_input_btn_ptm' onClick={addTodoHandler}>
                Add
              </button>
              <button className='add_todo_input_btn_ptm' onClick={showAddTodoHandler}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='ptm_main_container'>
        <div className='ptm_main_title'>
          <div className='ptm_main_title_addTodo' onClick={showAddTodoHandler}>
            +
          </div>
          <h1>Personal Task Manager</h1>
        </div>
        <div className='ptm_main_bottom'>
          <div className='ptm_main_todo'>
            <div className='ptm_main_todo_nav'>
              <h2>Todo</h2>
              <h4 className='ptm_main_count'>{todo.length}</h4>
            </div>
            <div className='ptm_main_todo_container'>
              {todo.map((item) => (
                <div className='ptm_main_todo_item' key={item.pTaskId} onClick={() => {
                  showSelectedTaskHandler(item.pTaskId)
                }
                }>
                  <h3>{item.pTaskName}</h3>
                  <button id={item.pTaskId} className='done_btn_todo' onClick={(e) => {
                    e.stopPropagation()
                    move2done(item.pTaskId)
                  }}>Done</button>
                </div>
              ))
              }
            </div>
          </div>
          <div className='ptm_main_done'>
            {deletePopup && <div className='ptm_delete_pop_up'>
              <p>Are you sure you want to delete all completed tasks?</p>
              <div className='ptm_delete_pop_up_btns'>
                <button className='ptm_delete_pop_up_btn1' onClick={handleDeleteTasks}>Yes</button>
                <button className='ptm_delete_pop_up_btn2' onClick={showDeletePopup}>No</button>
              </div>
            </div>}
            <div className='ptm_main_done_nav'>
              <h2>Done</h2>
              <img src={deleteIcon} onClick={showDeletePopup} title='Delete All Completed Tasks' className='delete_all_ctasks_ptm' alt='deleteicon' />
              <h4 className='ptm_main_count'> {done.length}</h4>

            </div>
            <div className='ptm_main_done_container'>
              {done.map((item) => (

                <div className='ptm_main_done_item' key={item.pTaskId} onClick={() => showSelectedTaskHandler(item.pTaskId)}>
                  <h3>{item.pTaskName}</h3>
                  <button className='res_btn_todo' onClick={(e) => {
                    e.stopPropagation()

                    move2todo(item.pTaskId)
                  }}>undo</button>

                </div>
              ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PTM_Main