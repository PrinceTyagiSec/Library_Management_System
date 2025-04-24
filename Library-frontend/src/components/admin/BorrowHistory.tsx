import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, CalendarCheck, AlertTriangle, CalendarClock, User, Mail, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FilterSection from "@/components/ui/Search&Filter";
import Pagination from "@/components/ui/Pagination";
import { motion } from 'framer-motion';

interface BorrowRecord {
  borrow_id: string;
  borrow_date: string;
  due_date: string;
  return_date: string;
  user_name: string;
  user_email: string;
  book_title: string;
  book_author: string;
  account_status?: string; 
}

export default function BorrowHistory() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [borrowHistorySearchQuery, setBorrowHistorySearchQuery] = useState('');
  const [borrowHistorySearchBy, setBorrowHistorySearchBy] = useState('book');
  const [borrowReturnStatus, setBorrowReturnStatus] = useState('All');
  const [borrowAccountStatus, setBorrowAccountStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const params = {
          searchQuery: borrowHistorySearchQuery,
          searchBy: borrowHistorySearchBy,
          returnStatus: borrowReturnStatus,
          accountStatus: borrowAccountStatus,
          page: currentPage,
          limit: 10,
        };
        ;
        const apiUrl = import.meta.env.VITE_API_URL
        const response = await axios.get(`${apiUrl}/api/borrow/records`, {
          params,
          withCredentials: true,
        });
        ;
        setRecords(response.data.records);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        setError('Failed to load borrow records');
        setLoading(false);
      }
    };

    fetchData();
  }, [borrowHistorySearchQuery, borrowHistorySearchBy, borrowReturnStatus, borrowAccountStatus, currentPage]); 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500 animate-pulse flex items-center gap-2">
          <CalendarClock className="w-4 h-4 animate-spin" />
          Loading borrow history...
        </p>

      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  const handleSearchQueryChange: React.Dispatch<React.SetStateAction<string>> = (query) => {
    setBorrowHistorySearchQuery(query);
    setCurrentPage(1);
  };

  const handleSearchByChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setBorrowHistorySearchBy(value);
    setCurrentPage(1);
  };

  const handleReturnStatusChange: React.Dispatch<React.SetStateAction<string>> = (status) => {
    setBorrowReturnStatus(status);
    setCurrentPage(1);
  };

  const handleAccountStatusChange: React.Dispatch<React.SetStateAction<string>> = (status) => {
    setBorrowAccountStatus(status);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 text-white ">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Borrow History</h2>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <FilterSection
          searchQuery={borrowHistorySearchQuery}
          setSearchQuery={handleSearchQueryChange}
          filterStatus=""
          setFilterStatus={() => { }}
          searchBy={borrowHistorySearchBy}
          setSearchBy={handleSearchByChange}
          returnStatus={borrowReturnStatus}
          setReturnStatus={handleReturnStatusChange}
          accountStatus={borrowAccountStatus}
          setAccountStatus={handleAccountStatusChange}
          entityType="borrowHistory"
        />
      </div>
      <TooltipProvider>
        <motion.div
          className="overflow-x-auto rounded-xl shadow-lg border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <table className="min-w-full text-sm bg-gray-800">
            <thead>
              <tr className="border-b border-gray-600 text-xs uppercase tracking-wide text-gray-400">
                <th className="p-3 text-left">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center gap-1 text-blue-500">
                        <User className="w-4 h-4" />
                        <span>User</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black text-white">User Full Name</TooltipContent>
                  </Tooltip>
                </th>

                <th className="p-3 text-left hidden md:table-cell">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center gap-1 text-blue-500">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>User Email</TooltipContent>
                  </Tooltip>
                </th>

                <th className="p-3 text-left">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center gap-1 text-blue-500">
                        <BookOpen className="w-4 h-4" />
                        <span>Book</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Book Title & Author</TooltipContent>
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
                    <CalendarCheck className="w-4 h-4" />
                    <span>Returned</span>
                  </div>
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
                    className="border-b border-gray-600 hover:bg-gray-700  transition-all duration-300 ease-in-out"
                  >
                    <td className="p-3">
                      <div className="w-max flex items-center">
                        <span>{r.user_name}</span>
                        {r.account_status === "Deleted" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex items-center gap-1 ml-2 text-red-600">
                                <AlertTriangle className="w-4 h-4 cursor-pointer" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black text-white">
                              Account Deleted
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {r.account_status === "Active" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex items-center gap-1 ml-2 text-green-600">
                                <CheckCircle className="w-4 h-4 cursor-pointer" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black text-white">
                              Account Active
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      {r.user_email ? (
                        <span>{r.user_email}</span>
                      ) : (
                        <span className="text-red-500 italic">No email</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-100">
                          {r.book_title}
                        </span>
                        <span className="text-xs text-gray-400">{r.book_author}</span>
                      </div>
                    </td>
                    <td className="p-3">{new Date(r.borrow_date).toLocaleDateString()}</td>
                    <td className="p-3 hidden sm:table-cell">{new Date(r.due_date).toLocaleDateString()}</td>
                    <td className="p-3">
                      {r.return_date ? (
                        <div className="inline-flex items-center gap-1 text-green-500 font-medium">
                          <CalendarCheck className="w-4 h-4" />
                          {new Date(r.return_date).toLocaleDateString()}
                        </div>
                      ) : new Date(r.due_date) < new Date() ? (
                        <div className="inline-flex items-center gap-1 text-red-500 font-semibold">
                          <AlertTriangle className="w-4 h-4 animate-pulse" />
                          Overdue
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-gray-300 font-medium">
                          <CalendarClock className="w-4 h-4 animate-pulse" />
                          Not Returned
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </TooltipProvider>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
