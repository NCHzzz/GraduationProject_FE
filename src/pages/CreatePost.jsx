import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import Map from '../components/Map';
import { jwtDecode } from "jwt-decode";
import LeftSideBar from '../components/LeftSideBar'; 
import Small_LeftSideBar from '../components/Small_LeftSideBar';
import { Link } from 'react-router-dom';
import { NoProfile } from "../assets";
import { BsPersonFillAdd } from "react-icons/bs";
import { suggest} from "../assets/data";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const NotificationPopup = ({ message }) => {
    return (
        <div className="fixed top-4 right-4 bg-green-500 font-semibold text-white px-4 py-2 rounded shadow-lg z-50">
            <p>{message}</p>
        </div>
    );
};

const CreatePost = () => {
    const { theme } = useSelector((state) => state.theme);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [notification, setNotification] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [images, setImages] = useState(''); 
    const [hashtags, setHashtags] = useState('');
    const [address, setAddress] = useState("");
    const [uploading, setUploading] = useState(false);
    const [suggestedFriends, setSuggestedFriends] = useState(suggest);
    const [popupVisible, setPopupVisible] = useState(false); 

    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.sub;
    } else {
      console.log('No token found!');
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        if (!title || !description || !address || !hashtags ) {
            setNotification('Please fill in all required fields.');
            return;
        }
        const postData = {
            userID: userId, 
            title: title,
            content: description,
            location: address,
            imageUrl: images,
            shortDescription: shortDescription,
            hashtagNames: [hashtags]
        };

        try {
            console.log('Sending POST request to API...');
            const response = await api.post('/api/Post', postData,
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                    },
                }
        );
            console.log('Post created successfully:', response.data);
            setTitle('');
            setDescription('');
            setHashtags('');
            // setLocation('');
            setAddress('');
            setImages('');
            setShortDescription('');

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
    <>
        {popupVisible && (
            <NotificationPopup
                message="Post created successfully!"
                onClose={() => setPopupVisible(false)}
            />
        )}
      <div className={`w-full h-full px-0 lg:px-0  bg-bgColor ${theme === "light" ? "bg-white text-black" : "bg-black text-white"} lg:rounded-lg h-screen overflow-hidden `}>
        {/* <TopBar /> */}
        <div className='w-full flex h-full'>
          {/* LEFT */}
          <div className='hidden xs:w-[20%] px-4 h-full md:flex sm:hidden flex-col gap-6 overflow-x-auto items-center'>
            <LeftSideBar />
          </div>
          <div className='flex w-[14%] md:hidden '>
            <Small_LeftSideBar />
          </div>
          {/* CENTER */}
          <div className='w-full flex h-screen md:w-[60%] sm:w-[100%] border-l border-r border-l-gray-700 border-r-gray-700 flex-col gap-0 overflow-y-auto pt-4 p-10'>
            <form onSubmit={handlePostSubmit}>
                    <h2 className="text-xl font-bold mb-4">Title</h2>
                    <textarea
                        className={`${theme === "light" ? "bg-white" : "bg-grey"} text-black w-full p-2 rounded border`}
                        placeholder="Post Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        rows="2"
                    />
                    <h2 className="text-xl font-bold mb-4">Description</h2>
                    <textarea
                        className={`${theme === "light" ? "bg-white" : "bg-grey"} text-black w-full p-2 rounded border`}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                    />
                    <h2 className="text-xl font-bold mb-4">Short Description</h2>
                    <textarea
                        className={`${theme === "light" ? "bg-white" : "bg-grey"} text-black w-full p-2 rounded border`}
                        placeholder="Short Description"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        rows="2"
                    />
                    <h2 className="text-xl font-bold mb-4">Hashtag</h2>
                    <textarea
                        className={`${theme === "light" ? "bg-white" : "bg-grey"} text-black w-full p-2 rounded border`}
                        placeholder="Enter hashtags (e.g., #food, #travel)"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                        rows="1"
                    />
                    <h2 className="text-xl font-bold mb-4">Location</h2>
                    {/* Address input */}
                    <textarea
                        className="bg-white text-black w-full p-2 rounded border pr-10"
                        placeholder="Enter location or use map to find it"
                        value={address} // Display current address
                        onChange={(e) => setAddress(e.target.value)} // Allow manual edits
                        rows="1"
                    />
                    <div>
                        <div className="map-container w-full h-30">
                        {/* Map component */}
                        <Map
                            readonly={false} // Allow interaction
                            location={coordinates} // Pass current coordinates
                            onChange={(updatedCoordinates) => {
                            // Update coordinates and address from map
                            setCoordinates(updatedCoordinates);
                            setAddress(updatedCoordinates.address || ""); // Store map-provided address
                            }}
                            className="w-full h-full"
                        />
                        </div>
                    </div>

                    {/* <h2 className="text-xl font-bold mb-4">Images</h2>
                    <input type="file" accept="image/*" onChange={handleImageChange} multiple={false} />
                    <div className="flex gap-2 mt-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative">
                
                                <img
                                    src={image} // Cloudinary URL
                                    alt={`Uploaded image ${index + 1}`}
                                    className="w-30 h-30 object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImageRemove(index)}
                                    className="absolute top-0 right-0 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    <span className="text-xs font-bold">X</span>
                                </button>
                            </div>
                        ))}
                    </div> */}
                    <h2 className="text-xl font-bold mb-4">Images</h2>
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
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="submit" 
                            className="px-4 py-2 bg-customOrange text-white rounded hover:bg-orange-900"
                        >
                            Post
                        </button>
                    </div>
                </form>
          <div >
        </div>
            
          </div>

          {/* RIGHT */}
          <div className='hidden w-[30%]  h-full lg:flex flex-col overflow-y-auto'>
            <div className={`w-[90%]  px-0 lg:px-2 mt-3 bg-bgColor ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}  lg:rounded-lg h-screen overflow-hidden `}>
                
                <div className='p-4 rounded-2xl my-4 border border-gray-700'>
                    <h1 className='font-bold text-lg'>Who to follow</h1>
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
      </div>
    </>                   
  );
}

export default CreatePost