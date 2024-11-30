import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import PostDetail from './PostDetail'; 
import { jwtDecode } from "jwt-decode";

const SearchComponent = ({ onClose, searchInput }) => {
    const { theme } = useSelector((state) => state.theme);
    const [searchQuery, setSearchQuery] = useState(searchInput);
    useEffect(() => {
        setSearchQuery(searchInput);
    }, [searchInput]);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [clickedHashtag, setClickedHashtag] = useState('');
    const [selectedPost, setSelectedPost] = useState(null); 
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
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

    // Handle search input change
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    // // Filter posts based on search query
    // useEffect(() => {
    //     const filtered = posts.filter(post =>
    //         (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //         (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //         (users.some(user => user.userName && user.userName.toLowerCase().includes(searchQuery.toLowerCase()) && user.id === post.userID))
    //     );
    //     setFilteredPosts(filtered);
    // }, [searchQuery, posts, users]);

    // Filter posts based on search query, including hashtags
    useEffect(() => {
        if (searchQuery.startsWith('#')) {
            // If the search query starts with '#', search in hashtags
            const hashtag = searchQuery.slice(1).toLowerCase(); // Remove the '#' and convert to lowercase
            const filteredByHashtag = posts.filter(post =>
                post.hashtags && post.hashtags.some(postHashtag => postHashtag.toLowerCase().includes(hashtag))
            );
            setFilteredPosts(filteredByHashtag);
        } else {
            // Otherwise, search in posts, description, or username
            const filtered = posts.filter(post =>
                (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (users.some(user => user.userName && user.userName.toLowerCase().includes(searchQuery.toLowerCase()) && user.id === post.userID))
            );
            setFilteredPosts(filtered);
        }
    }, [searchQuery, posts, users]);

    // Handle hashtag click and filter posts based on the clicked hashtag
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

    // If a post is selected, show the PostDetail component
    if (selectedPost) {
        return <PostDetail post={selectedPost} onClose={handleClosePostDetail} user={user} />;
    }

    return (
        // <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className={`${theme === "light" ? "bg-white text-black border-black" : "bg-black text-white border border-gray-700"} rounded-2xl p-2 mt-1 w-full max-h-[500px] overflow-y-auto`}>
                <button className='absolute top-5 right-5 text-lg' onClick={onClose}>
                    &times; 
                </button>

                {/* Display Hashtags when no search query is entered */}
                {/* {searchQuery === '' ? (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Hashtags</h3>
                        {hashtags.length > 0 ? (
                            <div>
                                {hashtags.slice(0, 5).map(hashtag => (
                                    <span
                                        key={hashtag.id}
                                        className="grid w-full mr-2 p-2 py-1 my-1 rounded-full text-sm text-white cursor-pointer hover:bg-gray-700"
                                        onClick={() => handleHashtagClick(hashtag.name)} 
                                    >
                                        #{hashtag.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No hashtags found</p>
                        )}
                    </div>
                ) : ( */}
                    <div>
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <div
                                    key={post.id}
                                    className="grid w-full mr-2 p-2 py-1 my-1 rounded-xl text-sm text-white cursor-pointer hover:bg-gray-700"
                                    onClick={() => handlePostClick(post)} 
                                >
                                    <h3 className="text-lg font-semibold">{post.title}</h3>
                                    <h4 className="text-xs">#{post.hashtags}</h4>
                                    <p className="text-sm text-gray-500">
                                        By {users.find(user => user.id === post.userID)?.userName}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No results found</p>
                        )}
                    </div>
       

                {clickedHashtag && !searchQuery && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">All posts for #{clickedHashtag}</h3>
                        
                            {filteredPosts.map(post => (
                                <div
                                    key={post.id}
                                    className={`${theme === "light" ? " text-black hover:bg-gray-300" : " text-white hover:bg-gray-700"} mb-2 p-3 rounded-xl cursor-pointer`}
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
            </div>
        // </div>
        // <div >
        //     <div>
        //         {filteredPosts.length > 0 ? (
        //             filteredPosts.map(post => (
        //                 <div
        //                     key={post.id}
        //                     className="mb-4 cursor-pointer"
        //                     onClick={() => handlePostClick(post)} // Click handler for post
        //                 >
        //                     <h3 className="text-lg font-semibold">{post.title}</h3>
        //                     <p>{post.description}</p>
        //                     {/* Find the username of the post's user */}
        //                     <p className="text-sm text-gray-500">
        //                         By {users.find(user => user.id === post.userID)?.userName}
        //                     </p>
        //                 </div>
        //             ))
        //         ) : (
        //             <p className="text-sm text-gray-500">No results found</p>
        //         )}
        //     </div>
        // </div>
    );
}

export default SearchComponent;
