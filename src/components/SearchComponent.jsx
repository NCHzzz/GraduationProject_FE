import React from 'react';
import { useSelector } from 'react-redux';
const SearchComponent = ({ onClose }) => {
    const theme = useSelector((state) => state.theme);
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            {/* Close Button */}
            <button className='absolute top-5 right-5 text-lg' onClick={onClose}>
            &times; {/* Close Icon */}
            </button>
            <div className={`${theme === "light" ? "bg-white text-black border-black" : "bg-black text-white border"} rounded-lg p-4 w-3/4 h-3/4 md:w-1/2 max-h-screen overflow-y-auto`}>
                {/* Title and Input */}
                <h2 className="text-xl font-semibold mb-4">Search</h2>
                <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-customOrange mb-4 text-black"
                />
            </div>
    </div>
  );
}

export default SearchComponent;
