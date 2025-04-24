import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        if (
          data.message === "If this email exists, a reset link has been sent."
        ) {
          toast.success(data.message, { icon: <AlertCircle /> });
        } else {
          toast.success("Password reset link sent to your email!", {
            icon: <CheckCircle />,
          });
        }
      } else {
        toast.error(data.message || "Failed to send reset link.", {
          icon: <AlertCircle />,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        icon: <AlertCircle />,
      });
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center relative p-4 w-full overflow-hidden bg-gradient-to-br from-blue-900 to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      <Card className="w-full max-w-md p-8 backdrop-blur-lg bg-gray-800/70 border border-gray-700 shadow-xl rounded-2xl z-10">

        <CardHeader>
          <CardTitle className="text-4xl font-extrabold text-white text-center">
            Forgot Password
          </CardTitle>

        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Email
              </label>
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
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin mr-2 text-white" />
                  Sending...
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-gray-300">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition"
            >
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ForgotPassword;
