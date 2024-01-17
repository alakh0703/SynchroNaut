import React, { createContext, useReducer } from 'react';

// Initial state for the context
const initialState = {
  project: {
    projectID: "d10d0bd7-1188-4feb-8bdd-2ee922f05549",
    projectName: "SynchroNaut",
    projectDescription: "A project management tool for teams to collaborate and work together.",
    projectIcon: "brain",
    projectLead: "Alakh Patel",
    projectLeadId: "f26cfcc6-e96b-4f7e-a072-c2b68b70d936",
    projectInvitees: [
      "alakhhbn007@gmail.com"
    ],
    projectMembers: [
      {
        memberId: "f26cfcc6-e96b-4f7e-a072-c2b68b70d936",
        memberName: "Salman Khan",
        memberEmail: "salman@gmail.com",
        memberRole: "Admin",
        isProjectLead: true,
        profilePic: "https://firebasestorage.googleapis.com/v0/b/synchronaut-images.appspot.com/o/profile-pics%2F9b0ea79a-4a64-4a7f-ba1c-dafab5cec074?alt=media&token=331a3694-d7e1-40fb-b00c-90c62519bc5f&_gl=1*5z70za*_ga*MTA0NzE0MzI0NC4xNjk3Njk3NDc2*_ga_CW55HF8NVT*MTY5Nzk5MDE4OS4yLjEuMTY5Nzk5MDM5NC41MC4wLjA.",

        _id: "652d4d189756489143e37c54"

      },
      {
        memberId: "f26cfcc6-e96b-4f7e-a072-c2b68b70d936",
        memberName: "Dhrumit Patel",
        memberEmail: "dhrumit.patel1677@gmail.com",
        memberRole: "member",
        isProjectLead: false,
        profilePic: "https://firebasestorage.googleapis.com/v0/b/synchronaut-images.appspot.com/o/profile-pics%2F32afc6f9-3e31-470f-ac2b-0876b85ce1ef?alt=media&token=0f0bab4b-6c90-42a3-a48c-53d55e92ba51&_gl=1*1rqsj7j*_ga*MTA0NzE0MzI0NC4xNjk3Njk3NDc2*_ga_CW55HF8NVT*MTY5NzY5NzQ3Ni4xLjEuMTY5NzY5NzQ5NS40MS4wLjA.",
        _id: "652d4d189756489143e37c54"
      }
    ],
  },
  tasks: {
    projectID: "d10d0bd7-1188-4feb-8bdd-2ee922f05549",
    backlog: [],
    inProgress: [],
    completed: [],

  }
};

// Create the context
export const ProjectContext = createContext();

// Define the reducer function
const projectReducer = (state, action) => {
  switch (action.type) {
    // Define cases for actions if needed
    case 'SET_PROJECT':
      // set the project id in local storage
      localStorage.setItem('projectId', action.payload.projectID);
      return {
        ...state,
        project: action.payload
      };
    case 'UPDATE_ROLE':
      const { memberId, newRole } = action.payload;
      const newMembers = [...state.project.projectMembers];
      const memberIndex = newMembers.findIndex(member => member.memberId === memberId);
      newMembers[memberIndex].memberRole = newRole;

      return {
        ...state,
        project: {
          ...state.project,
          projectMembers: newMembers
        }
      };
    case 'DELETE_MEMBER':
      const memberID = action.payload;
      const newMembers1 = [...state.project.projectMembers];
      const memberIndex1 = newMembers1.findIndex(member => member.memberId === memberID);
      newMembers1.splice(memberIndex1, 1);
      return {
        ...state,
        project: {
          ...state.project,
          projectMembers: newMembers1
        }
      };


    default:
      return state;
  }
};

// Create the ProjectProvider component
const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;


