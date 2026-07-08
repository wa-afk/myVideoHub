import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import UserProfile from "./pages/user/UserProfile";
import { ProtectedRoute, ProtectedRouteHome } from "./components/ProtectedRoute";
import ResetPasswordEmail from "./pages/auth/ResetPasswordEmail";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Upload from "./pages/user/Upload";
import AllVideos from "./pages/AllVideos";
import Home from "./pages/Home";
import SingleVideo from "./pages/SingleVideo";
import MyVideos from "./pages/user/MyVideos";
import UpdateVideo from "./pages/user/UpdateVideo";
import Dashboard from "./pages/user/Dashboard";

export const router= createBrowserRouter ([
    {path: '/', element: <Home />},
    {path: '/video/:id', element: <SingleVideo />},
    {path: '/sign-up', element: <ProtectedRoute><SignUp /></ProtectedRoute>},
    {path: '/sign-in', element: <ProtectedRoute><SignIn /></ProtectedRoute>},
    {path: '/reset-password', element: <ProtectedRoute><ResetPasswordEmail /></ProtectedRoute>},
    {path: '/reset-password/:token', element: <ProtectedRoute><UpdatePassword /></ProtectedRoute>},
    {path: '/user/profile', element: <ProtectedRouteHome><UserProfile /></ProtectedRouteHome>},
    {path: '/user/dashboard', element: <ProtectedRouteHome><Dashboard /></ProtectedRouteHome>},
    {path: '/user/upload-video', element: <ProtectedRouteHome><Upload /></ProtectedRouteHome>},
    {path: '/user/edit/my-videos', element: <ProtectedRouteHome><MyVideos /></ProtectedRouteHome>},
    {path: '/user/edit/my-video', element: <ProtectedRouteHome><UpdateVideo /></ProtectedRouteHome>},
    {path: '/all-videos', element: <AllVideos />},
]);