import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CustomButton, Loading } from "../components";
import { text_logo_orange } from "../assets";
import { useNavigate  } from 'react-router-dom'; // For navigation after login
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate (); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    console.log(email);
    console.log(password);

    try {
      const response = await api.post('/api/Auth/login', {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/home'); 
    
      }
      
      } catch (error) {
      console.error(error); 
      setErrorMessage(error.response?.data || 'An error occurred during login.');
      } finally {
      setLoading(false);
      }
  };

  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-[40%] h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl border border-black'>
        <div className='w-full h-full p-5 2xl:px-15 flex flex-col justify-center '>
          <div className='w-full flex gap-2 items-center mb-6'>
            <img
              src={text_logo_orange}
              alt='Logo without background'
              className=''
            />
          </div>
          
          <form
            className='py-1 flex flex-col'
            onSubmit={handleSubmit}
          >
            <div>
              <h3 className='text-xl font-semibold'>Email</h3>
              <input className="w-full border rounded-full p-2"
              name='email'
              placeholder='email@example.com'
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
            </div>

            <div className="mt-3">
              <h3 className='text-xl font-semibold'>Password</h3>
              <input className="w-full border rounded-full p-2"
              name='password'
              label='Password'
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            </div>
            
            {errorMessage && (
              <span
                className={`text-sm ${
                  "error-message"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errorMessage}
              </span>
            )}
            {/* {errorMessage && <p className="error-message">{errorMessage}</p>}    */}
            {loading ? (
              <Loading />
            ) : (
              <CustomButton
                type='submit'
                containerStyles={`inline-flex justify-center rounded-full bg-customOrange px-8 py-3 text-sm font-medium text-white outline-none mt-8`}
                title='Login'
              />
            )}
          </form>
          <p className='text-ascent-2 text-sm text-center mt-3'>
            Don't have an account?
            <Link
              to='/register'
              className='text-[#000000] font-semibold ml-2 cursor-pointer'
            >
              Create Account
            </Link>
          </p>

          <Link
            to='/reset-password'
            className='text-sm text-center text-blue font-semibold'
          >
            Forgot Password ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
