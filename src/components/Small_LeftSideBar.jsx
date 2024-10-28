import { Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import CreatePost from './CreatePost'; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'; 
import { Logout } from "../redux/userSlice";
import { Bell } from 'lucide-react';
import { BsMoon, BsSunFill } from "react-icons/bs";
import { SetTheme } from "../redux/theme";
import { logo_black, logo_white } from '../assets';

const Small_LeftSideBar = ({ user }) => {
    const [open, setOpen] = useState(false);
    const { user: data, edit } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);

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
            // Handle search
        } else if (itemText === "Explore") {
            // Handle explore
        } else if (itemText === "Notifications") {
            // Handle notifications
        } else if (itemText === "Theme") {
            handleTheme();
        } 
    };

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Following" },
        { icon: <MessageCircle />, text: "Messages" },
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
        <div className={`fixed top-0 z-10 left-0 px-2 border-r ${theme === "light" ? "border-gray-300" : "border-gray-700"} w-[12%] lg:w-[10%] h-screen bg-${theme === "light" ? "white" : "black"}`}>
            <div className="flex items-center justify-center my-4 cursor-pointer" onClick={() => navigate("/")}>
                <img src={theme === "light" ? logo_white : logo_black} alt="Logo" className="h-10 w-auto" />
            </div>

            <div className='flex flex-col items-center'>
                {sidebarItems.map((item, index) => (
                    <div
                        key={index}
                        className='flex items-center justify-center gap-1 hover:bg-gray-500 cursor-pointer rounded-lg p-3 my-3 w-full text-center'
                        onClick={() => sidebarHandler(item.text)}
                    >
                        <div className='flex justify-center items-center w-full'>
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>
            {open && <CreatePost open={open} setOpen={setOpen} />}
        </div>
    );
};

export default Small_LeftSideBar;
