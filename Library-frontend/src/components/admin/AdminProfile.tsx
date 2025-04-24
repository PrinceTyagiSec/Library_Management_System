import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Shield, User } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  role: string; 
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiUrl}/api/user/profile`, {
          withCredentials: true,
        });
        setUserData({
          name: res.data.name,
          email: res.data.email,
          role: res.data.is_admin ? "Admin" : "User", 
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center text-gray-300">Loading profile...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!userData) return <div className="text-center text-red-500">Failed to load profile.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">User Profile</h2>
      <div className="space-y-4 text-lg">
        <div className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded transition">
          <User className="text-blue-400 w-5 h-5" />
          <span><span className="font-medium text-blue-400">Name:</span> {userData.name}</span>
        </div>
        <div className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded transition">
          <Mail className="text-blue-400 w-5 h-5" />
          <span><span className="font-medium text-blue-400">Email:</span> {userData.email}</span>
        </div>
        <div className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded transition">
          <Shield className="text-blue-400 w-5 h-5" />
          <span><span className="font-medium text-blue-400">Role:</span> {userData.role}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
