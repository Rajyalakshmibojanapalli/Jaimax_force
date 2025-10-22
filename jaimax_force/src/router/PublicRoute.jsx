import { Navigate, Outlet } from "react-router-dom";


const PublicRoute = ({children}) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        return <Navigate to="/" />;
    } else {
        return <Outlet />;
    }
    return children;
};
export default PublicRoute;
