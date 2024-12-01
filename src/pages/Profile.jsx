import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import EditProfile from '../components/EditProfile'; 
import LeftSideBar from '../components/LeftSideBar'; 
import { jwtDecode } from "jwt-decode";
import Small_LeftSideBar from '../components/Small_LeftSideBar';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const { theme } = useSelector((state) => state.theme);
  // const { user } = useSelector((state) => state.user);
  const [profile, setProfile] = useState('');
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState('');
  const [follower, setFollower] = useState('');
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  console.log("token: ", token);
  let userId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.sub;
  } else {
    console.log('No token found!');
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const profileResponse = await api.get(`/api/User/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
            }
            );
            const postResponse = await api.get(`/api/Post/user/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
            }
            );
            const followingResponse = await api.get(`/api/Follow/followingCount?userId=${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              }
            );
            const followerResponse = await api.get(`/api/Follow/followersCount?userId=${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              }
            );
            const savedPostResponse = await api.get("/api/Post/save",
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
            setSavedPosts(savedPostResponse.data);

            console.log("followingResponse: ", followingResponse.data);
 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
  }, [userId]);

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
                <AvatarImage src={profile.profilePictureURL} alt="profilephoto" />
              </Avatar>
            </div>
          </section>

          <section>
            <div className='flex flex-col gap-4 w-full p-4'>
              <div className='flex items-left gap-2'>
                <span>@{profile.userName}</span>
                <button className='bg-gray-500 p-1 rounded-md px-2 text-white font-semibold'
                  onClick={()=>handleEditProfile()} >
                  Edit profile
                </button>


              </div>

              {/* {isEditModalOpen && (
                  <EditProfile open={isEditModalOpen} setOpen={setIsEditModalOpen} />
              )} */}

              <div className='flex items-left font-bold text-lg'>
                <span>{profile.fullName}</span>

              </div>

              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{posts.length}</span> posts</p>
                <p><span className='font-semibold'>{follower}</span> followers</p>
                <p><span className='font-semibold'>{following}</span> following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-normal'>{profile.bio}</span>
                {/* <Badge className='w-fit' variant='secondary'>
                  <AtSign /> <span className='pl-1'>{profile.userName}</span>
                </Badge> */}
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
          <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>POSTS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>SAVED</span> 
            {/* <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold' : ''}`} onClick={() => handleTabChange('reels')}>REELS</span> */}
            {/* <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'font-bold' : ''}`} onClick={() => handleTabChange('tags')}>TAGS</span> */}
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {activeTab === 'posts' ? (
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
            ) : (
              savedPosts.map((savedPost) => (
                <div key={savedPost.postID} className='relative border rounded-xl group cursor-pointer'>
                  <img src={savedPost.imageUrl} alt='savedPostImage' className='rounded-xl my-0 w-full aspect-square object-cover' />
                  <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex justify-start items-center text-white space-x-4'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart />
                        <span>{savedPost.totalLikes}</span>
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle />
                        <span>{savedPost.totalDislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for editing profile */}
      {/* {isEditModalOpen && <EditProfile onClose={() => setIsEditModalOpen(false)} />} */}
    </div>
  );
};

export default Profile;
