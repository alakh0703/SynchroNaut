import {
    createContext,
    useContext,
    useReducer,
  } from "react";
  
  export const ChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
    const INITIAL_STATE = {
      chatId: "ce2378fc-e2ff-46de-b613-974d0f9caa55687f0a9a-9876-4157-a361-69aedcc604e5",
      user:  [
            "ce2378fc-e2ff-46de-b613-974d0f9caa55687f0a9a-9876-4157-a361-69aedcc604e5",
            {
                "userInfo": {
                    "uid": "ce2378fc-e2ff-46de-b613-974d0f9caa55",
                    "displayImage": "https://firebasestorage.googleapis.com/v0/b/synchronaut-images.appspot.com/o/profile-pics%2Fce2378fc-e2ff-46de-b613-974d0f9caa55?alt=media&token=78421210-d359-4d21-9eb8-c540c07ab7b1",
                    "displayName": "Alakh Patel"
                },
                "date": {
                    "seconds": 1701222778,
                    "nanoseconds": 115000000
                }
            }
        ],
    
    };
    
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":
            // alert(state.chatId)
            // alert(action.payload[0])

          return {
            user: action.payload,
            chatId: action.payload[0]
            //   currentUser.uid > action.payload.uid
            //     ? currentUser.uid + action.payload.uid
            //     : action.payload.uid + currentUser.uid,
          };
  
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  
    return (
      <ChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };