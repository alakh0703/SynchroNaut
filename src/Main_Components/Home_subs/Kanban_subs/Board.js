import React, { useState, useContext, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { TaskContext } from "../../../Context/TaskProvider";
import axios from "axios";
import { useParams } from 'react-router-dom';

export default function KanbanBoard(props) {
  const { state, dispatch } = useContext(TaskContext);
  const [saved, setSaved] = useState(true);
  const { id } = useParams();

  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [inProgress, setInProgress] = useState([]);


  const populateTasks = () => {
    const tasks = state.tasks;
    setSaved(state.Saved);
    if (!tasks) return;
    setCompleted(tasks.completed);
    setIncomplete(tasks.backlog);
    setInProgress(tasks.inProgress);
  }

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return; // No valid destination

    if (destination.droppableId === source.droppableId) {
      // No need to update state if it's the same column
      return;
    }

    // Helper function to find a task by ID in the combined arrays
    const findTask = (id) => {
      return [...incomplete, ...completed, ...inProgress].find(
        (item) => item.taskId === id
      );
    };

    // Remove from source array
    const sourceArray = source.droppableId === "1" ? incomplete :
      source.droppableId === "2" ? completed : inProgress;

    const destinationArray = destination.droppableId === "1" ? incomplete :
      destination.droppableId === "2" ? completed : inProgress;

    const movedTask = findTask(draggableId);



    if (!movedTask) {
      alert("Task not found");
      return; // Task not found, don't proceed
    }
    // Remove the task from the source array
    const updatedSourceArray = sourceArray.filter((task) => task.id !== draggableId);

    // Add the task to the destination array
    const updatedDestinationArray = [...destinationArray, movedTask];

    // Update the state
    if (source.droppableId === "1" && destination.droppableId === "2") {
      dispatch({ type: "MOVE_TO_COMPLETED_FROM_BACKLOG", payload: movedTask })
    }
    else if (source.droppableId === "1" && destination.droppableId === "3") {
      dispatch({ type: "MOVE_TO_IN_PROGRESS", payload: movedTask })
    }
    else if (source.droppableId === "2" && destination.droppableId === "1") {
      dispatch({ type: "MOVE_TO_BACKLOG", payload: movedTask })
    }
    else if (source.droppableId === "2" && destination.droppableId === "3") {
      dispatch({ type: "MOVE_TO_IN_PROGRESS", payload: movedTask })
    }
    else if (source.droppableId === "3" && destination.droppableId === "1") {
      dispatch({ type: "MOVE_TO_BACKLOG", payload: movedTask })
    }
    else if (source.droppableId === "3" && destination.droppableId === "2") {
      dispatch({ type: "MOVE_TO_COMPLETED", payload: movedTask })
    }
    else {
      alert("Invalid move");
      return;
    }

    if (source.droppableId === "1") {
      setIncomplete(updatedSourceArray);
    } else if (source.droppableId === "2") {
      setCompleted(updatedSourceArray);
    } else {
      setInProgress(updatedSourceArray);
    }

    if (destination.droppableId === "1") {
      setIncomplete(updatedDestinationArray);
    } else if (destination.droppableId === "2") {
      setCompleted(updatedDestinationArray);
    } else {
      setInProgress(updatedDestinationArray);
    }


  }

  const handleSave = () => {


    dispatch({ type: "SAVE_TASKS" });
  }
  useEffect(() => {
    populateTasks();
    setSaved(state.Saved);

  }, [])


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const assigned2Me = props.assigned2Me;
    const userId = user.userID
    // filtering all task by checking my id in assignedTo array
    if (assigned2Me) {
      const filteredTasks = state.tasks.backlog.filter(task => task.assingedToID === (userId));
      setIncomplete(filteredTasks);

      const filteredTasks1 = state.tasks.inProgress.filter(task => task.assingedToID === (userId));
      setInProgress(filteredTasks1);

      const filteredTasks2 = state.tasks.completed.filter(task => task.assingedToID === (userId));
      setCompleted(filteredTasks2);



    }
    else {
      populateTasks();
    }
  }, [props.assigned2Me])

  const resetTask = () => {
    populateTasks();

  }
  useEffect(() => {
    getTaskFromDB();

  }, [])

  const getTaskFromDB = async () => {
    // const projectID = props.projectID;
    const projectID = id;
    // get id from params

    try {

      const res = await axios.get(`https://synchronaut-backend.onrender.com/api/project/getTasks?projectID=${projectID}`);

      if (res.status === 200) {
        const tasks = res.data;
        console.log("BHENCHOD:", res)
        dispatch({ type: "POPULATE_TASKS", payload: tasks });
      }
    }
    catch (error) {
      console.log(error)
    }

  }


  useEffect(() => {
    populateTasks();
  },
    [state])
  return (
    <>
      {!saved && <button onClick={handleSave}>Save</button>}<br /><br />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            marginTop: "40px",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Column title={"TO DO"} tasks={incomplete} id={"1"} />
          <Column title="In Progress" tasks={inProgress} id={"3"} />
          <Column title={"DONE"} tasks={completed} id={"2"} />
        </div>
      </DragDropContext>
    </>
  );
}
