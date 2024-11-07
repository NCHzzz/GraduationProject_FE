import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logo_without_background } from "../assets";
import TextInput from './TextInput';
import CustomButton from './CustomButton';
import { useForm } from 'react-hook-form';
import { BsMoon, BsSunFill, BsSearch } from "react-icons/bs";
import { SetTheme } from "../redux/theme";
import { useEffect } from 'react';

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue)); // Dispatch the action to change theme
  };


  const handleSearch = async (data) => {};

  return (
    <div className={`topbar fixed top-0 left-0 w-full ${theme === "light" ? "bg-white text-black" : "bg-black text-white"} flex items-center justify-between py-2 md:py-3 px-4 shadow-md z-50`}>
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
          styles={`w-[20rem] lg:w-[30rem] rounded-l-full py-2.5 h-10 ${theme === "light" ? "bg-white text-black" : "bg-gray-600 text-white"}`} // Change the background color based on the theme
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
        {/* <button onClick={() => handleTheme()}>
          {theme === "light" ? <BsMoon /> : <BsSunFill />}
        </button> */}
      </div>
    </div>
  )
}

export default TopBar;
