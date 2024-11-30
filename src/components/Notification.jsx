import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { jwtDecode } from "jwt-decode";

const Notification = ({ onClose }) => {
  const { theme } = useSelector((state) => state.theme);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.sub;
  } else {
    console.log('No token found!');
  }

  useEffect(() => {
    const fetchNotificationIds = async () => {
      try {
        const notificationIdsResponse = await api.get(`/api/Notification/user`,
          {
          headers: {
              Authorization: `Bearer ${token}`,
          }
          }
        );

        setNotifications(notificationIdsResponse.data);
        console.log('Notifications:', notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificationIds();
  }, []);
  
  // Handle notification click (mark as read)
   const handleNotificationClick = async (notificationID) => {
    try {
      const notificationResponse = await api.put(`/api/Notification/markAsRead/${notificationID}`,
        { isRead: true },
        {
        headers: {
          Authorization: `Bearer ${token}`,
        }
        }
      );
      
      
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const handleReadAll  = async () => {
    try {
      const notificationResponse = await api.put(`/api/Notification/markAllAsRead`,
        { isRead: true },
        {
        headers: {
          Authorization: `Bearer ${token}`,
        }
        }
      );
    
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };


  if (selectedNotification) {
    return (
      <div className="notification-detail">
        <h3>{selectedNotification.title}</h3>
        <p>{selectedNotification.message}</p>
        <p>{selectedNotification.date}</p>
        <button onClick={() => setSelectedNotification(null)}>Close</button>
      </div>
    );
  }


  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <button className='absolute top-5 right-5 text-lg' onClick={onClose}>
        &times; 
      </button>
      <div className={`${theme === 'light' ? 'bg-white text-black border-black' : 'bg-black text-white border'}  rounded-lg p-0 w-3/4 h-3/4 md:w-1/2 max-h-screen overflow-y-auto`}>
        <h2 className='text-xl font-semibold mb-4 p-4'>
          Notifications</h2>
        <div className='flex justify-end gap-2 mt-4 pr-4'>
        <button
          className="p-2 bg-customOrange text-white rounded hover:bg-orange-900"
          onClick={()=> handleReadAll()}>
          Read All
        </button>
        </div>

      
        <div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.notificationID}
                className={`${theme === 'light' ? 'text-black hover:bg-gray-300' : 'text-white hover:bg-gray-700'} flex mb-0 p-3 cursor-pointer border-b border-gray-700`}
                onClick={() => handleNotificationClick(notification.notificationID)}
              >
                <h3 className='text-lg font-semibold'>{notification.message}   </h3>
                {notification.isRead ? null : (
                    <p className="text-customOrange ">New</p> 
                  )}
                  {/* <p className='block text-sm text-gray-500'>post title</p> */}
              </div>
            ))
          ) : (
            <p className='text-sm text-gray-500'>No notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
