import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface ReturnButtonProps {
  borrowId: number;
  onReturned: () => void;
}

const ReturnButton: React.FC<ReturnButtonProps> = ({ borrowId, onReturned }) => {
  const handleReturn = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL
      await axios.post(
        `${apiUrl}/api/borrow/return`,
        { borrow_id: borrowId },
        { withCredentials: true }
      );
      toast.success("Book returned successfully");
      onReturned(); 
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to return book");
    }
  };

  return (
    <button
      onClick={handleReturn}
      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
    >
      Return
    </button>
  );
};

export default ReturnButton;
