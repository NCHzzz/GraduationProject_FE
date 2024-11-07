import { Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import CreatePost from './CreatePost'; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'; 
import { Logout } from "../redux/userSlice";
import { Bell } from 'lucide-react';
import { logo_without_background } from "../assets"; // Ensure your logo path is correct
import { BsMoon, BsSunFill } from "react-icons/bs";
import { SetTheme } from "../redux/theme";
import SearchComponent from "./SearchComponent";
import Notification from './Notification';

const LeftSideBar = ({ user }) => {
    const [open, setOpen] = useState(false);
    const { user: data, edit } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const handleTheme = () => {
        const themeValue = theme === "light" ? "dark" : "light";
        dispatch(SetTheme(themeValue));
    };

    const sidebarHandler = (itemText) => {
        if (itemText === "Create") {
            setOpen(true);
        } else if (itemText === "Profile") {
            navigate(`/profile`);
        } else if (itemText === "Logout") {
            dispatch(Logout());
            navigate("/login");
        } else if (itemText === "Home") {
            navigate("/");
        } else if (itemText === "Search") {
            setSearchOpen((prev) => !prev);
        } else if (itemText === "Explore") {
            // Handle explore
        } else if (itemText === "Notifications") {
            setNotificationOpen((prev) => !prev);
        } else if (itemText === "Theme") {
            handleTheme();
        } 
    };

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Following" },
        // { icon: <MessageCircle />, text: "Messages" },
        { icon: <Bell />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage 
                        alt={user?.firstName} 
                        src={user?.profileUrl}
                    />
                    <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: theme === "light" ? <BsMoon /> : <BsSunFill />, text: "Theme" },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r w-[17%] h-screen'>
            <div className="flex items-center justify-center my-4" onClick={() => navigate("/")}>
                <img src={logo_without_background} alt="Logo" className="h-12 w-auto" />
            </div>

            <div className='flex flex-col'>
                <div>
                    {sidebarItems.map((item, index) => (
                        <div
                            key={index}
                            className={`${theme === "light" ? "bg-white text-black border-black hover:bg-gray-300 " : "bg-black text-white hover:bg-gray-600 "} flex items-center gap-3 relative cursor-pointer rounded-lg p-3 my-3`}
                            onClick={() => sidebarHandler(item.text)} 
                        >
                            <div className='flex justify-center items-center'>
                                {item.icon}
                            </div>
                            <div className="">
                                <span>{item.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {open && <CreatePost open={open} setOpen={setOpen} />}
            {searchOpen && <SearchComponent onClose={() => setSearchOpen(false)} />} 
            {notificationOpen && <Notification onClose={() => setNotificationOpen(false)} />}
        </div>
    );
};

export default LeftSideBar;
