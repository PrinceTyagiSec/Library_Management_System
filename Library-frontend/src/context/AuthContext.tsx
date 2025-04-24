import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  is_admin: boolean;
  exp?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  checkAuthStatus: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuthStatus = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        setIsAuthenticated(true);
        setIsAdmin(decoded.is_admin);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";

    setIsAuthenticated(false);
    setIsAdmin(false);

    window.dispatchEvent(new Event("tokenUpdate"));
    checkAuthStatus();
  };

  useEffect(() => {
    checkAuthStatus();
    const handleTokenUpdate = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleTokenUpdate);

    return () => {
      window.removeEventListener("storage", handleTokenUpdate);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, checkAuthStatus, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
