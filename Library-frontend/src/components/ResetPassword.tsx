import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Password reset successful!");
        navigate("/login");
      } else {
        toast.error(data.error || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen px-4 bg-gradient-to-br from-gray-800 to-blue-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-gray-800/70 border border-gray-700 shadow-xl rounded-2xl backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">
          Reset Password
        </h2>

        <div className="relative flex items-center bg-gray-800 text-gray-200 border border-gray-700 rounded-lg mb-6">
          <Lock className="absolute left-3 text-gray-400" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-dark w-full py-3 pl-12 bg-transparent text-gray-200 border-none focus:outline-none focus:ring-0"
            placeholder="Enter your new password"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ResetPassword;
