import React, { useState, useDispatch, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { NoProfile } from "../assets";
import { BiComment, BiLike, BiSolidLike, BiDislike, BiArchive, BiSolidDislike, BiSolidArchive } from "react-icons/bi";
import Loading from "./Loading";
import { postComments, posts } from "../assets/data";
import { BsPersonFillAdd } from "react-icons/bs";
import PostDetail from "./PostDetail";
import { useSelector } from "react-redux";
import axios from "axios";

const PostCard = ({ post, user, deletePost, likePost, onClick }) => { 
  const [showComments, setShowComments] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { theme } = useSelector((state)=> state.theme);
  
  const [userProfile, setUserProfile] = useState([]);
  const userId = post?.userID;

  useEffect(() => {
    axios.get(`https://localhost:7200/api/User/${userId}`)
      .then(response => {
        setUserProfile(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  const handleClosePostDetail = () => {
    setSelectedPost(null);
  };

  // const handlePostClick = (postId) => {
  //   const post = posts.find((p) => p.postID === postId);
  //   setSelectedPost(post);
  // };

  const handleReadMore = () => {
    setSelectedPost(post); // Set the selected post to show details
  };

  const getComments = async () => {
    setLoading(true);
    setComments(postComments); 
    setLoading(false);
  };

  const handleLike = async () => {

  };

  // Sample 'createdAt' timestamp from your database
  const createdAt = post.createdAt;
  // Calculate the difference using Moment.js
  const now = moment(); // Current time
  const postTime = moment(createdAt); // Post creation time
  // Get the time difference in minutes
  const diffMinutes = now.diff(postTime, 'minutes');
  // Determine the display format
  let displayTime;
  if (diffMinutes < 60) {
    displayTime = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffMinutes >= 60 && diffMinutes < 1440) { // 1440 minutes = 24 hours
    const diffHours = now.diff(postTime, 'hours');
    displayTime = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    const diffDays = now.diff(postTime, 'days');
    displayTime = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }


  return (
    <div className={`${theme === "light" ? "bg-white text-black border-black hover:bg-gray-300 " : "bg-black text-white hover:bg-gray-600 "} mb-2 bg-primary p-4 rounded-xl border `}>
      <div onClick={onClick} className="block cursor-pointer">
        <div className='flex gap-3 items-center mb-2'>
          <Link to={`/profile/${userId}`}>
            <img
              src={userProfile?.profileUrl ?? NoProfile}
              alt={userProfile?.userName}
              className='w-14 h-14 object-cover rounded-full'
            />
          </Link>

          <div className='w-full flex justify-between'>
            <div className="w-full">
              <div className='flex items-center'>
                <Link to={"/profile/" + userId}>
                  <p className='font-medium text-lg text-ascent-1'>
                    {userProfile?.userName ?? "User"}
                  </p>
                </Link>
                <button
                  className='bg-customOrange text-sm text-white p-1 rounded hover:bg-white hover:text-customOrange ml-2'
                  onClick={(handleFollow) => {
                  }}
                >
                  <BsPersonFillAdd size={12} />
                </button>
              </div>
              <span className='text-ascent-2'>{displayTime}</span>

            </div>
          </div>
        </div>

        <div>
          <h1 className={`${theme === "light" ? " text-black" : " text-white "} text-xl font-bold mb-2 `}>{post?.title}</h1>
          <p className= {`${theme === "light" ? " text-black" : " text-white "} text-m font-semi mb-2 `}>#{post?.hashtags}</p>
          {post?.imageUrl && (
            <img
              src={post?.imageUrl}
              alt='image'
              className='w-100 mt-2 rounded-lg'
            />
          )}
          <div className="">
            <button 
              className=" bg-customOrange text-sm text-white p-1 rounded hover:bg-white hover:text-customOrange mt-2"
              // onClick={() => handlePostClick(post?.postID)} 
              onClick={handleReadMore}
            >
              Read More
            </button>
          </div>

          {selectedPost && (
            <PostDetail post={selectedPost} onClose={handleClosePostDetail} user={userProfile} />
          )}

        </div>
      </div>

      <div className='mt-4 flex justify-items-start items-center px-3 py-1 text-ascent-2 text-base border-t border-[#66666645]'>
        <p className='flex mr-5 gap-1 items-center text-base cursor-pointer' onClick={handleLike}>
          {post?.likes?.includes(user?.id) ? (
            <BiSolidLike size={20} color='#d2511f' />
          ) : (
            <BiLike size={20} />
          )}
          {post?.likes?.length}
        </p>

        <p className='flex mr-5 gap-1 items-center text-base cursor-pointer' onClick={handleLike}>
          {post?.likes?.includes(user?.id) ? (
            <BiSolidDislike size={20} color='#d2511f' />
          ) : (
            <BiDislike size={20} />
          )}
          {post?.likes?.length} 
        </p>
        
        <p
          className='flex mr-5 gap-1 items-center text-base cursor-pointer'
          onClick={() => {
            setShowComments(showComments === post.postID ? null : post.postID);
            getComments(post?._id);
          }}
        >
          <BiComment size={20} />
          {post?.comments?.length} 
        </p>

        <p className='flex mr-5 gap-1 items-center text-base cursor-pointer' onClick={handleLike}>
          {post?.likes?.includes(user?._id) ? (
            <BiSolidArchive size={20} color='#d2511f' />
          ) : (
            <BiArchive size={20} />
          )}
          {post?.likes?.length} 
        </p>
      </div>

      {/* COMMENTS */}
      {showComments === post?.postID && (
        <div className='w-full mt-4 border-t border-[#66666645] pt-4'>
          {loading ? (
            <Loading />
          ) : comments?.length > 0 ? (
            comments.map((comment) => (
              <div className='w-full py-2' key={comment?._id}>
                <div className='flex gap-3 items-center mb-1'>
                  <Link to={"/profile/" + comment?.userId?._id}>
                    <img
                      src={comment?.userId?.profileUrl ?? NoProfile}
                      alt={comment?.userId?.firstName}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  </Link>
                  <div>
                    <Link to={"/profile/" + comment?.userId?._id}>
                      <p className='font-medium text-base text-ascent-1'>
                        {comment?.userId?.firstName} {comment?.userId?.lastName}
                      </p>
                    </Link>
                    <span className='text-ascent-2 text-sm'>
                      {moment(comment?.createdAt ?? "2023-05-25").fromNow()}
                    </span>
                  </div>
                </div>

                <div className='ml-12'>
                  <p className='text-ascent-2'>{comment?.comment}</p>
                  <div className='mt-2 flex gap-6'>
                    <p className='flex gap-2 items-center text-base text-ascent-2 cursor-pointer'>
                      {comment?.likes?.includes(user?.userID) ? (
                        <BiSolidLike size={20} color='#d2511f' />
                      ) : (
                        <BiLike size={20} />
                      )}
                      {comment?.likes?.length} Likes
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className='flex text-sm py-4 text-ascent-2 text-center'>
              No Comments, be first to comment
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
