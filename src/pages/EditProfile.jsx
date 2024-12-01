import React, { useState, useEffect } from 'react'
import Small_LeftSideBar from '../components/Small_LeftSideBar';
import LeftSideBar from '../components/LeftSideBar'; 
import { useSelector } from 'react-redux';
import { jwtDecode } from "jwt-decode";
import api from '../api';

const NotificationPopup = ({ message }) => {
    return (
        <div className="fixed top-4 right-4 bg-green-500 font-semibold text-white px-4 py-2 rounded shadow-lg z-50">
            <p>{message}</p>
        </div>
    );
};

const EditProfile = () => {
    const { theme } = useSelector((state) => state.theme);
    const [profile, setProfile] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [notification, setNotification] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);
    const [fullName, setFullName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState(''); 
    
    const token = localStorage.getItem('token');
    console.log("token: ", token);
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
                const profileResponse = await api.get(`/api/User/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const profileData = profileResponse.data;
                setProfile(profileData);
                setUserName(profileData.userName || '');
                setEmail(profileData.email || '');
                setFullName(profileData.fullName || '');
                setBio(profileData.bio || '');
                setProfilePicture(profileData.profilePictureURL || '');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userId, token]);

      const handlePostSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        const postData = {
            userName: userName,
            email: email,
            fullName: fullName,
            bio: bio,
            profilePictureURL: profilePicture
        };
        console.log("post data: ", postData); 


        try {
            console.log('Sending POST request to API...');
            const response = await api.put('/api/User/me', postData,
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                    },
                }
        );
            console.log('Update profile successfully:', response.data);
            setUserName(response.data.userName);
            setEmail(response.data.email);
            setFullName(response.data.fullName);
            setBio(response.data.bio);
            setProfilePicture('');

            setPopupVisible(true);
            setTimeout(() => setPopupVisible(false), 3000); // Hide popup after 3 seconds
        } catch (error) {
            console.error('Error creating post:', error);
            if (error.response) {
                console.error('Server error:', error.response);
                setNotification('Server error: Unable to create post.');
            } else if (error.request) {
                console.error('No response received:', error.request);
                setNotification('No response received from the server.');
            } else {
                console.error('Request error:', error.message);
                setNotification('Error submitting post.');
            }
        }
    };

    const handleImageChange = async (e) => {
        setUploading(true); // Start the loader
        const file = e.target.files[0]; // Select only the first file
    
        if (!file) {
            setUploading(false);
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "foodtalk");
    
        try {
            const response = await api.post(
                `https://api.cloudinary.com/v1_1/dre3daq6i/image/upload`,
                formData
            );
            setImages(response.data.secure_url); // Save the URL of the uploaded image
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
        } finally {
            setUploading(false); // Stop the loader
        }
    };
    
    const handleImageRemove = () => {
        setImages(""); 
    };
    
    if (!token) {
        return null;
    }
    
  return (
    <div className={`flex min-h-screen ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}>
        {popupVisible && (
            <NotificationPopup
                message="Update profile successfully!"
                onClose={() => setPopupVisible(false)}
            />
        )}
    {/* LEFT */}
    <div className='hidden xs:w-[30%] px-4 h-full md:flex sm:hidden flex-col gap-6 overflow-x-auto items-center'>
          <LeftSideBar />
        </div>
        <div className='flex w-[14%] md:hidden '>
          <Small_LeftSideBar />
        </div>

    {/* Main Profile Content */}
    <div className='h-screen flex flex-col gap-6 overflow-y-auto p-10 w-[50%] mr-8 border-l border-l-gray-600'>
        <form onSubmit={handlePostSubmit}>
            <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-white"} text-xl font-bold mb-4`}>Username</h2>
            <div className="mb-4">
                <textarea
                    className='w-full p-2 rounded border text-black'
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    rows="1"
                ></textarea>
            </div>
            <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-white"} text-xl font-bold mb-4`}>Email</h2>
            <div className="mb-4">
                <textarea
                    className="w-full p-2 border rounded text-black"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    rows="1"
                ></textarea>
            </div>
            <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-white"} text-xl font-bold mb-4`}>Fullname</h2>
            <div className="mb-0">
                <textarea
                    className="w-full p-2 border rounded text-black"
                    placeholder="Fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    rows="1"
                    color='black'
                ></textarea>
            </div>
            <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-white"} text-xl font-bold mb-4`}>Bio</h2>
            <div className="mb-4">
                <textarea
                    className="w-full p-2 border rounded text-black"
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="1"
                ></textarea>
            </div>
            <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-white"} text-xl font-bold mb-4`}>Profile picture</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} />
                    <div className="flex gap-2 mt-4">
                        {images && (
                            <div className="relative">
                                <img
                                    src={images} // Cloudinary URL
                                    alt="Uploaded image"
                                    className="w-30 h-30 object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={handleImageRemove}
                                    className="absolute top-0 right-0 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    <span className="text-xs font-bold">X</span>
                                </button>
                            </div>
                        )}
                    </div>
            <div className="flex justify-center gap-2">
                <button
                    type="submit"
                    className="px-4 mt-5 py-2 bg-customOrange font-semibold text-white rounded"
                >
                    Save
                </button>
            </div>
        </form>
    </div>
  </div>
  )
}

export default EditProfile