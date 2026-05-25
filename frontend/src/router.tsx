import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import UserProfile from "./pages/user/UserProfile";
import { ProtectedRoute, ProtectedRouteHome } from "./components/ProtectedRoute";
import ResetPasswordEmail from "./pages/auth/ResetPasswordEmail";
import UpdatePassword from "./pages/auth/UpdatePassword";

export const router= createBrowserRouter ([
    {path: '/sign-up', element: <ProtectedRoute><SignUp /></ProtectedRoute>},
    {path: '/sign-in', element: <ProtectedRoute><SignIn /></ProtectedRoute>},
    {path: '/reset-password', element: <ProtectedRoute><ResetPasswordEmail /></ProtectedRoute>},
    {path: '/reset-password/:token', element: <ProtectedRoute><UpdatePassword /></ProtectedRoute>},
    {path: '/user/profile', element: <ProtectedRouteHome><UserProfile /></ProtectedRouteHome>},
])