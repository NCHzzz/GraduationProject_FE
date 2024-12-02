import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import LeftSideBar from '../components/LeftSideBar'; 
import Small_LeftSideBar from '../components/Small_LeftSideBar';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const OtherUserProfile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const { theme } = useSelector((state) => state.theme);
  const  userId = useParams();
  console.log("userId: ", userId);
  const [profile, setProfile] = useState('');
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState('');
  const [follower, setFollower] = useState('');

  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found!');
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const profileResponse = await api.get(`/api/User/${userId.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
            }
            );
            const postResponse = await api.get(`/api/Post/user/${userId.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
            }
            );
            const followingResponse = await api.get(`/api/Follow/followingCount?userId=${userId.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              }
            );
            const followerResponse = await api.get(`/api/Follow/followersCount?userId=${userId.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              }
            );

            setProfile(profileResponse.data);
            setPosts(postResponse.data);
            setFollowing(followingResponse.data);
            setFollower(followerResponse.data);
 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
  }, [userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return null;
}

  return (
    <div className={`flex min-h-screen ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}>
      {/* LEFT */}
      <div className='hidden xs:w-[30%] px-4 h-full md:flex sm:hidden flex-col gap-6 overflow-x-auto items-center'>
            <LeftSideBar />
          </div>
          <div className='flex w-[14%] md:hidden '>
            <Small_LeftSideBar />
          </div>
      {/* Main Profile Content */}
      <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg mt-10'>
        <div className='flex flex-row'>
          <section >
            <div className='flex items-center justify-left w-full p-4'> 
              <Avatar className='h-32 w-32'>
                      {profile?.profilePictureURL ? (
                          <img
                            src={profile?.profilePictureURL}
                            alt={profile?.userName}
                            className="h-32 w-32 object-cover"
    
                          />
                      ) : (
                          <AvatarFallback>{profile?.fullName?.charAt(0)}</AvatarFallback>
                      )}
                  </Avatar>
            </div>
          </section>
          <section>
            <div className='flex flex-col gap-5 w-full p-4'>
            <div className='flex items-left gap-2'>
                <span>@{profile.userName}</span>
              </div>
              <div className='flex items-left'>
                <span>{profile.fullName}</span>
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{posts.length}</span> posts</p>
                <p><span className='font-semibold'>{follower}</span> followers</p>
                <p><span className='font-semibold'>{following}</span> following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{profile.bio}</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
          <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>POSTS</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              posts.map((post) => (
                <div key={post.postID} className='relative border rounded-xl group cursor-pointer'>
                  <img src={post.imageUrl} alt='postimage' className='rounded-xl my-0 w-full aspect-square object-cover' />
                  <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex justify-start items-center text-white space-x-4'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart />
                        <span>{post.totalLikes}</span>
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle />
                        <span>{post.totalDislikes}</span>
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
