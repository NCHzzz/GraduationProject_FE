// import { createSlice } from "@reduxjs/toolkit";
// const postSlice = createSlice({
//     name:'post',
//     initialState:{
//         posts:[],
//         selectedPost:null,
//     },
//     reducers:{
//         //actions
//         setPosts:(state,action) => {
//             state.posts = action.payload;
//         },
//         setSelectedPost:(state,action) => {
//             state.selectedPost = action.payload;
//         }
//     }
// });
// export const {setPosts, setSelectedPost} = postSlice.actions;
// export default postSlice.reducer;

// postSlice.js
// postsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;
