import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash, CheckCircle, XCircle, Shield, UserRound, Users } from "lucide-react";
import UserFormModal from "@/components/ui/UserFormModal";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import FilterSection from "@/components/ui/Search&Filter";
import Pagination from "@/components/ui/Pagination";

type UsersResponse = {
  users: User[];
  totalPages: number;
};

type User = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  email_verified: boolean;
};

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const API_URL = `${import.meta.env.VITE_API_URL}/api/admin/user`;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchBy, setSearchBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();

      params.append("page", currentPage.toString());
      params.append("limit", "10");

      if (searchQuery) {
        params.append("search", searchQuery);
        params.append("searchBy", searchBy);
      }

      if (filterStatus && filterStatus !== "all") {
        params.append("verified", filterStatus);
      }
      const res = await axios.get<UsersResponse>(API_URL, { params, withCredentials: true });
      const data = res.data;
      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } else {
        console.error("Unexpected response:", data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      const interval = setInterval(() => {
        fetchUsers();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, searchQuery, searchBy, filterStatus, currentPage]);


  const handleAddUser = async (userData: { name: string; email: string; password?: string; is_admin: boolean }) => {
    if (!userData.password) {
      toast.error("Password is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(API_URL, userData, { withCredentials: true });
      await fetchUsers();

      toast.success("User added successfully!");
    } catch (err) {
      console.error("Error adding user", err);
      toast.error("Failed to add user.");
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  const handleUpdateUser = async (updatedData: { name: string; email: string; is_admin: boolean }) => {
    if (!editUser) return;

    setIsSubmitting(true);

    try {
      await axios.put(`${API_URL}/${editUser.id}`, {
        name: updatedData.name,
        email: updatedData.email,
        is_admin: updatedData.is_admin,
      }, { withCredentials: true });

      await fetchUsers();
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Error updating user", err);
      toast.error("Failed to update user.");
    } finally {
      setIsSubmitting(false);
      setEditUser(null);
      setIsModalOpen(false);
    }
  };


  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user", err);
      toast.error("Failed to delete user.");
    }
  };
  ;

  const handleSearchQueryChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterStatusChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleSearchByChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setSearchBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 text-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h2 className="flex items-center gap-2 text-2xl sm:text-3xl font-bold text-white">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          Manage Users
        </h2>
      </div>

      {/* Add Filter and Add User Button Below the Heading */}
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <FilterSection
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          filterStatus={filterStatus}
          setFilterStatus={handleFilterStatusChange}
          searchBy={searchBy}
          setSearchBy={handleSearchByChange}
          returnStatus=""
          setReturnStatus={() => { }}
          accountStatus=""
          setAccountStatus={() => { }}
          entityType="user"
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full md:w-auto"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add User
        </Button>
      </div>
<UserFormModal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={editUser ? handleUpdateUser : handleAddUser}  // Update based on edit mode
  initialData={editUser || undefined}  // Pass editUser data only if it's in edit mode
  isEdit={!!editUser}  // If there's an editUser, set isEdit to true
  isSubmitting={isSubmitting}
/>


      <div className="space-y-4">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No users found.</div>
        ) : (
          <>
            {users.map((user) => (
              <div
                key={`user-${user.id}`}
                className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 rounded-xl shadow-lg bg-gray-800 hover:bg-gray-700 transition duration-300"
              >

                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-sm text-gray-300">{user.email}</p>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mt-1 ${user.is_admin ? 'bg-blue-900 text-blue-400' : 'bg-gray-700 text-gray-300'}`}>

                    {user.is_admin ? <Shield className="w-3 h-3" /> : <UserRound className="w-3 h-3" />}
                    {user.is_admin ? "Admin" : "User"}
                  </span>
                  <div className="mt-1">
                    {user.email_verified ? (
                      <div className="flex items-center text-sm text-green-500">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Email Verified
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-red-500">
                        <XCircle className="w-4 h-4 mr-1" />
                        Email Not Verified
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 ease-in-out"

                    onClick={() => {
                      setEditUser(user);
                      setIsModalOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash className="w-4 h-4 mr-1" /> Delete
                  </Button>

                </div>
              </div>
            ))}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
}
