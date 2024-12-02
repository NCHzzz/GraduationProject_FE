import React, { useEffect, useState } from 'react';
import { NoProfile } from '../assets';
import moment from 'moment';
import { BiComment, BiLike, BiSolidLike } from "react-icons/bi";
import Loading from './Loading';
import { Link } from 'react-router-dom';
import { postComments } from "../assets/data";
import { useSelector } from 'react-redux';
import api from '../api';

const PostDetail = ({ post, onClose, user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const [postDetail, setPostDetail] = useState('');
  
  const token = localStorage.getItem('token');
  useEffect(() => {
    api.get(`/api/Post/${post.postID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
    }
    )
      .then(response => {
        setPostDetail(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const getComments = async () => {
    setLoading(true);
    setComments(postComments); 
    setLoading(false);
  };

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const fetchedComments = post?.comments || [];
      setComments(fetchedComments);
      setLoading(false);
    };

    if (post) {
      fetchComments();
    }
  }, [post]);

  const handleLike = async () => {
    
  };

  const handleDelete = async () => {

  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className={`${theme === "light" ? "bg-white text-black border-black" : "bg-black text-white border"} rounded-lg p-4 w-3/4 md:w-1/2 max-h-screen overflow-y-auto`}>
        <button className='absolute top-5 right-5 text-lg' onClick={onClose}>
          &times;
        </button>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className='flex gap-3 items-center mb-4'>
              <img
                src={user?.profileUrl ?? NoProfile}
                alt={user?.userName}
                className='w-14 h-14 object-cover rounded-full'
              />
              <div>
                <p className='font-medium text-lg'>
                  {user?.userName ?? "User"}
                </p>
                <span className='text-gray-500'>{moment(post?.createdAt).fromNow()}</span>
              </div>
            </div>

            <div className='mb-4'>
            <h1 className={`${theme === "light" ? " text-black" : " text-white "} text-xl font-bold mb-2 `}>{post?.title}</h1>
            <p className={`${theme === "light" ? " text-black" : " text-white "} mb-2 `}>{post?.shortDescription}</p>
            <p className={`${theme === "light" ? " text-black" : " text-white "} mb-2 `}>#{post?.hashtags}</p>
            {/* Display the image */}
            {post?.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={post?.title ?? "Post Image"}
                className="w-full h-auto rounded-lg mb-4"
              />
            ) : (
              <p className="text-gray-500 italic">{null}</p>
            )}
            </div>
            
            <h1 className={`${theme === "light" ? " text-black" : " text-white "} text-xl font-bold mb-2 `}>Location</h1>
            {/* <div className=''>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("600 Dien Bien Phu, 22 Ward, Binh Thanh district, Ho Chi Minh city")}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white text-m font-bold mb-2 hover:underline"
              >
                {post?.location}
              </a>
            </div> */}
            <p className={`${theme === "light" ? " text-black" : " text-white "} mb-2 `}>{postDetail?.location}</p>
              
            {/* <div className='mt-4 flex justify-items-start items-center px-3 py-1 text-ascent-2 text-base border-t border-[#66666645]'>
              <p className='flex mr-5 gap-1 items-center text-base cursor-pointer' onClick={handleLike}>
                {post?.likes?.includes(user?._id) ? (
                  <BiSolidLike size={20} color='#d2511f' />
                ) : (
                  <BiLike size={20} />
                )}
                {post?.likes?.length}
              </p>

              <p className='flex mr-5 gap-1 items-center text-base cursor-pointer' onClick={handleLike}>
                {post?.likes?.includes(user?._id) ? (
                  <BiSolidDislike size={20} color='#d2511f' />
                ) : (
                  <BiDislike size={20} />
                )}
                {post?.likes?.length} 
              </p>
              
              <p
                className='flex mr-5 gap-1 items-center text-base cursor-pointer'
                onClick={() => {
                  setShowComments(showComments === post._id ? null : post._id);
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

            </div> */}

            <div className='mt-4'>
              <h3 className='font-medium text-lg'>Comments</h3>
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
                                {comment?.likes?.includes(user?._id) ? (
                                <BiSolidLike size={20} color='#d2511f' />
                                ) : (
                                <BiLike size={20} />
                                )}
                                {comment?.likes?.length}
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
            </div>
            
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
