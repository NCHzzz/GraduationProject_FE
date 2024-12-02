import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { NoProfile } from "../assets";
import { BiComment, BiLike, BiSolidLike, BiDislike, BiArchive, BiSolidDislike, BiSolidArchive } from "react-icons/bi";
import Loading from "./Loading";
import PostDetail from "./PostDetail";
import { useSelector } from "react-redux";
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { jwtDecode } from "jwt-decode";
import { useInView } from "react-intersection-observer";
import OtherUserProfile from "../pages/OtherUserProfile";
import api from "../api";
import signalRConnection from "../SignalRService";
import { MdEdit, MdDelete } from 'react-icons/md';

const NotificationPopup = ({ message }) => {
  return (
      <div className="fixed top-4 right-4 bg-green-500 font-semibold text-white px-4 py-2 rounded shadow-lg z-50">
          <p>{message}</p>
      </div>
  );
};

const PostCard = ({ post, user }) => { 
  const [showComments, setShowComments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { theme } = useSelector((state)=> state.theme);
  const [userProfile, setUserProfile] = useState([]);
  const [postUserProfile, setPostUserProfile] = useState([]);
  const [userLikeStatus, setUserLikeStatus] = useState(false); 
  const [userDislikeStatus, setUserDislikeStatus] = useState(false); 
  const [userSaveStatus, setUserSaveStatus] = useState(false); 
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); 
  const { ref, inView } = useInView({triggerOnce: true, threshold: 0.1, });
  const [notificationMessage, setNotificationMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false); 
  const [totalLikes, setTotalLikes] = useState(post.totalLikes); 
  const [totalDislikes, setTotalDislikes] = useState(post.totalDislikes); 
  const [totalSaved, setTotalSaved] = useState(0); 
  const navigate = useNavigate();
  const [reactionCounts, setReactionCounts] = useState({
    totalLikes: post.totalLikes,
    totalDislikes: post.totalDislikes,
  });
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.sub;
  } else {
    console.log('No token found!');
  }

  const saveInteractionStatus = (postID, status) => {
    localStorage.setItem(`post_${postID}_status`, JSON.stringify(status));
  };
  
  const getInteractionStatus = (postID) => {
    const status = localStorage.getItem(`post_${postID}_status`);
    return status ? JSON.parse(status) : null;
  };

  useEffect(() => {
    if (inView) {
      setIsLoaded(true);
    }
  }, [inView]);

  useEffect(() => {
      api
        .get(`/api/User/${userId}`, {headers: {Authorization: `Bearer ${token}`,},})
        .then((response) => {setUserProfile(response.data);})
        .catch((error) => {console.error(error);});
      api
        .get(`/api/User/${post.userID}`, {headers: {Authorization: `Bearer ${token}`,},})
        .then((response) => {setPostUserProfile(response.data);})
        .catch((error) => {console.error(error);});
      api
        .get(`/api/Post/save/count?postId=${post.postID}`, {headers: {Authorization: `Bearer ${token}`,},})
        .then((response) => {setTotalSaved(response.data);})
        .catch((error) => {console.error(error);});
  }, [userId, post.userID, token]);

  useEffect(() => {
    if (userId && post.userID) {
      checkFollowingStatus();
    }
  }, [userId, post.userID]);

  // Check if the user is following the post's author
  const checkFollowingStatus = async () => {
    try {
      const response = await api.get(`/api/Follow/isFollowing?followUserId=${post.userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(response.data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleClosePostDetail = () => {
    setSelectedPost(null);
  };

  const handleReadMore = () => {
    setSelectedPost(post); 
  };

  const getComments = async () => {
    setLoading(true);
    setLoading(false);
  };

  const handleLike = async () => {
    const newLikeStatus = !userLikeStatus;
    const newTotalLikes = newLikeStatus ? totalLikes + 1 : totalLikes - 1;
    
    // Update the like status
    setUserLikeStatus(newLikeStatus);
    setTotalLikes(newTotalLikes);
    setReactionCounts((prevCounts) => ({
      ...prevCounts,
      totalLikes: newTotalLikes,
    }));
    saveInteractionStatus(post.postID, {
      likeStatus: newLikeStatus,
      dislikeStatus: userDislikeStatus,
      saveStatus: userSaveStatus,
    });
    try {
      await api.post(`/api/Post/react?postId=${post.postID}&isLike=true`, 
        { userId: user.id },
        { headers: {Authorization: `Bearer ${token}`,}});
    } catch (error) {
      console.error(error);
      // Revert the state on failure
      setUserLikeStatus(!newLikeStatus);
      setTotalLikes(totalLikes);
      setReactionCounts((prevCounts) => ({
        ...prevCounts,
        totalLikes: totalLikes,
      }));
    }
  };
  
  const handleDislike = async () => {
    const newDislikeStatus = !userDislikeStatus;
    const newTotalDislikes = newDislikeStatus ? totalDislikes + 1 : totalDislikes - 1;
    // Update the dislike status
    setUserDislikeStatus(newDislikeStatus);
    setTotalDislikes(newTotalDislikes);
    setReactionCounts((prevCounts) => ({
      ...prevCounts,
      totalDislikes: newTotalDislikes,
    }));
    saveInteractionStatus(post.postID, {
      likeStatus: userLikeStatus,
      dislikeStatus: newDislikeStatus,
      saveStatus: userSaveStatus,
    });
    try {
      await api.post(`/api/Post/react?postId=${post.postID}&isLike=false`, 
        { userId: user.id },
        { headers: { Authorization: `Bearer ${token}`, }});
    } catch (error) {
      console.error(error);
      // Revert the state on failure
      setUserDislikeStatus(!newDislikeStatus);
      setTotalDislikes(totalDislikes);
      setReactionCounts((prevCounts) => ({
        ...prevCounts,
        totalDislikes: totalDislikes,
      }));
    }
  };

  const handleSavePost = async () => {
    const newSaveStatus = !userSaveStatus; 
    const newTotalSave = newSaveStatus ? totalSaved + 1 : totalSaved - 1;
    // Optimistically update the state
    setUserSaveStatus(newSaveStatus);
    setTotalSaved(newTotalSave);
    saveInteractionStatus(post.postID, {
      likeStatus: userLikeStatus,
      dislikeStatus: userDislikeStatus,
      saveStatus: newSaveStatus,
    });

    try {
        if (newSaveStatus) {
            // API call to save the post
            const response = await api.post(
                `/api/Post/save?postId=${post.postID}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // Handle the response
            if (response.data.flag && response.data.data === true) {
                console.log(response.data.message); 
                setNotificationMessage(`You saved a from @${postUserProfile.userName}!`);
                setPopupVisible(true);
                setTimeout(() => setPopupVisible(false), 3000);
            } else {
                throw new Error("Failed to save the post. Reverting changes.");
            }
        } else {
            // API call to unsave the post
            const response = await api.delete(
                `/api/Post/unsave?postId=${post.postID}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Handle the response
            if (response.data.flag && response.data.data === true) {
                console.log(response.data.message);
                setNotificationMessage(`You unsaved a from @${postUserProfile.userName}!`);
                setPopupVisible(true);
                setTimeout(() => setPopupVisible(false), 3000);
            } else {
                throw new Error("Failed to unsave the post. Reverting changes.");
            }
        }
    } catch (error) {
        console.error("Error in handleSavePost:", error);

        // Revert the state on failure
        setUserSaveStatus(!newSaveStatus);
        setTotalSaved(totalSaved);
    }
};

useEffect(() => {
  const savedStatus = getInteractionStatus(post.postID);
  if (savedStatus) {
    setUserLikeStatus(savedStatus.likeStatus);
    setUserDislikeStatus(savedStatus.dislikeStatus);
    setUserSaveStatus(savedStatus.saveStatus);
  }
}, [post.postID]);

useEffect(() => {
    signalRConnection.on("UpdateReactionCounts", (postId, totalLikes, totalDislikes) => {
      if(postId === post.postID) {
        setReactionCounts({ totalLikes, totalDislikes });
      }
      if (userId === post.userID && postId === post.postID) {
        if (totalLikes > reactionCounts.totalLikes) {
          setNotificationMessage(`Your post has been liked!`);
          setPopupVisible(true);
          setTimeout(() => setPopupVisible(false), 3000);
        } else if (totalDislikes > reactionCounts.totalDislikes) {
          setNotificationMessage(`Your post has been disliked!`);
          setPopupVisible(true);
          setTimeout(() => setPopupVisible(false), 3000);
        }
      }
    });

    signalRConnection.on("UpdateSaveCounts", (postId, totalSaves) => {
      if (postId === post.postID) {
        setTotalSaved(totalSaves);
      }
      if (postId === post.postID && userId === post.userID && totalSaves > totalSaved) {
        setNotificationMessage("You post has been saved!");
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
      }
    });

    return () => {
        signalRConnection.off("ReceiveNotification");
        signalRConnection.off("UpdateReactionCounts");
        signalRConnection.off("UpdateSaveCounts");
    };
}, [post.postID, userId, reactionCounts.totalLikes, reactionCounts.totalDislikes, totalSaved]);



  useEffect(() => {
    if (userId && post.userID) {checkFollowingStatus();}
  }, []);

  const handleFollow = async (postUserProfileId) => {
    try {
        // API call to follow the user
        const response = await api.post(
            `/api/Follow/followOrUnfollow?isFollow=true`,
            { followUserId: postUserProfileId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        setIsFollowing(true);
        setNotificationMessage(`You followed @${postUserProfile.userName}!`);
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
        // Check the response
        // if (response.data.flag && response.data.data === true) {
        //     setIsFollowing(true); // Update the follow state
        //     console.log(response.data.message); // Log success message

        //     // Prepare and send notification
        //     const notificationMessage = `@${userProfile.userName} followed you!`;
        //     const notificationResponse = await api.post(
        //         `/api/Notification`,
        //         {
        //             receiveUserID: postUserProfileId,
        //             message: notificationMessage,
        //         },
        //         {
        //             headers: { Authorization: `Bearer ${token}` },
        //         }
        //     );

        //     if (notificationResponse.data.flag) {
        //         console.log("Notification sent successfully:", notificationResponse.data.message);
        //     } else {
        //         console.error("Notification sending failed:", notificationResponse.data.message);
        //     }
        // } else {
        //     throw new Error("Failed to follow the user. Please try again.");
        // }
    } catch (error) {
        console.error("Error in handleFollow:", error);
    }
};

  const handleUnfollow = async (postUserProfileId) => {
    try {
      const response = await api.post(`/api/Follow/followOrUnfollow?isFollow=false`, 
        { followUserId: postUserProfileId },
        { headers: { Authorization: `Bearer ${token}`,}});
        setIsFollowing(false);
        setNotificationMessage(`You unfollowed @${postUserProfile.userName}!`);
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
      // if (response.status === 200) {
      //   setIsFollowing(false);
      // }
    } catch (error) {console.error(error);}
  };

  const handleEditPost = async (postID) => {
    navigate(`/edit-post/${postID}`);
  }

  const handleDeletePost = async (postID) => {
    try {
      const response = await api.delete(`/api/Post/${postID}`, {headers: {Authorization: `Bearer ${token}`,},});
      if (response.status === 200) {
        console.log('Post deleted successfully!');
        setNotificationMessage(`Delete post successfully!`);
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
      }
    } catch (error) {console.error(error);}
  }

const createdAt = post.createdAt;
const now = moment(); 
const postTime = moment(createdAt); 
let displayTime;

if (now.diff(postTime, 'minutes') < 60) {
  const diffMinutes = Math.floor(now.diff(postTime, 'minutes'));
  displayTime = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
} else if (now.diff(postTime, 'hours') < 24) {
  const diffHours = Math.floor(now.diff(postTime, 'hours'));
  displayTime = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
} else {
  const diffDays = Math.floor(now.diff(postTime, 'days'));
  displayTime = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

  return (
    <div ref={ref}>
    {/* <div> */}
      {isLoaded ? (
            <div className={`${theme === "light" 
                            ? "bg-white text-black hover:bg-gray-300 " 
                            : "bg-black text-white hover:bg-gray-600 "} 
                            bg-primary p-4 px-8 items-center justify-center border-t border-b border-t-gray-700 border-b-gray-700 `}>
              {popupVisible && (
                <NotificationPopup
                    message={notificationMessage}
                    onClose={() => setPopupVisible(false)}/>)}
            <div className="block cursor-pointer">
              <div className='flex gap-3 items-center mb-2'>
                <Link to={`/profile/${postUserProfile.id}`}>
                  {postUserProfile?.profilePictureURL ? (
                  <img
                    src={postUserProfile?.profilePictureURL}
                    alt={post?.title ?? "Post Image"}
                    className="w-8 h-8 object-cover rounded-full"
                  />
                ) : (
                  <img
                    src={NoProfile}
                    alt={post?.title ?? "Post Image"}
                    className="w-8 h-8 object-cover rounded-full"
                  />
                )}
                </Link>
                <div className='w-full flex justify-between'>
                  <div className="w-full">
                    <div className='flex items-center'>
                      <Link to={`/profile/${postUserProfile.id}`}>
                        <p className='font-bold text-lg'>
                          {postUserProfile.fullName}
                        </p>
                      </Link>
                      <p className='font-light text-m ml-1 text-gray-400'>
                          @{postUserProfile.userName}
                        </p>
                        <button
                          className={`${theme === "light" ? "bg-black text-white hover:bg-white hover:text-customOrange" : "bg-white text-black hover:bg-black hover:text-customOrange"} p-1 rounded text-lg ml-2`}
                          onClick={() => {
                            if (isFollowing) {
                              handleUnfollow(postUserProfile.id);  
                            } else {
                              handleFollow(postUserProfile.id); 
                            }
                          }}
                          disabled={postUserProfile.id === userProfile.id}>
                          {postUserProfile.id === userProfile.id ? null : isFollowing ? 
                          (<AiOutlineMinus size={12}/>) : (<AiOutlinePlus size={12}/>)}
                        </button>
                        {postUserProfile.id === userProfile.id && (
                          <div className="flex ml-11 ">
                            <MdEdit size={20} color='#d2511f' 
                              onClick={() => handleEditPost(post.postID)}/>
                            <MdDelete size={20} color='#d2511f'
                            className="ml-4"
                              onClick={() => handleDeletePost(post.postID)} />
                          </div>
                        )}
                    </div>
                    <span className='text-ascent-2 text-xs'>{displayTime}</span>
                  </div>
                </div>
              </div>
      
              <div>
                <h1 className={`${theme === "light" ? " text-black" : " text-white "} 
                                text-xl font-medium mb-2 ml-9`}>{post?.title}</h1>
                <p className= {`${theme === "light" ? " text-black" : " text-white "} 
                                text-m font-normal mb-2 ml-9 `}>#{post?.hashtags}</p>
                {post?.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post?.title ?? "Post Image"}
                    className="w-[95%] h-auto rounded-lg mb-4 ml-9"
                  />
                ) : (
                  <p className="text-gray-500 italic">{null}</p>
                )}
                <div className="">
                  <button 
                    className="text-customOrange text-sm font-medium italic rounded hover:bg-white hover:text-orange-800 mt-2 ml-9"
                    onClick={handleReadMore}>
                    Read More..
                  </button>
                </div>
                {selectedPost && (
                  <PostDetail post={selectedPost} onClose={handleClosePostDetail} user={postUserProfile}/>
                )}
                {selectedUser && (
                  <OtherUserProfile userId={selectedUser.id} />
                )}
              </div>
            </div>
            <div className='mt-4 flex justify-items-start items-center px-3 py-1 text-ascent-2 text-base ml-9'>
              <p className='flex mr-5 gap-1 items-center text-base cursor-pointer' onClick={handleLike}>
                 {/* {userLikeStatus ? <BiSolidLike size={20} color='#d2511f' /> : <BiLike size={20} />} */}
                 <BiLike size={20} />
                 {reactionCounts.totalLikes} 
              </p>
              <p className='flex mr-5 gap-1 items-center text-base cursor-pointer' onClick={handleDislike}>
                {/* {userDislikeStatus ? <BiSolidDislike size={20} color='#d2511f' /> : <BiDislike size={20} />} */}
                <BiDislike size={20} />
                {reactionCounts.totalDislikes}
              </p>
              <p className='flex mr-5 gap-1 items-center text-base cursor-pointer'
                onClick={() => {
                  setShowComments(showComments === post.postID ? null : post.postID);
                  getComments(post?._id);
                }}>
                <BiComment size={20}/>
              </p>
              <p className='flex mr-5 gap-1 items-center text-base cursor-pointer' onClick={handleSavePost}>
                {/* {userSaveStatus ? <BiSolidArchive size={20} color='#d2511f' /> : <BiArchive size={20} />} */}
                <BiArchive size={20} />
                {totalSaved}
              </p>
            </div>
            {/* COMMENTS */}
            <div>
            {/* {showComments === post?.postID && (
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
                            {comment?.likes ? (
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
            )} */}
            </div> 
          </div>
      ) : (
        <Loading />
      )}
    </div> 
  );
};
export default PostCard;
