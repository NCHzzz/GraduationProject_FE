import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: JSON.parse(window?.localStorage.getItem("theme")) ?? "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem("theme", JSON.stringify(action.payload));
    },
  },
});

export default themeSlice.reducer;

export function SetTheme(value) {
  return (dispatch) => {
    dispatch(themeSlice.actions.setTheme(value));
  };
}

// src/themes.js
export const themes = {
  light: {
    background: '#ffffff',
    color: '#000000',
    primary: '#007bff',
    // Add more styles as needed
  },
  dark: {
    background: '#000000',
    color: '#ffffff',
    primary: '#1e1e1e',
    // Add more styles as needed
  },
};


// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   theme: "light", // Default theme
// };

// const themeSlice = createSlice({
//   name: "theme",
//   initialState,
//   reducers: {
//     SetTheme(state, action) {
//       state.theme = action.payload; // Update the theme based on action payload
//     },
//   },
// });

// export const { SetTheme } = themeSlice.actions;
// export default themeSlice.reducer;
