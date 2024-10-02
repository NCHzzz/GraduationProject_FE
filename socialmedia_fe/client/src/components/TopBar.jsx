import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logo_without_background } from "../assets";
import TextInput from './TextInput';
import CustomButton from './CustomButton';
import { useForm } from 'react-hook-form';
import { BsMoon, BsSunFill, BsSearch } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";


const TopBar = () => {
  const { theme } = useSelector((state)=> state.theme);
  const { user } = useSelector((state)=> state.user);
  const dispatch = useDispatch();
  const {register,
    handleSubmit,
    formState: {errors}
  } =useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async(data) => {};

  return (
    <div className='topbar fixed top-0 left-0 w-full bg-primary flex items-center justify-between py-2 md:py-3 px-4 shadow-md z-50'>
      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2'>
          <img 
            src={logo_without_background}
            alt='Logo without background'
            className='w-16 h-auto md:w-32'
          />
        </div>
      </Link>

        <form 
          className='hidden md:flex items-center justify-center'
          onSubmit={handleSubmit(handleSearch)}
        >
          <TextInput
            placeholder='Search'
            styles='w-[20rem] lg:w-[30rem] rounded-l-full py-2.5 h-10' // Ensure consistent height
            register={register("search")}
          />

          <CustomButton
            title={<BsSearch />}
            type='submit'
            containerStyles='bg-customOrange text-white px-6 py-2.5 mt-1.5 rounded-r-full h-10' // Ensure consistent height
          />

        </form>

        {/* ICONS */}
      <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl'>
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <div className='hidden lg:flex'>
          <IoMdNotificationsOutline />
        </div>

        <div>
          <CustomButton
            onClick={() => dispatch(Logout())}
            title='Log Out'
            containerStyles='text-customOrange font-medium text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full hover:bg-customOrange hover:text-white'
          />
        </div>
      </div>

    </div>
  )
}

export default TopBar;