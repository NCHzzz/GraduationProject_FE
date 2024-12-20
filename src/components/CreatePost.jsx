import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import Map from './Map';
import { jwtDecode } from "jwt-decode";

const CreatePost = ({ open, onClose, setOpen }) => {
    const { theme } = useSelector((state) => state.theme);
    const user = useSelector((state) => state.user);
    const userID = "0f3d1261-e53e-4539-b36f-6f7e0ce2f0bf"; 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [notification, setNotification] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [images, setImages] = useState(''); 
    const [hashtags, setHashtags] = useState(''); // Track the hashtags
    const [address, setAddress] = useState("");
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.sub;
      // console.log('User ID:', userId);
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
            userID: userID, 
            title: title,
            content: description,
            location: address,
            imageUrl: images,
            shortDescription: shortDescription,
            hashtagNames: [hashtags]
        };
        console.log("post data: ",postData); // Check if imageUrls contains valid URLs


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
            setOpen(false);
            setNotification('Post created successfully!');
            setTimeout(() => setNotification(''), 3000);
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

    //Upload multiple images
    // const handleImageChange = (e) => {
    //     const newImages = Array.from(e.target.files); // Convert FileList to an array
    //     setImages((prevImages) => [...prevImages, ...newImages]); // Append new images to the existing array
    // };


    // const handleImageChange = async (e) => {
    //     setUploading(true); // Start the loader
    //     const files = Array.from(e.target.files);

    //     const cloudinaryUrls = await Promise.all(
    //         files.map(async (file) => {
    //             const formData = new FormData();
    //             formData.append("file", file);
    //             formData.append("upload_preset", "foodtalk");
    //             try {
    //                 const response = await api.post(
    //                     `https://api.cloudinary.com/v1_1/dre3daq6i/image/upload`,
    //                     formData
    //                 );
    //                 return response.data.secure_url;
    //             } catch (error) {
    //                 console.error("Error uploading to Cloudinary:", error);
    //                 return null;
    //             }
    //         })
    //     );

    //     console.log("cloudinaryUrls: ",cloudinaryUrls); // Ensure valid URLs


    //     setUploading(false); // Stop the loader
    //     // setImages((prevImages) => {
    //     //     const updatedImages = [...prevImages, ...cloudinaryUrls.filter(Boolean)];
    //     //     console.log('Updated images array:', updatedImages); // Debug
    //     //     return updatedImages;
    //     // });
    //     setImages((prevImages) => [...prevImages, ...cloudinaryUrls.filter(Boolean)]);
    // };

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
    

    if (!open) return null;


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`${theme === "light" ? "bg-white text-black border-black" : "bg-black text-white border"} file:rounded-lg rounded-lg p-4 w-3/4 md:w-1/2 max-h-[80vh] overflow-y-auto z-[10000]`}>
                <button className='absolute top-5 right-5 text-lg' onClick={onClose}>
                    &times;
                </button>
                {notification && (
                    <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2">
                        {notification}
                    </div>
                )}
                <form onSubmit={handlePostSubmit} className='z-[10000]'>
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
                        <button type="button" 
                            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-700" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" 
                            className="px-4 py-2 bg-customOrange text-white rounded hover:bg-orange-900"
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
