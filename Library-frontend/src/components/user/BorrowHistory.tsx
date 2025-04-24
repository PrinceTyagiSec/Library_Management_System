import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReturnButton from "./ReturnButton";
import FilterSection from "@/components/ui/Search&Filter";
import Pagination from "@/components/ui/Pagination";
import { AlertTriangle, BookOpen, CalendarCheck, CalendarClock, CalendarDays, CheckCircle, Clock, Mail, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { motion } from "framer-motion";

interface BorrowRecord {
  borrow_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  book_title: string;
  book_author: string;
}

interface BorrowHistoryProps {
  onUserLoaded: (name: string, email: string) => void;
}

const BorrowHistory: React.FC<BorrowHistoryProps> = ({ onUserLoaded }) => {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);



  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("book");
  const [returnStatus, setReturnStatus] = useState("All");


  const fetchHistory = useCallback(async () => {
    setLoading(true);
    const params = {
      search: searchQuery,
      search_by: searchBy,
      return_status: returnStatus,
      page: currentPage,
      limit: 10,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL
      const res = await axios.get(`${apiUrl}/api/borrow/history`, {
        withCredentials: true,
        params,
      });
      const { user_name, user_email, history } = res.data;
      setRecords(history || []);
      setTotalPages(res.data.totalPages);

      onUserLoaded(user_name, user_email);
    } catch (err) {
      console.error("Failed to load borrow history", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, searchBy, returnStatus, currentPage, onUserLoaded]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchHistory();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchBy, returnStatus, fetchHistory]);
  
  const handleSearchQueryChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSearchByChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setSearchBy(value);
    setCurrentPage(1);
  };

  const handleReturnStatusChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setReturnStatus(value);
    setCurrentPage(1);
  };

  return (
    (
      <div className="p-6 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Borrow History</h2>
          </div>
        </div>

        <div className="mb-6">
          <FilterSection
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            filterStatus=""
            setFilterStatus={() => { }}
            searchBy={searchBy}
            setSearchBy={(val) => {
              setSearchBy(val);
              setCurrentPage(1);
            }}
            returnStatus={returnStatus}
            setReturnStatus={(val) => {
              setReturnStatus(val);
              setCurrentPage(1);
            }}
            accountStatus=""
            setAccountStatus={() => { }}
            entityType="userBorrowHistory"
          />
        </div>

        <TooltipProvider>
          <motion.div
            className="overflow-x-auto rounded-xl shadow-lg border border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-400 animate-pulse">Loading history...</p>
              </div>
            ) : (
              <table className="min-w-full text-sm bg-gray-800">
                <thead>
                  <tr className="border-b border-gray-600 text-xs uppercase tracking-wide text-gray-400">
                    <th className="p-3 text-left">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-1 text-blue-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Title</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white">User Full Name</TooltipContent>
                      </Tooltip>
                    </th>

                    <th className="p-3 text-left hidden md:table-cell">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-1 text-blue-500">
                            <User className="w-4 h-4" />
                            <span>Author</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>User Email</TooltipContent>
                      </Tooltip>
                    </th>

                    <th className="p-3 text-left">
                      <div className="inline-flex items-center gap-1 text-blue-500">
                        <CalendarCheck className="w-4 h-4" />
                        <span>Borrowed</span>
                      </div>
                    </th>

                    <th className="p-3 text-left hidden sm:table-cell">
                      <div className="inline-flex items-center gap-1 text-blue-500">
                        <CalendarClock className="w-4 h-4" />
                        <span>Due</span>
                      </div>
                    </th>

                    <th className="p-3 text-left">
                      <div className="inline-flex items-center gap-1 text-blue-500">
                        <Clock className="w-4 h-4" />
                        <span>Status</span>
                      </div>
                    </th>
                    <th className="p-3 text-left">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center gap-1 text-blue-500">
                            <CheckCircle className="w-4 h-4" />
                            <span>Return / Action</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Book Title & Author</TooltipContent>
                      </Tooltip>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-gray-500">
                        No borrow records found.
                      </td>
                    </tr>
                  ) : (
                    records.map((r, i) => (
                      <motion.tr
                        key={i}
                        className="border-b border-gray-600 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                      >
                        <td className="p-3">{r.book_title}</td>
                        <td className="p-3">{r.book_author}</td>
                        <td className="p-3">{new Date(r.borrow_date).toLocaleDateString()}</td>
                        <td className="p-3">{r.due_date ? new Date(r.due_date).toLocaleDateString() : "N/A"}</td>

                        <td className="p-3">
                          {r.return_date ? (
                            <span className="text-green-400">Returned</span>
                          ) : r.due_date && new Date(r.due_date) < new Date() ? (
                            <span className="text-red-500">Overdue</span>
                          ) : (
                            <span className="text-yellow-400">Not Returned</span>
                          )}
                        </td>
                        <td className="p-3">
                          {r.return_date ? (
                            <span>{new Date(r.return_date).toLocaleDateString()}</span>
                          ) : (
                            <ReturnButton borrowId={r.borrow_id} onReturned={fetchHistory} />
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </motion.div>
        </TooltipProvider>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

      </div>
    ));
};
export default BorrowHistory;
