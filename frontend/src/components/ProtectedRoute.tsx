import { Navigate, type RouteProps } from "react-router-dom";

const isNotExpired = (token: string | null) => {
    if (!token) return false;
    try {
        const payload = token.split('.')[1];
        // Replace all (/g for global) occurrences of -, _ with +, / to convert url to standard ascii (base64)
        const ascii = payload.replace('/-/g', '+').replace('/_/g', '/');
        // window.atob() for ascii to binary
        const jsonPayload = JSON.parse(window.atob(ascii));
        const currentTime = Math.floor(Date.now() / 1000);  // sec to ms
        if (jsonPayload.exp < currentTime) {
            localStorage.removeItem("token");
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};

// route to be used for all logged in user (redirect to signin page if not logged in)
export const ProtectedRouteHome: React.FC<RouteProps>= ({ children }) => {
    const token= localStorage.getItem("token");
    return isNotExpired(token)? children: <Navigate to={'/sign-in'}></Navigate>;
};

//route to be used when user tries to log in (instead show profile if already logged in)
export const ProtectedRoute: React.FC<RouteProps>= ({ children }) => {
    const token= localStorage.getItem("token");
    return isNotExpired(token)? <Navigate to={'/user/profile'}></Navigate>: children;
};