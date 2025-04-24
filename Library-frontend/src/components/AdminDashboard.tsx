"use client";

import { useState, useEffect } from "react";
import BookManager from "@/components/admin/BookManager";
import BorrowHistory from "@/components/admin/BorrowHistory";
import UserManager from "@/components/admin/UserManager";
import AdminProfile from "@/components/admin/AdminProfile";
import { Book, History, Users, User } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="admin-dashboard min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-800 to-blue-900 text-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        {/* Mobile: Dropdown select */}
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full bg-gray-900 border border-gray-700 text-white">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border border-gray-600">
                <SelectItem value="profile">Admin Profile</SelectItem>
                <SelectItem value="books">Manage Books</SelectItem>
                <SelectItem value="history">Borrow History</SelectItem>
                <SelectItem value="users">User Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (

          <TabsList className="bg-gray-900 border border-gray-700 p-2 rounded-2xl w-full flex justify-center gap-4 mb-6 shadow-inner">
            <TabsTrigger
              value="profile"
              className="px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-300 hover:bg-blue-500/30 transition"
            >
              <User className="w-5 h-5" />
              Admin Profile
            </TabsTrigger>
            <TabsTrigger
              value="books"
              className="px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-300 hover:bg-blue-500/30 transition"
            >
              <Book className="w-5 h-5" />
              Manage Books
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-300 hover:bg-blue-500/30 transition"
            >
              <History className="w-5 h-5" />
              Borrow History
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-300 hover:bg-blue-500/30 transition"
            >
              <Users className="w-5 h-5" />
              User Manager
            </TabsTrigger>
          </TabsList>
        )}

        {/* Content Area */}
        <motion.div
          className="bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-lg p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TabsContent value="profile">
            <AdminProfile />
          </TabsContent>
          <TabsContent value="books">
            <BookManager />
          </TabsContent>
          <TabsContent value="history">
            <BorrowHistory />
          </TabsContent>
          <TabsContent value="users">
            <UserManager />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
