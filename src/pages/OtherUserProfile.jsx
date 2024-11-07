import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import LeftSideBar from '../components/LeftSideBar'; // Import the LeftSideBar component
import axios from 'axios'; // Import axios for API calls
import { NoProfile } from "../assets";

const OtherUserProfile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const userId = "0f3d1261-e53e-4539-b36f-6f7e0ce2f0bf";
  const [profile, setProfile] = useState([]);
  const [profilePost, setProfilePost] = useState([]);

  useEffect(() => {
    axios.get(`https://localhost:7200/api/User/${userId}`)
      .then(response => {
        setProfile(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`https://localhost:7200/api/Post/user/${userId}`)
      .then(response => {
        setProfilePost(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`flex min-h-screen ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}>
      
      <div className='hidden w-1/5 h-full md:flex flex-col gap-6 overflow-y-auto'>
        <LeftSideBar user={user}/>
      </div>

      {/* Main Profile Content */}
      <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg mt-10'>
        <div className='flex flex-row'>
          <section >
            <div className='flex items-center justify-left w-full p-4'> 
              <Avatar className='h-32 w-32'>
                <AvatarImage 
                // src={profile?.profilePictureURL ?? NoProfile} 
                src={NoProfile}
                alt={profile?.userName}
                />
              </Avatar>
            </div>
          </section>

          <section>
            <div className='flex flex-col gap-5 w-full p-4'>
              <p className='font-medium text-lg text-ascent-1'>
                    {profile?.userName ?? "UserName"}
              </p>
              <p className='font-medium text-lg text-ascent-1'>
                    {profile?.fullName ?? "FullName"}
              </p>

              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{profile.postsCount || 0} </span>posts</p>
                <p><span className='font-semibold'>{profile.followersCount || 0} </span>followers</p>
                <p><span className='font-semibold'>{profile.followingCount || 0} </span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{profile.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'>
                  <AtSign /> <span className='pl-1'>{profile?.userName}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              profilePost.map((post) => (
                <div key={post._id} className='relative group cursor-pointer'>
                  <img src={NoProfile} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                  <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex items-center text-white space-x-4'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart />
                        {/* <span>{post.likes.length}</span> */}
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle />
                        {/* <span>{post.comments.length}</span> */}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
