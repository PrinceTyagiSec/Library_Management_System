import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  allowedRole: "admin" | "user";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  const [auth, setAuth] = useState<null | boolean>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    axios
      .get(`${apiUrl}/api/user/profile`, { withCredentials: true })
      .then((res) => {
        if (!res.data.id) {
          setAuth(false);
          return;
        }

        setIsAdmin(res.data.is_admin);
        setAuth(true);
      })
      .catch(() => {
        setAuth(false);
      });
  }, []);

  if (auth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  if (auth) {
    if (allowedRole === "admin" && !isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    if (allowedRole === "user" && isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
