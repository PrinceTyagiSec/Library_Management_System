import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Modal from "./ui/Modal";
import { Loader2 } from "lucide-react";

const Register = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError, watch
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const passwordValue = watch("password");


  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "password") {

        const confirmPasswordInput = document.querySelector<HTMLInputElement>(
          'input[name="confirmPassword"]'
        );
        if (confirmPasswordInput) {
          confirmPasswordInput.setCustomValidity(
            confirmPasswordInput.value !== value.password
              ? "Passwords do not match."
              : ""
          );
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  const handleSubmitForm = async (data: any) => {
    const { password, confirmPassword } = data;


    try {
      setIsRegistering(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        ;
        toast.success(result.message || "Account Created Successfully!", {
          icon: <CheckCircle />,
          autoClose: 5000,
          position: "top-right",
        });
      } else {
        toast.error(result.error || "Registration failed. Please try again.", {
          icon: <AlertCircle />,
          autoClose: 5000,
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please check your connection.", {
        icon: <AlertCircle />,
      });
    } finally {
      setIsRegistering(false);
    }
  };



  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-blue-900 p-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md p-8 backdrop-blur-lg bg-gray-800/70 border border-gray-700 shadow-xl rounded-2xl"
      >
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold text-white text-center">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div className="relative flex items-center bg-gray-800 text-gray-200 border border-gray-700 rounded-lg">
                    {/* Icon inside the input field */}
                    <User className="absolute left-3 text-gray-400" />

                    {/* Input */}
                    <Input
                      {...field}
                      className="input-dark w-full py-3 pl-12 bg-transparent text-gray-200 border-none focus:outline-none focus:ring-0"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                )}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Email
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div className="relative flex items-center bg-gray-800 text-gray-200 border border-gray-700 rounded-lg">
                    <Mail className="absolute left-3 text-gray-400" />
                    <Input
                      type="email"
                      {...field}
                      className={`input-dark w-full py-3 pl-12 bg-transparent text-gray-200 border-none focus:outline-none focus:ring-0 ${errors.email ? "border-orange-300" : ""}`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                )}
              />
              {errors.email && (
                <p className="text-sm text-orange-300 flex items-center mt-2">
                  <AlertCircle className="mr-2" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Password
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="relative flex items-center bg-gray-800 text-gray-200 border border-gray-700 rounded-lg">
                    <Lock className="absolute left-3 text-gray-400" />
                    <Input
                      {...field}
                      type="password"
                      className={`input-dark w-full py-3 pl-12 bg-transparent text-gray-200 border-none focus:outline-none focus:ring-0 ${errors.password ? "border-orange-300" : ""}`}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                )}
              />
              {errors.password && (
                <p className="text-sm text-orange-300 flex items-center mt-2">
                  <AlertCircle className="mr-2" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Confirm Password
              </label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div className="relative flex items-center bg-gray-800 text-gray-200 border border-gray-700 rounded-lg">
                    <Lock className="absolute left-3 text-gray-400" />
                    <Input
                      {...field}
                      type="password"
                      className={`input-dark w-full py-3 pl-12 bg-transparent text-gray-200 border-none focus:outline-none focus:ring-0 ${errors.confirmPassword ? "border-orange-300" : ""}`}
                      placeholder="Confirm your password"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        const password = watch("password");
                        input.setCustomValidity(
                          input.value !== password ? "Passwords do not match." : ""
                        );
                      }}
                    />
                  </div>
                )}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-orange-300 flex items-center mt-2">
                  <AlertCircle className="mr-2" /> {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {/* Submit Button */}
            <Button
              type="submit"
              className={`w-full h-12 ${isRegistering ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

          </form>

          {/* Bottom text */}
          <p className="mt-4 text-center text-gray-300">
            Already have an account?{" "}
            <a href="/login" className="text-sm text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition">
              Login here
            </a>
          </p>
        </CardContent>
      </Card>

      {modalOpen && <Modal message={modalMessage} onClose={closeModal} />}
    </motion.div>

  );
};

export default Register;
