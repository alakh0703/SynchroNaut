import React, { useContext, useEffect, useState } from 'react';
import './ChatBox.css'
import photoIcon from '../Images/gallery.png'
import { ChatContext } from '../Context/ChatProvider';
import { Timestamp, arrayUnion, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { doc } from 'firebase/firestore';

import { v4 as uuid } from 'uuid';
import { AuthContext } from '../Context/AuthProvider';
import { ref, uploadBytesResumable } from '@firebase/storage';
import { storage } from '../Firebase';
import { getDownloadURL } from 'firebase/storage';


function ChatBox(props) {
  const selected = props.selected;
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const { data, dispatch } = useContext(ChatContext)
  const { state, dispatch: dispatch2 } = useContext(AuthContext)
  const [userTypedMessage, setUserTypedMessage] = useState('');
  const [user, setUser] = useState(data.user)
  const [chatId, setChatId] = useState(data.chatId)
  const [searchName, setSearchName] = useState('');
  const [File, setFile] = useState(null);
  const scrollView = React.createRef();
  const inputRef = React.createRef();

  const myId = '420'

  const cancelPreview = () => {
    setImageUploaded(false);
    setImagePreview(null);
    setFileName('');
    setFile(null);
  }
  const [indChatList, setIndChatList] = useState([
    {
      chatId: '1',
      chatODisplayName: 'Dhrumit Patel',
      chatOId: '420',
      chatLastMessage: 'ok',
      chatUnreadMessages: 0
    },
    {
      chatId: '2',
      chatODisplayName: 'Gitansh Mittal',
      chatOId: '370',
      chatLastMessage: 'hello',
      chatUnreadMessages: 0
    }
  ])


  const [messages, setMessages] = useState([
    {
      messageId: '1',
      messageChatId: '1',
      messageSenderId: '420',
      messageText: 'ok',
      messageTimestamp: '21:30',
      messageDate: '12/12/2020',
      messageRead: true,
      messageType: 'text', // Added to identify message type
    },
    {
      messageId: '2',
      messageChatId: '2',
      messageSenderId: '370',
      messageText: 'hello',
      messageTimestamp: '12:00',
      messageDate: '12/13/2020',
      messageRead: true,
      messageType: 'text', // Added to identify message type
    }
  ])


  useEffect(() => {
    // scrollView.current?.scrollIntoView({ behavior: 'smooth' });
    // scroll to bottom of div
    if (!selected) return;
    const element = document.getElementById("scroll2");
    element.scrollTop = element.scrollHeight;

  }, [messages]);
  useEffect(() => {
    // This will be called whenever currentActiveChatId changes
  }, [props.currentActiveChatId]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      console.log(file)
      setImagePreview(file);
      setImageUploaded(true);
      setFileName(file.name);

    }

  };

  const handleSubmit = async () => {
    const messageText = userTypedMessage;
    const now = new Date(); // Get the current date and time

    if (File) {
      const storageRef = ref(storage, `chatImages/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageRef, File).then(
        async (snapshot) => {
          await getDownloadURL(snapshot.ref).then(async (downloadURL) => {
            // await updateDoc(doc(db, "chats", data.chatId), {
            //   messages: arrayUnion({
            //     messageId: uuid(),
            //     messageText,
            //     senderId: state.user.userID,
            //     date: Timestamp.now(),
            //     img: downloadURL,
            //     messageType: 'image',
            //   }),
            // });
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                messageId: uuid(),
                messageText,
                senderId: state.user.userID,
                date: now.toISOString().split('T')[0], // Date in YYYY-MM-DD format
                messageTimestamp: now.toISOString().split('T')[1].substring(0, 5), // Time in HH:mm format
                img: downloadURL,
                messageType: 'image',
              }),
            });
          });
          cancelPreview()

        }
      )

      setUserTypedMessage('');


    } else {
      if (!messageText) return;

      await updateDoc(doc(db, "chats", data.chatId), {

        messages: arrayUnion({
          messageId: uuid(),
          messageText,
          senderId: state.user.userID,
          date: Timestamp.now(),
          messageTimestamp: now.toISOString().split('T')[1].substring(0, 5), // Time in HH:mm format

          messageType: 'text'
        }),
      });

      await updateDoc(doc(db, "userChats", state.user.userID), {

        [data.chatId + ".lastMessage"]: {
          messageText,

        },

        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user[1].userInfo.uid), {

        [data.chatId + ".lastMessage"]: {
          messageText,

        },

        [data.chatId + ".date"]: serverTimestamp(),
      });

      setUserTypedMessage('');

    }


    setFile(null);
    setUserTypedMessage('');
  }

  const renderMessagesByDate = () => {
    let currentDate = null;
    return messages.map((message) => {
      const showMessageDate = currentDate !== message.messageDate;
      currentDate = message.messageDate;

      return (
        <div key={message.messageId}>
          {showMessageDate && (
            <div className='date_divider'>{message.messageDate}</div>
          )}
          <div
            className={`message ${message.senderId === state.user.userID
              ? 'my_message'
              : 'other_message'
              }`}
          >
            {message.messageType === 'text' ? (
              <p>{message.messageText}</p>
            ) : (
              <div className='message_media_container'>
                <img src={message.img} className='message_media' alt='uploaded' />
                <p>{message.messageText}</p>
              </div>
            )}
            <span className='timestamp'>{message.messageTimestamp}</span>
          </div>
        </div>
      );
    });
  };


  // const renderMessagesByDate = () => {
  //   let currentDate = null;
  //   console.log("MESSAGES: ", messages)
  //   return messages.map((message) => {
  //     const showMessageDate = currentDate !== message.date;
  //     currentDate = message.date;

  //     return (
  //       <div key={message.messageId}>
  //         {showMessageDate && (
  //           <div className='date_divider'>{message.messageDate}</div>
  //         )}
  //         <div
  //           className={`message ${message.senderId === state.user.userID
  //             ? 'my_message'
  //             : 'other_message'
  //             }`}
  //         >
  //           {message.messageType === 'text' ? (
  //             <p>{message.messageText}</p>
  //           ) : (
  //             <div className='message_media_container'>
  //               <img src={message.img} className='message_media' alt='uploaded' />
  //               {/* <p className='download_text'>download</p> */}

  //               <p>{message.messageText}</p>
  //             </div>

  //           )}
  //           <span className='timestamp'>{message.messageTimestamp}</span>
  //           {/* {message.senderId === state.user.userID && (
  //             <span className={`status ${message.messageRead ? 'read' : 'unread'}`}>
  //               {message.messageRead ? 'Read' : 'Unread'}
  //             </span>
  //           )} */}
  //         </div>
  //       </div>
  //     );
  //   });
  // };


  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      console.log("Current data: ", doc.data());
      if (doc.exists()) {
        setMessages(doc.data().messages);
        const element = document.getElementById("scroll2");
        element.scrollTop = 0
      }
    });

    return unSub;
  }, [data.chatId]);

  return (
    <div className='chatbox_main'>
      {!selected && <div className='welcome'>Welcome to your Chats !</div>}
      {selected && <div className='chatbox_header'>
        <div className='chatbox_header_left'>
          <img src={data.user[1].userInfo.displayImage} className='chatbox_header_left_icon_image' alt='' />

        </div>
        <div className='chatbox_header_right'>
          {/* data.user.user[1].userInfo.displayName */}
          <p>{data.user[1].userInfo.displayName}</p>
        </div>


      </div>}
      {selected && <div className='chatbox_body' id='scroll2' ref={scrollView}>
        <div className='message_container'>
          {renderMessagesByDate()}
        </div>
      </div>}
      {imageUploaded && <div className='imagePreview'>
        <p>{fileName}</p>
        <p className='cancel_preview' onClick={cancelPreview}>X</p>
      </div>}

      {selected && <div className='chatbox_footer'>

        <label htmlFor='imageInput'>
          <img src={photoIcon} className='chatbox_footer_icon_image' alt='' />
        </label>
        <input
          id='imageInput'
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <input type='text' placeholder='Type a message' className='chatbox_footer_searchbox'
          value={userTypedMessage}
          onChange={(e) => setUserTypedMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }
          }
        />
        <button className='chatbox_footer_Sendbtn'

          onClick={handleSubmit}>Send</button>
      </div>}

    </div>
  );
}

export default ChatBox;
