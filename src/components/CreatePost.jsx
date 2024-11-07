import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CreatePost = ({ open, setOpen }) => {
    const { theme } = useSelector((state) => state.theme);
    const user = useSelector((state) => state.user);
    const userID = "0f3d1261-e53e-4539-b36f-6f7e0ce2f0bf"; 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hashtag, setHashtag] = useState([]);
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [hashtags, setHashtags] = useState([]);
    const [notification, setNotification] = useState('');
    const [shortDescription, setShortDescription] = useState('');

    // useEffect(() => {
    //     const fetchHashtags = async () => {
    //         try {
    //             const response = await axios.get('https://localhost:7200/api/Hashtag/all');
    //             setHashtags(response.data);
    //         } catch (error) {
    //             console.error('Error fetching hashtags:', error);
    //         }
    //     };

    //     fetchHashtags();
    // }, []);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        // Basic validation
        // if (!title || !description || !hashtag || !location) {
        //     setNotification('Please fill in all required fields.');
        //     return;
        // }
        if (!title || !description || !location) {
            setNotification('Please fill in all required fields.');
            return;
        }

        // Create a plain JavaScript object to hold the form data
        const postData = {
            userID: userID, // Use current user's ID or default ID
            title: title,
            content: description,
            location: location,
            shortDescription: shortDescription,
            hashtagIds: [hashtag], // Assuming hashtag is the ID
            imageUrl: image ? URL.createObjectURL(image) : null // Convert image to URL if selected
        };

        // Log postData for debugging
        console.log('Post data:', postData);

        try {
            console.log('Sending POST request to API...');
            const response = await axios.post('https://localhost:7200/api/Post', postData
);
            console.log('Post created successfully:', response.data);

            // Reset form fields
            setTitle('');
            setDescription('');
            setHashtag('');
            setLocation('');
            setImage(null);
            setShortDescription('');
            setOpen(false);

            // Show notification
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

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`${theme === "light" ? "bg-white text-black border-black" : "bg-black text-white border"} rounded-lg p-4 w-3/4 md:w-1/2 max-h-screen overflow-y-auto`}>
                {notification && (
                    <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2">
                        {notification}
                    </div>
                )}
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
                    {/* <select
                        className={`${theme === "light" ? "bg-white" : "bg-grey"} text-black w-full p-2 rounded border`}
                        value={hashtag}
                        onChange={(e) => setHashtag(e.target.value)}
                    >
                        <option value="">Select a hashtag</option>
                        {hashtags.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select> */}
                    <textarea
                        className={`${theme === "light" ? "bg-white" : "bg-grey"} text-black w-full p-2 rounded border`}
                        placeholder="Hashtag"
                        value={hashtag}
                        onChange={(e) => setHashtag(e.target.value)}
                        rows="1"
                    />
                    <h2 className="text-xl font-bold mb-4">Location</h2>
                    <textarea
                        className={`${theme === "light" ? "bg-white" : "bg-grey"} text-black w-full p-2 rounded border`}
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        rows="1"
                    />
                    <h2 className="text-xl font-bold mb-4">Images</h2>
                    <input type="file" accept="image/*" onChange={handleImageChange} />

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
