import React, { useEffect, useState } from 'react';
import './Hangout.css'
import ChatBox from './ChatBox';
import ChatBoxGroup from './ChatBoxGroup';
import { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';

import { db } from '../Firebase'
import { collection, query, where, getDoc, getDocs, setDoc, doc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { AuthContext } from '../Context/AuthProvider'

import { ChatContext } from '../Context/ChatProvider';

function Hangout() {
  const [fetched, setFetched] = useState(false);
  const { dispatch } = useContext(ChatContext)
  const [selected, setSelected] = useState(false)

  const { state } = useContext(AuthContext);
  const [currentGroupChatId, setCurrentGroupChatId] = useState('0')

  const [currentUser, setCurrentUser] = useState({});
  const [searchShow, setSearchShow] = useState(false)
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState({});


  const [currentActiveGroupId, setCurrentActiveGroupId] = React.useState('0')
  const [currentActiveChatId, setCurrentActiveChatId] = React.useState('0')
  const [isGroupChat, setIsGroupChat] = React.useState(true)

  const [groupList, setGroupList] = React.useState([
    {
      groupId: '1',
      groupName: 'Group 1',
      groupMembers: ['User 1', 'User 2', 'User 3'],
      lastMessage: 'fuck you',
      groupIcon: ''
    },
    {
      groupId: '2',
      groupName: 'Group 2',
      groupMembers: ['User 1', 'User 2', 'User 3'],
      lastMessage: 'bye',
      groupIcon: ''
    }
  ]);

  const [indChatList, setIndChatList] = useState([
    {
      userInfo: {
        uid: "1",
        displayName: "Alakh",
        displayImage: "ds"

      }
    },
    {
      userInfo: {
        uid: "1",
        displayName: "Alakh",
        displayImage: "ds",
        date: new Date()

      }
    }
  ])


  const toggleGroupChatFalse = () => {
    setIsGroupChat(false)
  }



  useEffect(() => {
    setFetched(false)
    console.log("third")
    if (state.user) {

      setCurrentUser(state.user);
    }
  }, [state.user]);

  useEffect(() => {
    console.log("second")
    if (currentUser && currentUser.userID) {
      const unsubscribe = onSnapshot(doc(db, "userChats", currentUser.userID), (doc) => {
        if (doc.exists()) {
          setIndChatList(Object.entries(doc.data()));
          //   alert(Object.entries(doc.data())[0][1].userInfo.uid)
          console.log("oh shit", doc.data());
          setFetched(true)
        } else {
          // Handle the case where the document doesn't exist
          console.log("Document does not exist");
        }
      }, (error) => {
        // Handle errors from the onSnapshot function
        alert("Error fetching document");
        console.error("ERROR ALAKH", error);
      });

      return () => {
        // Unsubscribe when the component unmounts or the dependency changes
        unsubscribe();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    getProjectsFromFirestore()

  }, [])

  const getProjectsFromFirestore = async () => {
    try {
      // Assuming state.user.userID contains the user's ID
      const userId = state.user.userID;

      // Fetch the user document from Firestore
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      // Check if the user document exists
      if (userDoc.exists()) {

        const projectsArray = userDoc.data().projects || [];

        setGroupList(projectsArray)

        // Return the projectsArray if needed
        return projectsArray;
      } else {
        console.log("User document not found");
        // Return an appropriate value or throw an error if needed
        return null;
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      // Handle the error as needed
      return null;
    }
  };


  // sign out firebase on unmount
  useEffect(() => {
    return () => {
      signOut(auth)
    }
  }, [])

  const handleSearch = async () => {

    try {
      const q = query(collection(db, "users"), where("email", "==", searchName));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        setSearchResult(doc.data())
        console.log(doc.data());

      }
      );

      setSearchShow(true)

    } catch (error) {
      console.log(error);
    }

  }

  const handleKeySearch = (e) => {
    if (e.key === 'Enter') {

      handleSearch()
    }
  }

  const handleCloseSearchResult = () => {
    setSearchShow(false)
    setSearchResult({})
  }
  const handleSelect = async () => {
    try {
      const combinedId = searchResult.uid + currentUser.userID;
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // Create new chat
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });

        // Create user chats
        const userInfoData = {
          uid: searchResult.uid,
          displayName: searchResult.name,
          displayImage: searchResult.profilePic,
        };
        const userInfoData2 = {
          uid: currentUser.userID,
          displayName: currentUser.name,
          displayImage: currentUser.profilePic,
        };


        const userChatsData = {
          [combinedId]: {
            userInfo: userInfoData,
            date: serverTimestamp(),
          },
        };

        const userChatsData2 = {
          [combinedId]: {
            userInfo: userInfoData2,
            date: serverTimestamp(),
          },
        };

        await setDoc(
          doc(db, "userChats", currentUser.userID),
          userChatsData,
          { merge: true }
        );

        await setDoc(
          doc(db, "userChats", searchResult.uid),
          userChatsData2,
          { merge: true }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectMain = (e) => {
    const chatId = e.currentTarget.id;

    // find user from indChatList
    const user = indChatList.find((item) => item[0] === chatId);
    dispatch({
      type: "CHANGE_USER",
      payload: user
    });

    setSelected(true)
  }


  return (
    <div className='hangout_main'>
      {fetched ? <div className='hangout_container'>
        <div className='hangout_left'>
          <div className='hangout_left_tabs'>

            <div className={isGroupChat ? 'hangout_left_tab_chats' : 'hangout_left_tab_chats hangout_left_tabs_active'} onClick={toggleGroupChatFalse}>
              <p>Chats</p>
            </div>
          </div>

          {indChatList && <div className='hangout_left_chats_list'>
            <div className='hangout_left_chats_list_search_bar'>
              <input type='text' placeholder='Search using email' className='hangout_left_chats_list_search_bar_input'
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={handleKeySearch}
              />
              {searchShow && <div className='hangout_left_chats_list_search_bar_searchResult'>
                {searchResult.name === undefined ? <p>No user found</p> :
                  <div className='hangout_left_chats_list_search_bar_searchResult_each' onClick={handleSelect}>
                    <div className='hangout_left_chats_list_search_bar_searchResult_each_left'>
                      <img src={searchResult.profilePic} alt='' />
                    </div>
                    <div className='hangout_left_chats_list_search_bar_searchResult_each_right'>
                      <p>{searchResult.name}</p>
                    </div>
                  </div>}

              </div>}
              {searchShow && <p className='close_searchResult' onClick={handleCloseSearchResult}>X</p>}
            </div>

            {indChatList.map((item) => (

              <div className='hangout_left_list_ind' key={item[1].userInfo.uid} id={item[0]} onClick={handleSelectMain}>
                <div className='hangout_left_list_ind_left'>

                  <img className='hangout_left_list_ind_left_img' src={item[1].userInfo.displayImage} alt='' />
                </div>
                <div className='hangout_left_list_ind_right'>
                  <div className='hangout_left_list_ind_right_top'>
                    <p>{item[1].userInfo.displayName}</p>
                    <p className='hangout_message_last_seen'>
                      {item[1].lastMessage?.messageText || "ok"}
                    </p>
                  </div>
                  {item.chatUnreadMessages > 0 ? <div className='hangout_left_list_ind_right_bottom'>
                    <p className='hangout_message_unread_mes'>{item.chatUnreadMessages}</p>
                  </div> :
                    <div className='hangout_left_list_ind_right_bottom'>
                    </div>
                  }
                </div>

              </div>
            ))}

          </div>}


        </div>
        <div className='hangout_right'>
          {indChatList && <ChatBox selected={selected} currentActiveChatId={currentActiveChatId} />}
        </div>
      </div> : <h1>Loading</h1>}
    </div>
  )
}

export default Hangout