import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PostDetail from './PostDetail'; // Assuming you have a PostDetail component

const SearchComponent = ({ onClose }) => {
    const { theme } = useSelector((state) => state.theme);
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [clickedHashtag, setClickedHashtag] = useState('');
    const [selectedPost, setSelectedPost] = useState(null); // State for selected post

    // Fetch posts, users, and hashtags data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsResponse = await axios.get('https://localhost:7200/api/Post/all');
                const usersResponse = await axios.get('https://localhost:7200/api/User');
                const hashtagsResponse = await axios.get('https://localhost:7200/api/Hashtag/all');
                
                setPosts(postsResponse.data);
                setUsers(usersResponse.data);
                setHashtags(hashtagsResponse.data);
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

    // Filter posts based on search query
    useEffect(() => {
        const filtered = posts.filter(post =>
            (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (users.some(user => user.userName && user.userName.toLowerCase().includes(searchQuery.toLowerCase()) && user.id === post.userID))
        );
        setFilteredPosts(filtered);
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
        setSelectedPost(post); // Set the selected post
    };

    // If a post is selected, show the PostDetail component
    if (selectedPost) {
        return <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />;
    }

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            {/* Close Button */}
            <button className='absolute top-5 right-5 text-lg' onClick={onClose}>
                &times; {/* Close Icon */}
            </button>
            <div className={`${theme === "light" ? "bg-white text-black border-black" : "bg-black text-white border"} rounded-lg p-4 w-3/4 h-3/4 md:w-1/2 max-h-screen overflow-y-auto`}>
                {/* Title and Input */}
                <h2 className="text-xl font-semibold mb-4">Search</h2>
                <input
                    type="text"
                    placeholder="Search by title, description, or username..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-customOrange mb-4 text-black"
                />

                {/* Display Hashtags when no search query is entered */}
                {searchQuery === '' ? (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Hashtags</h3>
                        {hashtags.length > 0 ? (
                            <div>
                                {hashtags.map(hashtag => (
                                    <span
                                        key={hashtag.id}
                                        className="mr-2 p-2 bg-gray-200 rounded-full text-sm text-gray-700 cursor-pointer"
                                        onClick={() => handleHashtagClick(hashtag.name)} // Add click handler here
                                    >
                                        #{hashtag.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No hashtags found</p>
                        )}
                    </div>
                ) : (
                    // Display filtered posts after search query is entered
                    <div>
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <div
                                    key={post.id}
                                    className="mb-4 cursor-pointer"
                                    onClick={() => handlePostClick(post)} // Click handler for post
                                >
                                    <h3 className="text-lg font-semibold">{post.title}</h3>
                                    <p>{post.description}</p>
                                    {/* Find the username of the post's user */}
                                    <p className="text-sm text-gray-500">
                                        By {users.find(user => user.id === post.userID)?.userName}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No results found</p>
                        )}
                    </div>
                )}

                {/* Display posts filtered by clicked hashtag */}
                {clickedHashtag && !searchQuery && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">All posts for #{clickedHashtag}</h3>
                        
                            {filteredPosts.map(post => (
                                <div
                                    key={post.id}
                                    className={`${theme === "light" ? " text-black hover:bg-gray-300" : " text-white hover:bg-gray-700"} mb-2 p-3 rounded-xl cursor-pointer`}
                                    onClick={() => handlePostClick(post)} // Click handler for post
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
        </div>
    );
}

export default SearchComponent;
