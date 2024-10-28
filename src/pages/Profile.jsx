import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import two_dogs from "../assets/two_dogs.jpg";
import { useSelector } from 'react-redux';
import EditProfile from '../components/EditProfile'; // Import the EditProfile component
import LeftSideBar from '../components/LeftSideBar'; // Import the LeftSideBar component
import { TopBar } from '../components';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control modal visibility
  const { theme } = useSelector((state) => state.theme);
  const { user, edit } = useSelector((state) => state.user);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Placeholder data
  const placeholderProfile = {
    profilePicture: two_dogs, // Sample image URL
    username: "Khuong Ngo",
    bio: "This is a sample bio.",
    postsCount: 10,
    followersCount: 100,
    followingCount: 50,
    posts: [
      { _id: "1", image: "https://example.com/post1.jpg", likes: [], comments: [] },
      { _id: "2", image: "https://example.com/post2.jpg", likes: [], comments: [] },
    ],
  };

  const displayedPost = activeTab === 'posts' ? placeholderProfile.posts : [];

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
                <AvatarImage src={placeholderProfile.profilePicture} alt="profilephoto" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </section>

          <section>
            <div className='flex flex-col gap-5 w-full p-4'>
              <div className='flex items-left gap-2'>
                <span>{placeholderProfile.username}</span>
                <Button
                  variant='secondary'
                  className='hover:bg-gray-200 h-8'
                  onClick={() => setIsEditModalOpen(true)} 
                >
                  Edit profile
                 
                </Button>
              </div>

              {isEditModalOpen && (
                  <EditProfile open={isEditModalOpen} setOpen={setIsEditModalOpen} />
              )}

              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{placeholderProfile.postsCount} </span>posts</p>
                <p><span className='font-semibold'>{placeholderProfile.followersCount} </span>followers</p>
                <p><span className='font-semibold'>{placeholderProfile.followingCount} </span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{placeholderProfile.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'>
                  <AtSign /> <span className='pl-1'>{placeholderProfile.username}</span>
                </Badge>
                <span>🤯Sample bio line 1</span>
                <span>🤯Sample bio line 2</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost.map((post) => (
                <div key={post._id} className='relative group cursor-pointer'>
                  <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                  <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex items-center text-white space-x-4'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart />
                        <span>{post.likes.length}</span>
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Modal for editing profile */}
      {isEditModalOpen && <EditProfile onClose={() => setIsEditModalOpen(false)} />} {/* Close modal on click */}
    </div>
  );
};

export default Profile;
