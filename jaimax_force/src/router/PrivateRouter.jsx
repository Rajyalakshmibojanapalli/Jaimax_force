// src/router/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const token = localStorage.getItem("accessToken");
  const user = useSelector((state) => state.auth.user);

  // Still checking Redux hydration
  if (token && user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-[#FFD700]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FFD700] mb-4"></div>
          <p className="text-sm text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // No token → go to login
  if (!token) return <Navigate to="/login" replace />;

  // Authenticated → show nested route
  return <Outlet />;
};

export default PrivateRoute;
