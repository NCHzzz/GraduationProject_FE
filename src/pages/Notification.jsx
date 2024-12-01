import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import LeftSideBar from "../components/LeftSideBar";
import Small_LeftSideBar from "../components/Small_LeftSideBar";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsPersonFillAdd } from "react-icons/bs";
import { suggest } from "../assets/data";
import signalRConnection from "../SignalRService";
import PostDetail from "../components/PostDetail";
import { set } from "react-hook-form";

const NotificationPopup = ({ message }) => {
  return (
      <div className="fixed top-4 right-4 bg-green-500 font-semibold text-white px-4 py-2 rounded shadow-lg z-50">
          <p>{message}</p>
      </div>
  );
};

const Notification = () => {
  const [suggestedFriends, setSuggestedFriends] = useState(suggest);
  const { theme } = useSelector((state) => state.theme);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationPost, setNotificationPost] = useState('');
  const [user, setUser] = useState('');
  const [selectedPost, setSelectedPost] = useState('');
  const [popupVisible, setPopupVisible] = useState(false); 

  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.sub;
  } else {
    console.log("No token found!");
  }

//   useEffect(() => {
//     signalRConnection.on("ReceiveNotification", (message) => {
//       setNotifications(prevNotifications => [...prevNotifications, message]);
//       console.log("Notification received:", message);
//   });
// }, []);

  // Fetch existing notifications
  useEffect(() => {
    api
      .get(`/api/User/${userId}`, {headers: {Authorization: `Bearer ${token}`,},})
      .then((response) => {setUser(response.data);})
      .catch((error) => {console.error(error);});
      
    const fetchNotifications = async () => {
      try {
        const notificationIdsResponse = await api.get(`/api/Notification/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotifications(notificationIdsResponse.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]);

  // Mark notification as read
  const handleNotificationClick = async (notificationID) => {
    try {
      await api.put(
        `/api/Notification/markAsRead/${notificationID}`,
        { isRead: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await api.get(`/api/Notification/${notificationID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const postResponse = await api.get(`/api/Post/${response.data.postID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedNotification(postResponse.data);
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // Mark all notifications as read
  const handleReadAll = async () => {
    try {
      await api.put(
        `/api/Notification/markAllAsRead`,
        { isRead: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPopupVisible(true);
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  if (selectedNotification) {
    return (
      <PostDetail
        post={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        user={user} // Replace with actual user data if available
      />
    );
  }

  if (!token) {
    return null;
}

  return (
    <>
      <div
        className={`w-full h-full px-0 lg:px-0 bg-bgColor ${
          theme === "light" ? "bg-white text-black" : "bg-black text-white"
        } lg:rounded-lg h-screen overflow-hidden `}
      >
        {popupVisible && (
                <NotificationPopup
                    message='You have read all notifications'
                    onClose={() => setPopupVisible(false)}/>)}
        <div className="w-full flex h-full">
          {/* LEFT */}
          <div className="hidden xs:w-[20%] px-4 h-full md:flex sm:hidden flex-col gap-6 overflow-x-auto items-center">
            <LeftSideBar />
          </div>
          <div className="flex w-[14%] md:hidden">
            <Small_LeftSideBar />
          </div>

          {/* CENTER */}
          <div className="w-full flex h-screen md:w-[60%] sm:w-[100%] border-l border-r border-l-gray-700 border-r-gray-700 flex-col gap-0 overflow-y-auto pt-4">
            <div className="flex p-3">
              <h2 className="text-xl font-semibold w-[85%]">Notifications</h2>
              <div className="justify-end w-[15%]">
                <button
                  className="p-1 px-2 bg-customOrange text-white font-semibold rounded hover:bg-orange-900"
                  onClick={handleReadAll}
                >
                  Read All
                </button>
              </div>
            </div>

            <div>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.notificationID}
                    className={`${
                      theme === "light"
                        ? "text-black hover:bg-gray-300"
                        : "text-white hover:bg-gray-700"
                    } flex mb-0 p-3 cursor-pointer border-b border-gray-700`}
                    onClick={() => handleNotificationClick(notification.notificationID)}
                  >
                    <h3 className="text-lg font-semibold">
                      {notification.message}
      
                    </h3>
                    {notification.isRead ? null : (
                      <p className="text-customOrange text-sm font-medium italic">New</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No notifications</p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden w-[30%] h-full lg:flex flex-col overflow-y-auto">
            <div
              className={`w-[90%] px-0 lg:px-2 mt-3 bg-bgColor ${
                theme === "light" ? "bg-white text-black" : "bg-black text-white"
              } lg:rounded-lg h-screen overflow-hidden `}
            >
              <div className="p-4 rounded-2xl my-4 border border-gray-700">
                <h1 className="font-bold text-lg">Who to follow</h1>
                <div className="w-full flex flex-col gap-4 pt-4">
                  {suggestedFriends?.map((friend) => (
                    <div
                      className="flex items-center justify-between"
                      key={friend._id}
                    >
                      <Link
                        to={"/profile/" + friend?._id}
                        key={friend?._id}
                        className="w-full flex gap-4 items-center cursor-pointer"
                      >
                        <img
                          src={friend?.profileUrl ?? NoProfile}
                          alt={friend?.firstName}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                        <div className="flex-1 ">
                          <p className="text-base font-medium text-ascent-1">
                            {friend?.firstName} {friend?.lastName}
                          </p>
                          <span className="text-sm text-ascent-2">
                            {friend?.profession ?? "No Profession"}
                          </span>
                        </div>
                      </Link>

                      <div className="flex gap-1">
                        <button
                          className="bg-customOrange text-sm text-white p-1 rounded hover:bg-white hover:text-customOrange"
                          onClick={() => {}}
                        >
                          <BsPersonFillAdd
                            size={20}
                            className="hover:bg-white"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
