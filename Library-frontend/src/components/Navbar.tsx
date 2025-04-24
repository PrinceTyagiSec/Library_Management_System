import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleDashboardRedirect = () => {
    navigate(isAdmin ? "/admin/dashboard" : "/dashboard");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <nav className="h-16 bg-gradient-to-r from-gray-800 to-blue-900 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white">
          📚 Library
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white bg-blue-600 hover:bg-blue-500 focus:outline-none p-2 rounded-md"
        >
          {isOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white text-lg hover:text-blue-400 transition-all duration-300">
            Home
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                ref={profileButtonRef}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDropdown}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <User className="text-white" size={36} />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 bg-gray-800 shadow-lg rounded-md w-40 z-50"
                  >
                    <button
                      onClick={handleDashboardRedirect}
                      className="w-full text-left px-4 py-2 text-white bg-gradient-to-r from-blue-700 to-blue-800 rounded-t-md hover:bg-blue-900 transition-all duration-300"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-md shadow-md hover:bg-red-800 transition-all duration-300 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="text-white text-lg hover:text-blue-400 transition-all duration-300">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden w-full  bg-gradient-to-b from-gray-800 to-blue-900 shadow-md"
          >
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-white border-blue-600 border-b-2 text-lg px-4 py-2 rounded-md bg-gradient-to-r from-gray-800 to-blue-900 hover:from-blue-800 hover:to-blue-700 transition-all duration-300"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    handleDashboardRedirect();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white bg-gradient-to-r from-blue-700 to-blue-800 rounded-md hover:bg-blue-900"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-md hover:bg-red-800 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-white text-lg px-4 py-2 rounded-md bg-gradient-to-r from-gray-800 to-blue-900 hover:from-blue-800 hover:to-blue-700 transition-all duration-300"

              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
