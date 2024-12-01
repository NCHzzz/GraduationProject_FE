// import {Outlet, Navigate, Route, Routes, useLocation} from "react-router-dom"
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import ResetPassword from "./pages/ResetPassword"
// import Explore from "./pages/Explore";
// import CreatePost from "./pages/CreatePost";
// import EditProfile  from "./pages/EditProfile";
// import { useSelector } from "react-redux";
// import OtherUserProfile from "./pages/OtherUserProfile";
// import Notification from "./pages/Notification";

// function Layout() {
//   const {user} = useSelector(state=> state.user);
//   const location = useLocation();

//   return user?.token? (
//     <Outlet/>
//   ):(
//     <Navigate to="/login" state={{from: location}} replace />
//   )
// }

// function App() {
//   const { theme } = useSelector((state) => state.theme);

//   return (
//     <div data-theme={theme} className="w-full min-h-[100vh]">
//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/home" element={<Home />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/profile/:userId" element={<OtherUserProfile />} /> 
//         </Route>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/explore" element={<Explore />} />
//         <Route path="/create-post" element={<CreatePost />} />
//         <Route path="/edit-profile" element={<EditProfile />} />
//         <Route path="/notification" element={<Notification />} />
//       </Routes>

//     </div>
//   );
// }
// export default App;

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from './components/Loading'; // A loading component to show while lazy loading

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const Profile = React.lazy(() => import('./pages/Profile'));
const OtherUserProfile = React.lazy(() => import('./pages/OtherUserProfile'));
const Register = React.lazy(() => import('./pages/Register'));
const Login = React.lazy(() => import('./pages/Login'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Explore = React.lazy(() => import('./pages/Explore'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const Notification = React.lazy(() => import('./pages/Notification'));
const CreatePost = React.lazy(() => import('./pages/CreatePost'));
// const Profile = React.lazy(() => {
//   console.log("Profile component is being loaded!");
//   return import("./pages/Profile");
// });

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      {/* Suspense wraps the routes for lazy loading */}
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Protected routes */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userName" element={<OtherUserProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/explore" element={<Explore />} />
          </Route>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;