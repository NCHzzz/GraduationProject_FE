import React, { useEffect } from 'react'
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NoProfile } from "../assets";
import { BsPersonFillAdd } from "react-icons/bs";
import { useState } from "react";
import { useSelector } from "react-redux";
import SearchComponent from './SearchComponent';
import api from '../api';

const RightSidebar = ({ otherUsers }) => {
    const { theme } = useSelector((state)=> state.theme);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestUser, setSuggestUser] = useState([]);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); 
    const [isFollowing, setIsFollowing] = useState(false);
    
    const handleSearchClick = () => {
        setIsSearchVisible(true);
        
    };

    const handleOutsideClick = () => {
        setIsSearchVisible(false);
    };

    const handleSearch = (event) => {
      setSearchQuery(event.target.value);
    };

    useEffect(() => {
        api
          .get(`/api/User`, {headers: {Authorization: `Bearer ${token}`,},})
          .then((response) => {
              const users = response.data.filter(user => user._id !== userId); // Filter out the user's own profile
              const checkFollowStatus = users.map(user => 
                api.get(`/api/Follow/isFollowing?FollowUserId=${user._id}`, {headers: {Authorization: `Bearer ${token}`,}})
                  .then(res => ({...user, isFollowing: res.data}))
              );
              Promise.all(checkFollowStatus).then(results => {
                const notFollowingUsers = results.filter(user => !user.isFollowing);
                setSuggestUser(notFollowingUsers);
              });
          })
          .catch((error) => {console.error(error);});
    }, []);

    if (!token) {
      return null;
  }

  return (
    <div className={`w-[90%] px-0 lg:px-2 mt-3 bg-bgColor mb-2 ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}  lg:rounded-lg h-screen overflow-hidden hidden lg:block`}>
      <div onClick={handleSearchClick} className={`${theme === "light" ? "bg-white text-black border border-gray-800" : "bg-gray-700 text-white"} flex items-center p-2 rounded-full outline-none w-full`}>
        <Search size="20px" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
          className="bg-transparent outline-none px-2"
        />

      </div>
      {isSearchVisible && <SearchComponent onClose={handleOutsideClick} searchInput={searchQuery} />}
      <div className='p-4 rounded-2xl my-4 border border-gray-700'>
        <h1 className='font-bold text-lg'>Who to follow</h1>
        <div className='w-full flex flex-col gap-4 pt-4'>
  {suggestUser
    .filter((user) => !user.isFollowing) // Ensure only users who are not followed are displayed
    .slice(0, 3) // Limit the display to the first 3 users
    .map((suggestUser, index) => (
      <div className='flex items-center justify-between' key={index}>
        <Link
          to={"/profile/" + suggestUser._id}
          className='w-full flex gap-4 items-center cursor-pointer'
        >
          <img
            src={suggestUser?.profilePictureURL ?? NoProfile}
            alt={suggestUser?.userName}
            className='w-10 h-10 object-cover rounded-full'
          />
          <div className='flex-1 '>
            <p className='text-base font-medium text-ascent-1'>
              {suggestUser?.userName}
            </p>
          </div>
        </Link>

        <div className='flex gap-1'>
          <button
            className='bg-customOrange text-sm text-white p-1 rounded hover:bg-white hover:text-customOrange'
            onClick={() => {}}
          >
            <BsPersonFillAdd size={20} className='hover:bg-white' />
          </button>
        </div>
      </div>
    ))}
</div>

      </div>
      {/* Footer Section */}
      <div className={`p-4 mt-4 text-sm ${theme === "light" ? "text-black" : "text-white"} border-t border-gray-700`}>
        <ul className="flex justify-center">
            <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/cookie-policy" className="hover:underline">Cookie Policy</Link></li>
            <li><Link to="/accessibility" className="hover:underline">Access Terms</Link></li>
            <li><Link to="/ads-info" className="hover:underline">Ads Info</Link></li>
        </ul>
        <p className="text-center mt-4 text-xs">© 2024 Revu Corp.</p>
    </div>

    </div>
  )
}

export default RightSidebar;

{/* <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto mt-10'>
  
  <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5 border'>
    <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
      <span> Friend Request</span>
      <span>{friendRequest?.length}</span>
    </div>

    <div className='w-full flex flex-col gap-4 pt-4'>
      {friendRequest?.map(({ _id, requestFrom: from }) => (
        <div key={_id} className='flex items-center justify-between'>
          <Link
            to={"/profile/" + from._id}
            className='w-full flex gap-4 items-center cursor-pointer'
          >
            <img
              src={from?.profileUrl ?? NoProfile}
              alt={from?.firstName}
              className='w-10 h-10 object-cover rounded-full'
            />
            <div className='flex-1'>
              <p className='text-base font-medium text-ascent-1'>
                {from?.firstName} {from?.lastName}
              </p>
              <span className='text-sm text-ascent-2'>
                {from?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>

          <div className='flex gap-1'>
            <CustomButton
              title='Accept'
              containerStyles='bg-customOrange text-xs text-white px-1.5 py-1 rounded-full font-medium hover:bg-white hover:text-customOrange'
            />
            <CustomButton
              title='Deny'
              containerStyles='border border-black text-xs text-ascent-1 px-1.5 py-1 rounded-full font-medium hover:bg-#66666645 hover:text-customOrange'
            />
          </div>
        </div>
      ))}
    </div>
  </div>

  <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5 border'>
    <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
      <span>Friend Suggestion</span>
    </div>
    <div className='w-full flex flex-col gap-4 pt-4'>
      {suggestedFriends?.map((friend) => (
        <div
          className='flex items-center justify-between'
          key={friend._id}
        >
          <Link
            to={"/profile/" + friend?._id}
            key={friend?._id}
            className='w-full flex gap-4 items-center cursor-pointer'
          >
            <img
              src={friend?.profileUrl ?? NoProfile}
              alt={friend?.firstName}
              className='w-10 h-10 object-cover rounded-full'
            />
            <div className='flex-1 '>
              <p className='text-base font-medium text-ascent-1'>
                {friend?.firstName} {friend?.lastName}
              </p>
              <span className='text-sm text-ascent-2'>
                {friend?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>

          <div className='flex gap-1'>
            <button
              className='bg-customOrange text-sm text-white p-1 rounded hover:bg-white hover:text-customOrange'
              onClick={() => {}}
            >
              <BsPersonFillAdd size={20} className='hover:bg-white' />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div> */}