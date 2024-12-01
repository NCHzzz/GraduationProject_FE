import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import {
  EditProfile,
  LeftSideBar,
  RightSidebar,
  Feed,
  Small_LeftSideBar
} from "../components";
import { useNavigate } from 'react-router-dom';



const Home = (token) => {
  const navigate = useNavigate();
  const { edit } = useSelector((state) => state.user);
  const { theme } = useSelector((state)=> state.theme);
  const feedRef = React.useRef(null);
  const { otherUsers } = useSelector(store => store.user);

  useEffect(() => {
    console.log('Home component loaded');
  }, []);


  if (!token) {
    navigate('/login');
    return null;
  }

  return (
    <>
      <div className={`w-full h-full px-0 lg:px-0  bg-bgColor ${theme === "light" ? "bg-white text-black" : "bg-black text-white"} lg:rounded-lg h-screen overflow-hidden `}>
        {/* <TopBar /> */}
        <div className='w-full flex h-full'>
          {/* LEFT */}
          <div className='hidden xs:w-[30%] px-4 h-full md:flex sm:hidden flex-col gap-6 overflow-x-auto items-center'>
            {/* <LeftSideBar /> */}
            <LeftSideBar feedRef={feedRef} />
          </div>
          <div className='flex w-[14%] md:hidden '>
            <Small_LeftSideBar feedRef={feedRef}/>
          </div>
          {/* CENTER */}
          <div className="w-[100%]">
            {/* <Feed /> */}
            <Feed feedRef={feedRef} />
          </div>
          {/* RIGHT */}
          <div className='hidden w-[40%] h-full lg:flex flex-col overflow-y-auto'>
            <RightSidebar otherUsers={otherUsers} />
          </div>
        </div>
      </div>
      {edit && <EditProfile />}
    
    </>
  );
};
export default Home;
