import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  EditProfile,
  FriendCard,
  Loading,
  PostCard,
  Profile,
  TextInput,
  TopBar,
  LeftSideBar,
  PostDetail,
  Small_LeftSideBar
} from "../components";
import { suggest, requests, posts } from "../assets/data";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsPersonFillAdd } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { SetTheme } from "../redux/theme";
import { useNavigate } from 'react-router-dom';
import useMediaQuery from "../hooks/useMediaQuery";
import useGetAllPost from "../hooks/useGetAllPost";
import axios from 'axios';

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const [suggestedFriends, setSuggestedFriends] = useState(suggest);
  // const [errMsg, setErrMsg] = useState("");
  // const [file, setFile] = useState(null);
  // const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [open, setOpen] = useState(false);
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state)=> state.theme);
  const [selectedPost, setSelectedPost] = useState(null);

  // useGetAllPost();
  // const posts = useSelector((state) => state.posts?.posts);

  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    axios.get('https://localhost:7200/api/Post/all')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // const handlePostClick = (postId) => {
  //     console.log('Post clicked:', postId);
  // };

  const handlePostClick = (postId) => {
    const post = posts.find((p) => p._id === postId);
    setSelectedPost(post);
  };

  const handleClosePostDetail = () => {
    setSelectedPost(null);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue)); // Dispatch the action to change theme
  };

  const handlePostSubmit = async (data) => {};

  const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' });

  return (
    <>
      <div className={`w-full px-0 lg:px-0 pb-20 2xl:px-40 bg-bgColor ${theme === "light" ? "bg-white text-black" : "bg-black text-white"} lg:rounded-lg h-screen overflow-hidden `}>
        {/* <TopBar /> */}
        <div className='w-full px-4 flex gap-2 lg:gap-4 pt-5 pb-0 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/6 h-full md:flex flex-col gap-6 overflow-x-auto'>
            {/* <Small_LeftSideBar /> */}
            <LeftSideBar />
            {/* {isSmallScreen ? <Small_LeftSideBar user={user} /> : <LeftSideBar user={user} />} */}
          </div>

          {/* CENTER */}
          <div className='flex-1 h-full px-2 flex flex-col gap-3 overflow-y-auto rounded-lg mt-10'>
              {loading ? (
                  <Loading />
              ) : posts?.length > 0 ? (
                  posts.map((post) => (
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
              )}

              {selectedPost && (
                  <PostDetail post={selectedPost} onClose={handleClosePostDetail} user={user} /> // Render the PostDetail modal
              )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto mt-10'>
            {/* FRIEND REQUEST */}
            {/* <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5 border'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>

              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className='flex items-center justify-between'>
                    <Link
                      to={"/profile/" + from._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {from?.firstName} {from?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {from?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <CustomButton
                        title='Accept'
                        containerStyles='bg-customOrange text-xs text-white px-1.5 py-1 rounded-full font-medium hover:bg-white hover:text-customOrange'
                      />
                      <CustomButton
                        title='Deny'
                        containerStyles='border border-black text-xs text-ascent-1 px-1.5 py-1 rounded-full font-medium hover:bg-#66666645 hover:text-customOrange'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5 border'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
              </div>
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

      {edit && <EditProfile />}
    </>
  );
};

export default Home;
