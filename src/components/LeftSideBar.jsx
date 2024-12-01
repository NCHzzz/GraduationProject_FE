import { Home, LogOut, PlusSquare, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'; 
import { Logout } from "../redux/userSlice";
import { Bell } from 'lucide-react';
import { text_logo_black, text_logo_white } from '../assets';
import { BsMoon, BsSunFill } from "react-icons/bs";
import { SetTheme } from "../redux/theme";
import { jwtDecode } from "jwt-decode";
import api from '../api';
import { scrollToTop } from "./Feed";
import signalRConnection from "../SignalRService";

const LeftSideBar = ({ feedRef }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);
    const [unreadCount, setUnreadCount] = useState(0);

    const handleHomeClick = () => {
        scrollToTop(feedRef);
        navigate("/home");
    };

    const reloadPage = () => {
        window.location.reload(); 
    };

    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    let userId = null;
    if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.sub;
    } else {
        console.log('No token found!');
    }

    // useEffect(() => {
    //     signalRConnection.on("UpdateNotificationCount", (unreadCount) => {
    //         if(userId){
    //             setUnreadCount(unreadCount);
    //         }
    //     });

    //     return () => {
    //         signalRConnection.off("UpdateNotificationCount");
    //     };
    // }, []);

    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const userResponse = await api.get(`/api/User/${userId}`,
        //         {
        //             headers: {
        //             Authorization: `Bearer ${token}`, 
        //             },
        //         }
        //         );
        //         const unreadCountResponse = await api.get(`/api/Notification/unreadCount`,
        //             {
        //                 headers: {
        //                 Authorization: `Bearer ${token}`, 
        //                 },
        //             }
        //         );
        //         setUser(userResponse.data);
        //         setUnreadCount(unreadCountResponse.data);
    
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };
        // fetchData();

        api
        .get(`/api/User/${userId}`, {headers: {Authorization: `Bearer ${token}`,},})
        .then((response) => {setUser(response.data);})
        .catch((error) => {console.error(error);});

        api
        .get(`/api/Notification/unreadCount`, {headers: {Authorization: `Bearer ${token}`,},})
        .then((response) => {setUnreadCount(response.data);})
        .catch((error) => {console.error(error);});

    }, [userId]);

    const handleTheme = () => {
        const themeValue = theme === "light" ? "dark" : "light";
        dispatch(SetTheme(themeValue));
    };

    const sidebarHandler = (itemText) => {
        if (itemText === "Create") {
            navigate("/create-post");
        } 
        else if (itemText === "Profile") {
            navigate("/profile");
        } 
        else if (itemText === "Logout") {
            dispatch(Logout());
            navigate("/login");
        } 
        else if (itemText === "Home") {
            handleHomeClick();
        } 
        else if (itemText === "Explore") {
            navigate("/explore");
        } 
        else if (itemText === "Notifications") {
            navigate("/notification");
        } 
        else if (itemText === "Theme") {
            handleTheme();
        } 
    };

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Explore" },
        { 
            icon: (
                <div className="relative">
                    <Bell />
                    {unreadCount > 0 && (
                        <span className="absolute bottom-4 left-4 inline-flex items-center justify-center text-xs font-bold leading-none w-4 h-4 text-red-100 bg-red-600 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
            ), 
            text: "Notifications" 
        },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    {user?.profilePictureURL ? (
                        <img
                        src={user.profilePictureURL}
                        alt='profile'
                        className="w-full h-auto"
                        />
                    ) : (
                        <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                    )}
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: theme === "light" ? <BsMoon /> : <BsSunFill />, text: "Theme" },
        { icon: <LogOut />, text: "Logout" },
    ];

    if (!token) {
        return null;
    }

    return (
        <div className='fixed sm:w-[17%] h-screen'>
            <div className="flex items-center justify-center mt-3 cursor-pointer" onClick={reloadPage}>
                <img src={theme === "light" ? text_logo_black : text_logo_white} alt="Logo" className="h-[80%] w-[80%]" />
            </div>
            <div className='flex flex-col '>
                <div>
                    {sidebarItems.map((item, index) => (
                        <div
                            key={index}
                            className={`${theme === "light" 
                                ? "bg-white text-black border-black hover:bg-gray-300 " 
                                : "bg-black text-white hover:bg-gray-600 "} 
                                flex items-center gap-3 relative cursor-pointer rounded-lg py-3 px-1 my-4 `}
                            onClick={() => sidebarHandler(item.text)} 
                        >
                            <div className='flex justify-center items-center'>
                                {item.icon}
                            </div>
                            <div className="hidden sm:block">
                                <span>{item.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeftSideBar;
