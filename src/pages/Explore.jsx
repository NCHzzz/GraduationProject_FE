import {
    LeftSideBar,
    Small_LeftSideBar
} from '../components'
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { NoProfile } from "../assets";
import { BsPersonFillAdd } from "react-icons/bs";
import { suggest } from "../assets/data";
import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import PostDetail from '../components/PostDetail'; 
import api from '../api';
import { jwtDecode } from "jwt-decode";
import SearchComponent from '../components/SearchComponent';

const Explore = ({ searchInput }) => {
    const { theme } = useSelector((state)=> state.theme);
    const [suggestedFriends, setSuggestedFriends] = useState(suggest);
    const [hashtags, setHashtags] = useState([]);
    const [clickedHashtag, setClickedHashtag] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null); 
    const [searchQuery, setSearchQuery] = useState(searchInput);
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [showSearchComponent, setShowSearchComponent] = useState(false);

    let userId = null;
    if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.sub;
    } else {
        console.log('No token found!');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsResponse = await api.get('/api/Post/all',
                    {
                        headers: {
                          Authorization: `Bearer ${token}`, 
                        },
                    }
                );
                const usersResponse = await api.get('/api/User',
                    {
                        headers: {
                          Authorization: `Bearer ${token}`, 
                        },
                    }
                );
                const hashtagsResponse = await api.get('/api/Hashtag/all', 
                    {
                        headers: {
                          Authorization: `Bearer ${token}`, 
                        },
                    }
                );
                const userResponse = await api.get(`/api/User/${userId}`, 
                    {
                        headers: {
                          Authorization: `Bearer ${token}`, 
                        },
                    }
                );
                
                setPosts(postsResponse.data);
                setUsers(usersResponse.data);
                setHashtags(hashtagsResponse.data);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

   // Calculate trending hashtags with post counts
    const calculateTrendingHashtags = () => {
        const hashtagCount = {};

        posts.forEach((post) => {
            post.hashtags?.forEach((hashtag) => {
                hashtagCount[hashtag] = (hashtagCount[hashtag] || 0) + 1;
            });
        });

        // Convert object to array and sort by frequency
        return Object.entries(hashtagCount)
            .sort((a, b) => b[1] - a[1]) // Sort descending by count
            .map(([name, count]) => ({ name, count })); // Return objects with name and count
    };

    const trendingHashtags = calculateTrendingHashtags();       

    const handleHashtagClick = (hashtag) => {
        setClickedHashtag(hashtag); // Set the clicked hashtag
        const filteredByHashtag = posts.filter(post =>
            post.hashtags && post.hashtags.includes(hashtag) // Check if the post has the hashtag
        );
        setFilteredPosts(filteredByHashtag);
    };
        // Handle post click to display PostDetail
    const handlePostClick = (post) => {
        setSelectedPost(post); 
    };
    const handleClosePostDetail = () => {
        setSelectedPost(null);
      };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        setShowSearchComponent(true);
    };

    // If a post is selected, show the PostDetail component
    if (selectedPost) {
        return <PostDetail post={selectedPost} onClose={handleClosePostDetail} user={user} />;
    }


    return (
    <>
      <div className={`w-full h-full px-0 lg:px-0  bg-bgColor 
            ${theme === "light" 
            ? "bg-white text-black" 
            : "bg-black text-white"} 
            lg:rounded-lg h-screen overflow-hidden `}>
        {/* <TopBar /> */}
        <div className='w-full flex h-full'>
          {/* LEFT */}
          <div className='hidden xs:w-[20%] px-4 h-full md:flex sm:hidden flex-col gap-6 overflow-x-auto items-center'>
            <LeftSideBar />
          </div>
          <div className='flex w-[14%] md:hidden '>
            <Small_LeftSideBar />
          </div>
          {/* CENTER */}
          <div className='w-full flex h-screen md:w-[60%] sm:w-[100%] border-l border-r border-l-gray-700 border-r-gray-700 flex-col gap-0 overflow-y-auto py-2'>
            <div className={`${theme === "light" ? "bg-white text-black border border-gray-800" : "bg-gray-700 text-white"} flex py-2 px-4 ml-[5%] rounded-full outline-none w-[90%]`}>
                <Search size="20px" />
                <input 
                    type="text"
                    className="bg-transparent outline-none px-2"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                 />
            </div>
            {/* Overlay and SearchComponent */}
            {showSearchComponent && (
            <>
                {/* Dim Background */}
                <div
                    className=""
                    onClick={() => setShowSearchComponent(false)}
                ></div>
                
                {/* SearchComponent */}
                <div
                    className={`relative w-[100%]
                    ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}
                >
                <SearchComponent
                    onClose={() => setShowSearchComponent(false)}
                    searchInput={searchQuery}
                />
                </div>
            </>
            )}

            {/* Trending Hashtags */}
            <div className="mb-4 mt-2 border-b border-b-gray-500">
                <h3 className="text-lg font-bold mb-2 px-3">Trending Hashtags</h3>
                {trendingHashtags.length > 0 ? (
                    <div>
                        {trendingHashtags.slice(0, 5).map((hashtag, index) => (
                            <span
                                key={index}
                                className={`${
                                    theme === 'light'
                                        ? 'bg-white text-black hover:bg-gray-300'
                                        : 'bg-black text-white hover:bg-gray-600'
                                } grid w-full font-semibold rounded-xl px-3 py-3 text-sm cursor-pointer`}
                                onClick={() => handleHashtagClick(hashtag.name)}
                            >
                                #{hashtag.name} 
                                <span className='text-xs font-normal text-gray-400'>({hashtag.count} posts)</span>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No trending hashtags found</p>
                )}
            </div>

            <h3 className="text-lg font-bold mb-2 px-3">Posts</h3>
            {clickedHashtag && !searchQuery && (
                <div className="mt-4">
                    {/* <h3 className="text-lg font-semibold">All posts for #{clickedHashtag}</h3> */}
                        {filteredPosts.map(post => (
                            <div
                                key={post.id}
                                className={`${theme === "light" 
                                    ? " text-black hover:bg-gray-300" 
                                    : " text-white hover:bg-gray-600"} 
                                     px-3 py-3 rounded-xl cursor-pointer`}
                                onClick={() => handlePostClick(post)}
                            >
                                <h3 className="text-lg font-semibold">{post.title}</h3>
                                <p>{post.description}</p>
                                <p className="text-sm text-gray-500">
                                    By {users.find(user => user.id === post.userID)?.userName}
                                </p>
                            </div>
                        ))}
                </div>
            )}
          <div >
        </div> 
    </div>

          {/* RIGHT */}
          <div className='hidden w-[30%]  h-full lg:flex flex-col overflow-y-auto'>
            <div className={`w-[90%]  px-0 lg:px-2 mt-3 bg-bgColor ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}  lg:rounded-lg h-screen overflow-hidden `}>
                <div className='p-4 rounded-2xl my-4 border border-gray-700'>
                    <h1 className='font-bold text-lg'>Who to follow</h1>
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Explore