import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { CustomButton, Loading } from "../components";
import { text_logo_orange } from "../assets";

const NotificationPopup = ({ message }) => {
  return (
      <div className="fixed top-4 right-4 bg-green-500 font-semibold text-white px-4 py-2 rounded shadow-lg z-50">
          <p>{message}</p>
      </div>
  );
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const isValidEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
    if (!isValidEmail) {
      setErrorMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/Auth/register', {
        userName,
        email,
        fullName,
        password
      });

      console.log(response);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
        }, 3000);
        // navigate('/login');
      }


    } catch (error) {
      console.error(error); 
      setErrorMessage(error.response?.data || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

    {popupVisible && (
      <NotificationPopup
          message="Create account successfully!"
          onClose={() => setPopupVisible(false)}
      />
  )}
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-[40%] h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl border border-black'>
        <div className='w-full h-full p-5 2xl:px-15 flex flex-col justify-center '>
          <div className='w-full flex gap-2 items-center mb-6'>
            <img src={text_logo_orange} alt='Logo without background' />
          </div>

          <form className='py-1 flex flex-col' onSubmit={handleSubmit}>
            <div>
              <h3 className='text-xl font-semibold'>Username</h3>
              <input
                className="w-full border rounded-full p-2"
                name='username'
                placeholder='Username'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="mt-3">
              <h3 className='text-xl font-semibold'>Email</h3>
              <input
                className="w-full border rounded-full p-2"
                name='email'
                placeholder='email@example.com'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mt-3">
              <h3 className='text-xl font-semibold'>Full name</h3>
              <input
                className="w-full border rounded-full p-2"
                name='fullname'
                placeholder='Fullname'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mt-3">
              <h3 className='text-xl font-semibold'>Password</h3>
              <input
                className="w-full border rounded-full p-2"
                name='password'
                placeholder='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <span className="text-sm text-[#f64949fe] mt-0.5">
                {errorMessage}
              </span>
            )}

            {loading ? (
              <Loading />
            ) : (
              <CustomButton
                type='submit'
                containerStyles='inline-flex justify-center rounded-full bg-customOrange px-8 py-3 text-sm font-medium text-white outline-none mt-8'
                title='Register'
              />
            )}
          </form>

          <p className='text-ascent-2 text-sm text-center mt-3'>
            Already have an account?
            <Link to='/login' className='text-[#000000] font-semibold ml-2 cursor-pointer'>
              Log In
            </Link>
          </p>

          <Link to='/reset-password' className='text-sm text-center text-blue font-semibold'>
            Forgot Password ?
          </Link>
        </div>
      </div>
    </div>

    </>
  );
};

export default Register;
