import {Outlet, Navigate, Route, Routes, useLocation} from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword"
import { useSelector } from "react-redux";

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
          <Route path='/' element={<Home />} />
          <Route paath='/profile/:id?' element={<Profile />}></Route>
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        <Route path="/profile" element={<Profile />} />

        
      </Routes>

    </div>
  );
}

export default App;
