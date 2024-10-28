import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CreatePost = ({ open, setOpen }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const { theme } = useSelector((state) => state.theme);

    const handlePostSubmit = (e) => {
        e.preventDefault();
        // Perform the post submission logic here, such as sending data to the backend
        console.log('Post content:', content);
        console.log('Selected image:', image);

        // Reset the form and close the modal
        setContent('');
        setImage(null);
        setOpen(false);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Get the first selected file
    };

    if (!open) return null; // Do not render if the modal is not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`${theme === "light" ? "bg-white text-black border-black" : "bg-black text-white border"} rounded-lg p-4 w-3/4 md:w-1/2 max-h-screen overflow-y-auto`}>
                <form onSubmit={handlePostSubmit}>
                <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-customOrange"} text-xl font-bold mb-4`}>Title</h2>
                    <div className="mb-4">
                        <textarea
                            className={`${theme === "light" ? "bg-white text-black" : "bg-grey text-black"} w-full p-2 rounded border`}
                            placeholder="Post Title"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="2"
                        ></textarea>
                    </div>
                    <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-customOrange"} text-xl font-bold mb-4`}>Description</h2>
                    <div className="mb-4">
                        <textarea
                            className="w-full p-2 border rounded text-black"
                            placeholder="Description"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                        ></textarea>
                    </div>
                    <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-customOrange"} text-xl font-bold mb-4`}>Hashtag</h2>
                    <div className="mb-0">
                        <textarea
                            className="w-full p-2 border rounded text-black"
                            placeholder="Hashtag"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="2"
                            color='black'
                        ></textarea>
                    </div>
                    <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-customOrange"} text-xl font-bold mb-4`}>Location</h2>
                    <div className="mb-4">
                        <textarea
                            className="w-full p-2 border rounded text-black"
                            placeholder="Location"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="1"
                        ></textarea>
                    </div>
                    <h2 className={`${theme === "light" ? "bg-white text-black" : "bg-grey-400 text-customOrange"} text-xl font-bold mb-4`}>Images</h2>
                    <div className="mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-400 rounded"
                            onClick={() => setOpen(false)} 
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-customOrange text-white rounded"
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
