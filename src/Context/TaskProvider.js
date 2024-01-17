import React, { createContext, useReducer } from 'react';

import axios from 'axios';
// Initial state for the context
const initialState = {
  tasks: {
    backlog: [],
    inProgress: [],
    completed: [],
  },
  Saved: true
};

// Create the context
export const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'POPULATE_TASKS':
      return {
        ...state,
        tasks: action.payload
      };


    case 'ADD_TO_BACKLOG':
      if (!state.tasks.backlog.includes(action.payload)) {
        console.log("fuk vfdniv")
        return {
          ...state,
          tasks: {
            ...state.tasks,
            backlog: [...state.tasks.backlog, action.payload],
          },
          Saved: false
        };
      }
      return state;

    case 'MOVE_TO_IN_PROGRESS':
      if (state.tasks.backlog.includes(action.payload)) {

        return {
          ...state,
          tasks: {
            ...state.tasks,
            backlog: state.tasks.backlog.filter(task => task !== action.payload),
            inProgress: [...state.tasks.inProgress, action.payload],
          },
          Saved: false

        };
      }
      if (state.tasks.completed.includes(action.payload)) {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            completed: state.tasks.completed.filter(task => task !== action.payload),
            inProgress: [...state.tasks.inProgress, action.payload],
          },
          Saved: false

        };
      }
      return state;

    case 'MOVE_TO_COMPLETED':
      if (state.tasks.inProgress.includes(action.payload)) {

        return {
          ...state,
          tasks: {
            ...state.tasks,
            inProgress: state.tasks.inProgress.filter(task => task !== action.payload),
            completed: [...state.tasks.completed, action.payload],
          },
          Saved: false

        };
      }
      return state;

    case 'MOVE_TO_BACKLOG':
      if (state.tasks.inProgress.includes(action.payload)) {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            inProgress: state.tasks.inProgress.filter(task => task !== action.payload),
            backlog: [...state.tasks.backlog, action.payload],
          },
          Saved: false

        };
      }
      if (state.tasks.completed.includes(action.payload)) {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            completed: state.tasks.completed.filter(task => task !== action.payload),
            backlog: [...state.tasks.backlog, action.payload],
          },
          Saved: false

        };
      }
      return state;

    case 'MOVE_TO_COMPLETED_FROM_BACKLOG':
      if (state.tasks.backlog.includes(action.payload)) {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            backlog: state.tasks.backlog.filter(task => task !== action.payload),
            completed: [...state.tasks.completed, action.payload],
          },
          Saved: false

        };
      }
      return state;

    case 'DELETE_TASK':
      const updatedBacklog = state.tasks.backlog.filter(task => task !== action.payload);
      const updatedInProgress = state.tasks.inProgress.filter(task => task !== action.payload);
      const updatedCompleted = state.tasks.completed.filter(task => task !== action.payload);
      return {
        ...state,
        tasks: {
          backlog: updatedBacklog,
          inProgress: updatedInProgress,
          completed: updatedCompleted,
        },
        Saved: false

      };
    case 'GET_TASK_FROM_DB':
      const tasks1 = getTaskFromDB();
      return {
        ...state,
        tasks: tasks1
      };
    case 'DELETE_ALL_COMPLETED_TASKS':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          completed: []
        },
        Saved: false
      }
    case 'SAVE_TASKS':

      const tasks = state.tasks;
      const projectId = localStorage.getItem('projectId');
      saveTasksToDB(projectId, tasks);



      return {
        ...state,
        Saved: true
      }

    default:
      return state;
  }
};



// Create the TaskProvider component
const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;


const saveTasksToDB = async (pro, tasks) => {
  const projectID = pro
  console.log("vdfvbd", tasks)
  const response = await axios.post('https://synchronaut-backend.onrender.com/api/project/saveTask', {
    projectID: projectID,
    tasks: tasks
  },
  );
  // console.log(response.data)
}


const getTaskFromDB = async () => {
  const projectID = localStorage.getItem('projectId');
  try {
    const res = await axios.get(`https://synchronaut-backend.onrender.com/api/project/getTasks?projectID=${projectID}`);
    console.log("fuck", res)
    if (res.status === 200) {
      const tasks = res.data.result;
      console.log("tasks", tasks)
      return tasks
    }
  }
  catch (error) {
    console.log(error)
  }

}
