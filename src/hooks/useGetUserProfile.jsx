import { setUserProfile } from "../redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`https://localhost:7200/api/User/${userId}`, { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setUserProfile(res.data.user));
                } else {
                    console.log("Failed to fetch user profile:", res.data.message);
                }
            } catch (error) {
                console.log("Error fetching user profile:", error);
            }
        };
        if (userId) { 
            fetchUserProfile();
        }
    }, [dispatch, userId]); 
};

export default useGetUserProfile;