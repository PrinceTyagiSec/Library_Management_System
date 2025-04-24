import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { Loader2, MailCheck } from "lucide-react";
import { motion } from "framer-motion";

const ResendVerification: React.FC = () => {
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
      const errorMessage = searchParams.get("error");
      if (errorMessage === "TokenExpired") {
        toast.error("Your verification link has expired. Please request a new one.");
      }
    }
  }, [searchParams]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("Failed to resend verification link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md p-8 bg-gray-800/70 border border-gray-700 rounded-2xl shadow-xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Resend Verification Email
        </h1>

        <div className="relative flex items-center bg-gray-800 text-gray-200 border border-gray-700 rounded-lg mb-6">
          <MailCheck className="absolute left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 pl-12 pr-4 bg-transparent text-gray-200 border-none focus:outline-none focus:ring-0 rounded-lg"
          />
        </div>

        <button
          onClick={handleResend}
          disabled={isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center justify-center transition"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Sending...
            </>
          ) : (
            "Resend Verification Email"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ResendVerification;
