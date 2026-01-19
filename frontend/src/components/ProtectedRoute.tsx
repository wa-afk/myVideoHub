import { Navigate, type RouteProps } from "react-router-dom";

// route to be used for all logged in user (redirect to signin page if not logged in)
export const ProtectedRouteHome: React.FC<RouteProps>= ({ children }) => {
    const token= localStorage.getItem("token")
    return token? children: <Navigate to={'/sign-in'}></Navigate>
}

//route to be used when user tries to log in (instead show profile if already logged in)
export const ProtectedRoute: React.FC<RouteProps>= ({ children }) => {
    const token= localStorage.getItem("token")
    return token? <Navigate to={'/user/profile'}></Navigate>: children
}