import React, { useEffect } from 'react';
import "./Notifications.css"
import axios from 'axios';
import deleteIcon from "../../Images/delete3.png"

function Notifications({ toggle }) {
    const [notifications, setNotifications] = React.useState([])
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        const userId = user.userID
        const getNotifications = async () => {
            const response = await axios.get('https://synchronaut-backend.onrender.com/api/user/getNotifications/' + userId, { userId: userId })
            const notifications = response.data.notifications
            // reverse the array so the most recent notifications are at the top
            notifications.reverse()
            setNotifications(notifications)
        }
        getNotifications()
    }, [])



    const deleteAllNotifications = async () => {
        const answer = window.confirm("Are you sure you want to delete all notifications?");
        if (answer) {
            const user = JSON.parse(localStorage.getItem('user'))
            const userId = user.userID
            const response = await axios.delete('https://synchronaut-backend.onrender.com/api/user/deleteNotifications/' + userId, { userId: userId })
            setNotifications([])
            alert("All notifications deleted")
        }

    }

    return (
        <div className='notifications_main'>
            <div className='notifications_header'>
                <p>Notifications</p>
                <div className='notifications_header_item'>
                    <img className='deleteIcon' alt='deleteIcon' src={deleteIcon} title='Delete all notifications' onClick={deleteAllNotifications} />
                    <p className='cancel_noti' onClick={toggle}>X</p>
                </div>

            </div>
            <div className='notifications_body'>
                {/* <div className='notifications_body_item'>
                    <p>Notification 1</p>

                </div> */}
                {notifications.length === 0 && <div className='no_notis'>
                    <p>No notifications</p>
                </div>}
                {notifications.map((notification, index) => {
                    return (
                        <div className='notifications_body_item' key={index} id={notification.invite} >


                            <p>{notification.notification}</p>
                        </div>
                    )
                })
                }

            </div>
        </div>
    )
}

export default Notifications