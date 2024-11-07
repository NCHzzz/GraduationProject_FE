import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Notification = ({ onClose }) => {
  const { theme } = useSelector((state) => state.theme);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null); // State for selected notification

  const userId = 'e01278a2-c621-49a7-a9a8-993869dae05d'; // Example user ID

  // Fetch NotificationIds based on the userId
  useEffect(() => {
    const fetchNotificationIds = async () => {
      try {
        const notificationIdsResponse = await axios.get(`https://localhost:7200/api/Notification/user/${userId}`);
        const notificationsData = notificationIdsResponse.data; 
        // const notificationIds = notificationIdsResponse.data; // Assuming this returns an array of NotificationIds
        // // Now fetch details for each notification ID
        // const notificationsData = await Promise.all(
        //   notificationIds.map(async (notificationId) => {
        //     const notificationResponse = await axios.get(`https://localhost:7200/api/Notification/${notificationId}`);
        //     return notificationResponse.data;
        //   })
        // );

        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificationIds();
  }, []);

  // Handle notification click to view more details
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification); // Set the selected notification
  };

  // If a notification is selected, display its details
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
      {/* Close Button */}
      <button className='absolute top-5 right-5 text-lg' onClick={onClose}>
        &times; {/* Close Icon */}
      </button>
      <div className={`${theme === 'light' ? 'bg-white text-black border-black' : 'bg-black text-white border'} rounded-lg p-4 w-3/4 h-3/4 md:w-1/2 max-h-screen overflow-y-auto`}>
        {/* Title */}
        <h2 className='text-xl font-semibold mb-4'>Notifications</h2>

        {/* Display notifications */}
        <div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.notificationID}
                className={`${theme === 'light' ? 'text-black hover:bg-gray-300' : 'text-white hover:bg-gray-700'} mb-2 p-3 rounded-xl cursor-pointer`}
                onClick={() => handleNotificationClick(notification)}
              >
                <h3 className='text-lg font-semibold'>{notification.message}</h3>
                <p>{notification.message}</p>
                <p className='text-sm text-gray-500'>{notification.date}</p>
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
