import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface CustomJwtPayload {
  is_admin: boolean;
  exp?: number;
  iat?: number;
}

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus, isAdmin, isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get("message");
    const messageType = queryParams.get("messageType");
    const error = queryParams.get("error");

    if (error) {
      toast.error(error, { icon: <AlertCircle /> });
    }

    if (message) {
      if (messageType === "success") {
        toast.success(message, { icon: <CheckCircle /> });
      } else if (messageType === "error") {
        toast.error(message, { icon: <AlertCircle /> });
      }
    }


    const newUrl = window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: "include",
      });

      const data = await response.json();
      ;

      if (response.ok) {
        const token = data.token;
        ;
        if (token) {
          toast.success("Login Successful!", { icon: <CheckCircle /> });
          checkAuthStatus();

          window.dispatchEvent(new Event("tokenUpdate"));


          ;
        }
      } else {
        if (data.error === "Invalid credentials") {
          toast.error("The email or password you entered is incorrect.", { icon: <AlertCircle /> });
        } else {
          toast.error(data.message || "Login failed. Please try again.", { icon: <AlertCircle /> });
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please check your connection.", {
        icon: <AlertCircle />,
      });
    } finally {
      setLoading(false); // Set loading back to false once the request completes
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin/dashboard" : "/dashboard");
    }
  }, [isAuthenticated, isAdmin]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center relative p-4 w-full overflow-hidden bg-gradient-to-br from-blue-900 to-gray-900"

      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Login Card */}
      <Card className="w-full max-w-md p-8 backdrop-blur-lg bg-gray-800/70 border border-gray-700 shadow-xl rounded-2xl z-10"
      >
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold text-blue-400 text-center"
          >
            Welcome Back
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative flex items-center bg-gray-800 text-gray-200 border border-gray-700 rounded-lg">
              <Mail className="absolute left-3 text-gray-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark w-full py-3 pl-12 bg-transparent text-gray-200 border-none focus:outline-none focus:ring-0"
                placeholder="Enter your email"
                required
              />
            </div>


            <div className="relative flex items-center bg-gray-800 text-gray-200 border border-gray-700 rounded-lg">
              <Lock className="absolute left-3 text-gray-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark w-full py-3 pl-12 bg-transparent text-gray-200 border-none focus:outline-none focus:ring-0"
                placeholder="Enter your password"
                required
              />
            </div>


            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-200"
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember Me
              </label>

              <Link
                to="/forgotpassword"
                className="text-sm text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition"
              >
                Forgot Password?
              </Link>
            </div>
            <Button
  type="submit"
  className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center"
  disabled={loading} // Add this to disable the button during loading
>
  {loading ? (
    <Loader2 className="h-5 w-5 animate-spin" />
  ) : (
    "Login"
  )}
</Button>

            <hr className="border-gray-300 opacity-30 my-6" />

            <div className="text-center mt-8">
              <p className="text-sm text-gray-200 font-medium">
                Don’t have an account?
                <Link
                  to="/register"
                  className="ml-1 text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition"
                >
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
export default LoginForm;
