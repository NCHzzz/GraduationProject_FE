import { createSlice } from "@reduxjs/toolkit";
import { user as defaultUser } from "../assets/data";

// Safely parse the user data from localStorage
const getUserFromLocalStorage = () => {
  const storedUser = window?.localStorage.getItem("user");
  try {
    return storedUser ? JSON.parse(storedUser) : defaultUser;
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
    return defaultUser; // Fallback to default user data
  }
};

const initialState = {
  user: getUserFromLocalStorage(),
  edit: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      // state.user = null;
      // localStorage.removeItem("user");
      // localStorage.removeItem("token");
      state.user = null;
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch (error) {
        console.error("Error clearing localStorage during logout:", error);
      }
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
  },
});

export default userSlice.reducer;

export function UserLogin(user) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.login(user));
  };
}

// export function Logout() {
//   return (dispatch, getState) => {
//     dispatch(userSlice.actions.logout());
//   };
// }
export function Logout() {
  return (dispatch) => {
    dispatch(userSlice.actions.logout());
    window.location.href = "/login"; // Redirect to login page
  };
}


export function UpdateProfile(val) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.updateProfile(val));
  };
}
