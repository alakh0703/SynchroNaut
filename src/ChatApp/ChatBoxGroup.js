// ChatBoxGroup.js

import React, { useEffect, useState } from 'react';
import './ChatBoxGroup.css'; // Make sure to create ChatBoxGroup.css file for styling
import photoIcon from '../Images/gallery.png';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';

function ChatBoxGroup(props) {
  const [currentProject, setCurrentProject] = useState(props.currentProject)
  const inputRef = React.createRef();
  const fileInputRef = React.createRef();

  const groupId = props.currentGroupChatId

  const [messages, setMessages] = useState([
    {
      messageId: '1',
      messageGroupId: '123',
      messageSenderId: 'user1',
      messageSenderName: 'John',
      messageText: 'Hello, everyone!',
      messageTimestamp: '21:30',
      messageDate: '12/12/2020',
      messageRead: { user1: true, user2: false }, // Updated field to track who has read the message
      messageType: 'text',
    },
    {
      messageId: '2',
      messageGroupId: '123',
      messageSenderId: 'user2',
      messageSenderName: 'Alice',
      messageText: 'Hi John!',
      messageTimestamp: '12:00',
      messageDate: '12/13/2020',
      messageRead: { user1: true, user2: true }, // Updated field to track who has read the message
      messageType: 'text',
    },
  ]);
  const [selectedMessage, setSelectedMessage] = useState(null); // To keep track of the selected message

  useEffect(() => {
    const fetchProjectChat = async () => {
      try {
        const groupChatId = props.currentGroupChatId;
        const groupChatDocRef = doc(db, 'groupChat', groupChatId); // Assuming 'groupChat' is your collection name

        const groupChatDocSnap = await getDoc(groupChatDocRef);

        if (groupChatDocSnap.exists()) {
          const projectChatData = groupChatDocSnap.data();
          setCurrentProject(projectChatData);
        } else {
          console.error(`Group chat with ID ${groupChatId} does not exist.`);
        }
      } catch (error) {
        console.error('Error fetching project chat:', error);
      }
    };

    fetchProjectChat();
  }, [props.currentGroupChatId]);

  const handleShowReaders = (messageId) => {
    setSelectedMessage(messageId);
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
  };
  const handleRead = (messageId, userId) => {
    const updatedMessages = messages.map((message) => {
      if (message.messageId === messageId) {
        return {
          ...message,
          messageRead: {
            ...message.messageRead,
            [userId]: true, // Set the user as read
          },
        };
      }
      return message;
    });

    setMessages(updatedMessages);
  };
  const renderReadersList = () => {
    const selectedMsg = messages.find((msg) => msg.messageId === selectedMessage);
    if (!selectedMsg) return null;

    const readersList = Object.entries(selectedMsg.messageRead)
      .filter(([userId, hasRead]) => hasRead)
      .map(([userId]) => userId);

    return (
      <div className="readers-modal">
        <h3>Readers</h3>
        <ul>
          {readersList.map((userId) => (
            <li key={userId}>{userId}</li>
          ))}
        </ul>
        <button onClick={handleCloseModal}>Close</button>
      </div>
    );
  };
  const handleSubmit =async () => {
    const messageText = inputRef.current.value;
    const messageTimestamp = new Date().toLocaleTimeString();
    const messageDate = new Date().toLocaleDateString();
    const messageRead = { user1: false, user2: false }; // Initialize as unread for all users
    const messageSenderId = 'user1'; // For example, change this based on the sender
    const messageSenderName = 'John'; // Change this based on the sender
    const messageGroupId = groupId;

    const time = messageTimestamp.split(':');
    const hour = time[0];
    const minute = time[1];

    const messageTimestamp24 = `${hour}:${minute}`;

    const newMessage = {
      messageId: messages.length + 1,
      messageGroupId,
      messageSenderId,
      messageSenderName,
      messageText,
      messageTimestamp: messageTimestamp24,
      messageDate,
      messageRead,
      messageType: 'text',
    };
    // if(File){
    //   const storageRef = ref(storage, `chatImages/${uuid()}`);
    //   const uploadTask = uploadBytesResumable(storageRef, File).then(
    //   async  (snapshot)=>{
    //     await getDownloadURL(snapshot.ref).then(async (downloadURL) => {
    //       await updateDoc(doc(db, "chats", data.chatId), {
    //         messages: arrayUnion({
    //           messageId: uuid(),
    //           messageText,
    //           senderId: state.user.userID,
    //           date: Timestamp.now(),
    //           img: downloadURL,
    //           messageType: 'image',
    //         }),
    //       });
    //     });
          
    //     }
    //   )
     


    // }else {
    //   if (!messageText) return;

    //   await updateDoc(doc(db, "chats", data.chatId), {
        
    //     messages: arrayUnion({
    //       messageId: uuid(),
    //       messageText,
    //       senderId: state.user.userID,
    //       date: Timestamp.now(),
    //       messageType: 'text'
    //     }),
    //   });

    //   await updateDoc(doc(db, "userChats", state.user.userID), {

    //    [ data.chatId+ ".lastMessage"]: {
    //       messageText,
          
    //     },

    //     [data.chatId+ ".date"]: serverTimestamp(),
    //   });

    //   await updateDoc(doc(db, "userChats",data.user[1].userInfo.uid ), {

    //     [ data.chatId+ ".lastMessage"]: {
    //        messageText,
           
    //      },

    //      [data.chatId+ ".date"]: serverTimestamp(),
    //    });

    //   setUserTypedMessage('');

    // }


    // setFile(null);
    // const newMessages = [...messages, newMessage];
    // setMessages(newMessages);

    // inputRef.current.value = '';
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = () => {
    const fileInput = fileInputRef.current;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const messageTimestamp = new Date().toLocaleTimeString();
      const messageDate = new Date().toLocaleDateString();
      const messageRead = { user1: false, user2: false }; // Initialize as unread for all users
      const messageSenderId = 'user1'; // For example, change this based on the sender
      const messageSenderName = 'John'; // Change this based on the sender
      const messageGroupId = groupId;

      const time = messageTimestamp.split(':');
      const hour = time[0];
      const minute = time[1];

      const messageTimestamp24 = `${hour}:${minute}`;

      const newMessage = {
        messageId: messages.length + 1,
        messageGroupId,
        messageSenderId,
        messageSenderName,
        messageText: file.name,
        messageTimestamp: messageTimestamp24,
        messageDate,
        messageRead,
        messageType: 'file',
        file,
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);

      // Clear the file input after uploading
      fileInput.value = '';
    }
  };

  return (
    <div className='chatgroupbox_groupchat'>
      <div className='chatbox_header_groupchat'>
        {/* <p>{currentProject.chatName}</p> */}
      </div>
      <div className='chatbox_body_groupchat'>
        <div className='message_container_groupchat'>
          {messages.map((message) => (
            <div key={message.messageId} className={`message_group_groupchat ${message.messageSenderId === 'user1' ? 'my_message_groupchat' : 'other_message_groupchat'}`}>
              <p className='message_sender_name_groupchat'>{message.messageSenderName}</p>
              {message.messageType === 'text' ? (
                <p>{message.messageText}</p>
              ) : (
                <div>
                  <p>
                    <strong>File:</strong> {message.messageText}
                  </p>
                  <a href={URL.createObjectURL(message.file)} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </div>
              )}
              <span className='timestamp_groupchat'>{message.messageTimestamp}</span>
              {message.messageSenderId === 'user1' && (
                <span className={`status_groupchat ${message.messageRead.user1 ? 'read' : 'unread'}`} onClick={() => handleRead(message.messageId, 'user1')}>
                  {message.messageRead.user1 ? 'Read' : 'Unread'}
                </span>
              )}
              {message.messageSenderId === 'user2' && (
                <span className={`status_groupchat ${message.messageRead.user2 ? 'read' : 'unread'}`} onClick={() => handleRead(message.messageId, 'user2')}>
                  {message.messageRead.user2 ? 'Read' : 'Unread'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='chatbox_footer_groupchat'>
        <img src={photoIcon} className='chatbox_footer_icon_image_groupchat' alt=''  onClick={handleFileUpload}/>
        <input
          type='text'
          placeholder='Type a message'
          className='chatbox_footer_searchbox_groupchat'
          ref={inputRef}
        />
        <input type='file' ref={fileInputRef} onChange={handleFileInputChange} style={{ display: 'none' }} />
      
        <button className='chatbox_footer_Sendbtn_groupchat' onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBoxGroup;

// // ChatBoxGroup.js

// import React, { useEffect, useState } from 'react';
// import './ChatBoxGroup.css'; // Make sure to create ChatBoxGroup.css file for styling
// import photoIcon from '../Images/gallery.png';

// function ChatBoxGroup() {
//   const inputRef = React.createRef();
//   const fileInputRef = React.createRef();

//   const groupId = '123';

//   const [messages, setMessages] = useState([
//     {
//       messageId: '1',
//       messageGroupId: '123',
//       messageSenderId: 'user1',
//       messageSenderName: 'John',
//       messageText: 'Hello, everyone!',
//       messageTimestamp: '21:30',
//       messageDate: '12/12/2020',
//       messageRead: { user1: true, user2: false }, // Updated field to track who has read the message
//       messageType: 'text',
//     },
//     {
//       messageId: '2',
//       messageGroupId: '123',
//       messageSenderId: 'user2',
//       messageSenderName: 'Alice',
//       messageText: 'Hi John!',
//       messageTimestamp: '12:00',
//       messageDate: '12/13/2020',
//       messageRead: { user1: true, user2: true }, // Updated field to track who has read the message
//       messageType: 'text',
//     },
//   ]);
//   const [selectedMessage, setSelectedMessage] = useState(null); // To keep track of the selected message

//   useEffect(() => {
//     // This will be called whenever the component mounts or updates
//   }, []);

//   const handleShowReaders = (messageId) => {
//     setSelectedMessage(messageId);
//   };

//   const handleCloseModal = () => {
//     setSelectedMessage(null);
//   };
//   const handleRead = (messageId, userId) => {
//     const updatedMessages = messages.map((message) => {
//       if (message.messageId === messageId) {
//         return {
//           ...message,
//           messageRead: {
//             ...message.messageRead,
//             [userId]: true, // Set the user as read
//           },
//         };
//       }
//       return message;
//     });

//     setMessages(updatedMessages);
//   };
//   const renderReadersList = () => {
//     const selectedMsg = messages.find((msg) => msg.messageId === selectedMessage);
//     if (!selectedMsg) return null;
  
//     const readersList = Object.entries(selectedMsg.messageRead)
//       .filter(([userId, hasRead]) => hasRead)
//       .map(([userId]) => userId);
  
//     return (
//       <div className="readers-modal">
//         <h3>Readers</h3>
//         <ul>
//           {readersList.map((userId) => (
//             <li key={userId}>{userId}</li>
//           ))}
//         </ul>
//         <button onClick={handleCloseModal}>Close</button>
//       </div>
//     );
//   };
//   const handleSubmit = () => {
//     const messageText = inputRef.current.value;
//     const messageTimestamp = new Date().toLocaleTimeString();
//     const messageDate = new Date().toLocaleDateString();
//     const messageRead = { user1: false, user2: false }; // Initialize as unread for all users
//     const messageSenderId = 'user1'; // For example, change this based on the sender
//     const messageSenderName = 'John'; // Change this based on the sender
//     const messageGroupId = groupId;

//     const time = messageTimestamp.split(':');
//     const hour = time[0];
//     const minute = time[1];

//     const messageTimestamp24 = `${hour}:${minute}`;

//     const newMessage = {
//       messageId: messages.length + 1,
//       messageGroupId,
//       messageSenderId,
//       messageSenderName,
//       messageText,
//       messageTimestamp: messageTimestamp24,
//       messageDate,
//       messageRead,
//       messageType: 'text',
//     };

//     const newMessages = [...messages, newMessage];
//     setMessages(newMessages);

//     inputRef.current.value = '';
//   };

//   const handleFileUpload = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileInputChange = () => {
//     const fileInput = fileInputRef.current;

//     if (fileInput.files.length > 0) {
//       const file = fileInput.files[0];
//       const messageTimestamp = new Date().toLocaleTimeString();
//       const messageDate = new Date().toLocaleDateString();
//       const messageRead = { user1: false, user2: false }; // Initialize as unread for all users
//       const messageSenderId = 'user1'; // For example, change this based on the sender
//       const messageSenderName = 'John'; // Change this based on the sender
//       const messageGroupId = groupId;

//       const time = messageTimestamp.split(':');
//       const hour = time[0];
//       const minute = time[1];

//       const messageTimestamp24 = `${hour}:${minute}`;

//       const newMessage = {
//         messageId: messages.length + 1,
//         messageGroupId,
//         messageSenderId,
//         messageSenderName,
//         messageText: file.name,
//         messageTimestamp: messageTimestamp24,
//         messageDate,
//         messageRead,
//         messageType: 'file',
//         file,
//       };

//       const newMessages = [...messages, newMessage];
//       setMessages(newMessages);

//       // Clear the file input after uploading
//       fileInput.value = '';
//     }
//   };

 
//   return (
//     <div className='chatgroupbox_groupchat'>
//       <div className='chatbox_header_groupchat'>
//         <p>Group Name</p>
//       </div>
//       <div className='chatbox_body_groupchat'>
//         <div className='message_container_groupchat'>
//           {messages.map((message) => (
//             <div key={message.messageId} className={`message_group_groupchat ${message.messageSenderId === 'user1' ? 'my_message_groupchat' : 'other_message_groupchat'}`}>
//               <p className='message_sender_name_groupchat'>{message.messageSenderName}</p>
//               {message.messageType === 'text' ? (
//                 <p>
//                   {message.messageText}{' '}
//                   <span className="readers-link" onClick={() => handleShowReaders(message.messageId)}>
//                     (Readers)
//                   </span>
//                 </p>
//               ) : (
//                 <div>
//                   {/* ... (unchanged) */}
//                 </div>
//               )}
//               <span className='timestamp_groupchat'>{message.messageTimestamp}</span>
//               {message.messageSenderId === 'user1' && (
//                 <span className={`status_groupchat ${message.messageRead.user1 ? 'read' : 'unread'}`} onClick={() => handleRead(message.messageId, 'user1')}>
//                   {message.messageRead.user1 ? 'Read' : 'Unread'}
//                 </span>
//               )}
//               {message.messageSenderId === 'user2' && (
//                 <span className={`status_groupchat ${message.messageRead.user2 ? 'read' : 'unread'}`} onClick={() => handleRead(message.messageId, 'user2')}>
//                   {message.messageRead.user2 ? 'Read' : 'Unread'}
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className='chatbox_footer_groupchat'>
//         <img src={photoIcon} className='chatbox_footer_icon_image_groupchat' alt=''  onClick={handleFileUpload}/>
//         <input
//           type='text'
//           placeholder='Type a message'
//           className='chatbox_footer_searchbox_groupchat'
//           ref={inputRef}
//         />
//         <input type='file' ref={fileInputRef} onChange={handleFileInputChange} style={{ display: 'none' }} />
      
//         <button className='chatbox_footer_Sendbtn_groupchat' onClick={handleSubmit}>
//           Send
//         </button>
//       </div>
//       {selectedMessage && renderReadersList()}
//     </div>
//   );
// }
// export default ChatBoxGroup;
