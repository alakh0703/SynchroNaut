import React, { useEffect } from 'react';
import './AddTask.css';
import { useContext } from 'react';
import { TaskContext } from '../../../../Context/TaskProvider';
import { v4 as uuidv4 } from 'uuid';
import { ProjectContext } from '../../../../Context/ProjectProvider';
function AddTask(props) {
  const { dispatch } = useContext(TaskContext);
  const [members, setMembers] = React.useState([])
  const { state } = useContext(ProjectContext)
  const todoTitleRef = React.useRef();
  const todoDescRef = React.useRef();
  const todoAssignRef = React.useRef();

  const addTodoHandler = (e) => {
    e.preventDefault();

    const todoTitle = todoTitleRef.current.value;
    const todoDesc = todoDescRef.current.value;
    const todoAssign = todoAssignRef.current.value;
    if (todoTitle === '' || todoDesc === '' || todoAssign === 'Not Assigned') return alert('Please fill all the fields')
    console.log(todoTitle, todoDesc, todoAssign)
    const taskID = uuidv4();
    const assignToId = members.find(member => member.memberName === todoAssign).memberId
    const task =
    {
      taskId: taskID,
      title: todoTitle,
      description: todoDesc,
      assingedTo: todoAssign,
      assingedToID: assignToId
    }
    console.log("NEW TASK", task)
    dispatch({ type: 'ADD_TO_BACKLOG', payload: task })
    props.close()
  }

  useEffect(() => {
    const members = state.project.projectMembers;
    console.log(state.project.projectMembers)
    setMembers(members)
  }, [])
  return (
    <div className='addTask_main'>
      <form className='addtodoForm'>
        <input type='text' className='addTask_Title' placeholder='Title' ref={todoTitleRef} />
        <textarea className='addTask_desc' placeholder='Description' ref={todoDescRef} />
        <select className='addTask_assign2' ref={todoAssignRef}>
          <option value='Not Assigned'>Not Assigned</option>
          {members.map((member) => (
            <option value={member.memberName} id={member.memberId}>{member.memberName}</option>
          ))}

        </select>
        <button className='addTask_submit' onClick={addTodoHandler}>Add Task</button>
      </form>
    </div>
  )
}

export default AddTask