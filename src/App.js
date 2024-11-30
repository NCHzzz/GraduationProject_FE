import {Outlet, Navigate, Route, Routes, useLocation} from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword"
import Explore from "./pages/Explore";
import CreatePost from "./pages/CreatePost";
import EditProfile  from "./pages/EditProfile";
import { useSelector } from "react-redux";
import OtherUserProfile from "./pages/OtherUserProfile";
import Notification from "./pages/Notification";

function Layout() {
  const { user } = useSelector(state=> state.user);
  const location = useLocation();

  return user?.token? (
    <Outlet/>
  ):(
    <Navigate to="/login" state={{from: location}} replace />
  )
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<OtherUserProfile />} /> 
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>

    </div>
  );
}
export default App;


// import React, { Suspense, lazy } from "react";
// import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ResetPassword from "./pages/ResetPassword";
// import Explore from "./pages/Explore";
// import OtherUserProfile from "./pages/OtherUserProfile";

// // Lazy loading the Profile page
// const Profile = lazy(() => import("./pages/Profile"));

// function Layout() {
//   const { user } = useSelector((state) => state.user);
//   const location = useLocation();

//   return user?.token ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/login" state={{ from: location }} replace />
//   );
// }

// function App() {
//   const { theme } = useSelector((state) => state.theme);

//   return (
//     <div data-theme={theme} className="w-full min-h-[100vh]">
//       {/* Wrapping routes with Suspense for lazy loading */}
//       <Suspense fallback={<div>Loading...</div>}>
//         <Routes>
//           <Route element={<Layout />}>
//             <Route path="/home" element={<Home />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/profile/:userName" element={<OtherUserProfile />} />
//           </Route>
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/explore" element={<Explore />} />
//         </Routes>
//       </Suspense>
//     </div>
//   );
// }

// export default App;
