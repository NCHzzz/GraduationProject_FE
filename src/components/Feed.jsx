import React, { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
// import PostCard from "./PostCard";
import PostDetail from "./PostDetail";
import Loading from "./Loading";
import { getIsActive } from "../redux/postSlice";
import { BsHash, BsGeoAlt, BsCardImage, BsFileText, BsTextParagraph } from "react-icons/bs";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { Avatar, AvatarFallback } from './ui/avatar';

export const scrollToTop = (ref) => {
    if (ref && ref.current) {
        ref.current.scrollTo({ top: 0, behavior: "smooth" });
    }
};
const PostCard = React.lazy(() => import('./PostCard')); // Lazy load PostCard

const Feed = ({ feedRef }) => {
    // const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { theme } = useSelector((state)=> state.theme);
    const [selectedPost, setSelectedPost] = useState(null);
    // const token = localStorage.getItem('token');
    const [posts, setPosts] = useState([]);
    //   const posts = useSelector((state) => state.posts);
    const [followingPosts, setFollowingPosts] = useState([]);

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
                const postsResponse = await api.get("/api/Post/all",
                    {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
                );
                const followingPostsResponse = await api.get("/api/Post/following",
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
                setFollowingPosts(followingPostsResponse.data);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handlePostClick = (postId) => {
      const post = posts.find((p) => p._id === postId);
      setSelectedPost(post);
    };
  
    const handleClosePostDetail = () => {
      setSelectedPost(null);
    };
    
    const {isActive} = useSelector(store=>store.posts);

    const forYouHandler = () => {
        dispatch(getIsActive(true));
    }
    const followingHandler = () => {
        dispatch(getIsActive(false));
    }

    const postsToDisplay = isActive ? posts : followingPosts;

    if (!token) {
        return null;
    }
  
  return (
    <div ref={feedRef} className={`flex h-screen border-l border-r border-l-gray-700 border-r-gray-700 flex-col gap-0 overflow-y-auto`}>
        <div className={`${theme === "light" ? "bg-white text-black" : "bg-black text-white"} flex items-center justify-evenly border-b border-gray-700 sticky bg-black top-0`}>
            <div onClick={forYouHandler} className={`${theme === "light" ? "bg-white text-black hover:bg-gray-400" : "bg-black text-white hover:bg-gray-800"} cursor-pointer w-full h-full text-center flex items-center justify-center`}>
                <h1 className={`${isActive ? ('border-b-4 border-customOrange' ) : ("border-b-4 border-transparent text-gray-600")} font-semibold w-[50%] h-full text-center text-lg flex items-center justify-center`}>For you</h1>
            </div>
            <div onClick={followingHandler} className={`${theme === "light" ? "bg-white text-black hover:bg-gray-400" : "bg-black text-white hover:bg-gray-800"} cursor-pointer w-full h-full text-center flex items-center justify-center`}>
                <h1 className={`${!isActive ? ('border-b-4 border-customOrange' ) : ("border-b-4 border-transparent text-gray-600")} font-semibold w-[50%] h-full text-center text-lg flex items-center justify-center`}>Following</h1>
            </div>
        </div>
        <div>
            <div className='flex items-center p-2'>
                <div>
                    <Avatar className='w-8 h-8 rounded-md'>
                        {user?.profilePictureURL ? (
                            <img
                            src={user.profilePictureURL}
                            alt='profile'
                            className="w-full h-auto"
                            />
                        ) : (
                            <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                        )}
                    </Avatar>
                </div>
                <input className={`${theme === "light" ? "bg-white text-black" : "bg-black text-white"} w-full outline-none bg-black border-none text-m ml-2`} type="text" placeholder='Your Post Title' />
            </div>
            <div className='flex items-center justify-between px-3 pb-3 border-b border-gray-700'>
                <div className="flex space-x-2">
                    <div className="group relative flex items-center">
                        <BsCardImage size="23px" />
                        <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            Image
                        </span>
                    </div>
                    <div className="group relative flex items-center">
                        <BsHash size="23px" />
                        <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            Hashtag
                        </span>
                    </div>
                    <div className="group relative flex items-center">
                        <BsGeoAlt size="23px" />
                        <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            Location
                        </span>
                    </div>
                    <div className="group relative flex items-center">
                        <BsFileText size="23px"/>
                        <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            Description
                        </span>
                    </div>
                    <div className="group relative flex items-center">
                        <BsTextParagraph size="23px" />
                        <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                            Short Description
                        </span>
                    </div>
                </div>
                <button className='bg-customOrange px-4 py-1 text-lg text-white font-semibold text-right border-none rounded-full '>Post</button>
            </div>
        </div>
        <div className="items-center justify-center">
            {loading ? (
                <Loading />
            ) : postsToDisplay?.length > 0 ? (
            <Suspense fallback={<Loading />}>
                {postsToDisplay.map((post) => (
                <PostCard key={post?.postID} post={post} user={user}/>
                ))}
            </Suspense>
            ) : (
                <div className='flex w-full h-full items-center justify-center'>
                    <p className='text-lg text-ascent-2'>No Post Available</p>
                </div>
            )}
            {/* {loading ? (
                <Loading />
            ) : postsToDisplay?.length > 0 ? (
                postsToDisplay.map((post) => (
                    <PostCard
                        key={post?.postID}
                        post={post}
                        user={user}
                        deletePost={() => {}}
                        likePost={() => {}}
                        onClick={() => handlePostClick(post.postID)}
                    />
                ))
            ) : (
                <div className='flex w-full h-full items-center justify-center'>
                    <p className='text-lg text-ascent-2'>No Post Available</p>
                </div>
            )} */}

            {selectedPost && (
                <PostDetail post={selectedPost} onClose={handleClosePostDetail} user={user} />
            )}
        </div>
       
    </div>
  )
}

export default Feed;

