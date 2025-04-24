import { Book, useBooks } from "../schema/bookSchema";
import { BookOpen, User, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Pagination from "@/components/ui/Pagination";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import FilterSection from "@/components/ui/Search&Filter";


const HeroSection = () => (
  <section className="h-[65vh] bg-gradient-to-r from-gray-800 to-blue-900 text-white flex items-center justify-center py-20">

    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-xl">
        Welcome to the Library Management System
      </h1>
      <p className="mt-6 text-base md:text-lg text-gray-200">
        Discover, Borrow, and Enjoy Books Anytime!
      </p>
    </div>
  </section>
);

const BookCard = ({ book, onBorrowSuccess }: { book: Book, onBorrowSuccess: () => void }) => {

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBorrow = async (bookId: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${apiUrl}/api/borrow`,
        { book_id: bookId },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      onBorrowSuccess();
    } catch (error: any) {
      console.error("Error borrowing book:", error);
      toast.error(error.response?.data?.message || "Borrow failed");
    }
  };

  return (
    <div className="bg-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-600 transition-transform transform hover:-translate-y-1 backdrop-blur-lg bg-gray-800/70">
      {/* Title & Icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">{book.title}</h2>
        </div>
        {/* Availability Badge */}
        <div className="flex items-center gap-1 text-sm font-medium">
          {book.available ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600">Available</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-600">Unavailable</span>
            </>
          )}
        </div>
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-2 text-gray-300 mt-2 text-sm">
        <User className="w-4 h-4" />
        <span>by <span className="text-white font-medium">{book.author}</span></span>
      </div>

      {/* Borrow Button */}
      {isAuthenticated ? (
        <button
          disabled={!book.available}
          onClick={() => book.available && handleBorrow(book.id)}
          className={`mt-6 w-full py-2 rounded-full text-sm font-medium transition ${book.available
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {book.available ? 'Borrow Now' : 'Not Available'}
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="mt-6 w-full py-2 rounded-full text-sm font-medium transition bg-blue-100 hover:bg-blue-200 text-blue-400"
        >
          Login to Borrow
        </button>
      )}

    </div>
  )
};


const BookSection = () => {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [filterStatus, setFilterStatus] = useState("all_books");

  useEffect(() => {
    if (searchInput !== searchQuery) {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }
  }, [searchInput]);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchBy, filterStatus]);

  const { data, isLoading, isError } = useBooks(
    currentPage,
    limit,
    searchQuery,
    searchBy,
    filterStatus
  );

  const books = data?.books || [];
  const queryClient = useQueryClient();
  const totalPages = data?.totalPages || 1;

  if (isError || !books) {
    return <div className="text-center py-10 text-red-500">Error fetching books.</div>;
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-gray-800 to-blue-900 w-full text-white">

      <div className="w-full mb-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">

          Explore Our Collection
        </h2>
      </div>

      {/* Filter Section */}
      {/* Filter Section */}
      <div className="w-full mb-8 flex justify-center items-center px-4 md:px-8">
        <div className="w-full max-w-4xl">  {/* This ensures a maximum width for the filter */}
          <FilterSection
            searchQuery={searchInput}
            setSearchQuery={setSearchInput}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            entityType="bookStatus"
          />
        </div>
      </div>


      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8 lg:px-16">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-400 text-lg">
            Loading books...</div>
        ) : books.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 text-lg">
            No books found.</div>
        ) : (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onBorrowSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["books", currentPage, limit] });
              }}
            />
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </section>

  );
};


const HomePage = () => (
  <div className="w-full">
    <HeroSection />
    <BookSection />
  </div>
);

export default HomePage;
