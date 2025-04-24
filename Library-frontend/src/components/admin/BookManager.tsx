import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash, Cookie, BookOpenText } from "lucide-react";
import BookFormModal from "@/components/ui/BookFormModal";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Undo } from "lucide-react";
import FilterSection from "@/components/ui/Search&Filter"
import Pagination from "@/components/ui/Pagination";

interface BookApiResponse {
  books: Book[];
  totalPages: number;
}

type Book = {
  id: number;
  title: string;
  author: string;
  available: boolean;
  isdeleted?: boolean;
};

export default function BookManager() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchBy, setSearchBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = `${import.meta.env.VITE_API_URL}/api/books/available`;

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchBooks = async () => {
      try {
        const response = await axios.get<BookApiResponse>(API_URL, {
          params: {
            search_query: searchQuery,
            filter_status: filterStatus,
            search_by: searchBy,
            page: currentPage,
            limit: 10,
          },
          withCredentials: true,
        });

        const data = response.data;
        if (Array.isArray(data.books)) {
          const normalizedBooks = data.books.map((book) => ({
            ...book,
            isdeleted: book.isdeleted ?? (book as any).is_deleted,
            available: book.available ?? (book as any).is_available,
          }));
          setBooks(normalizedBooks);
          setTotalPages(data.totalPages);
        } else {
          console.error("Unexpected response:", data);
          setBooks([]);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, [isAuthenticated, searchQuery, filterStatus, searchBy, currentPage]);



  const handleAddBook = async (bookData: { title: string; author: string; available: boolean }) => {
    try {
      const res = await axios.post(API_URL, bookData, {
        withCredentials: true,
      });
      setBooks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding book", err);
      toast.error("Failed to add book.");
    } finally {
      setIsModalOpen(false);
      setEditBook(null);
    }
  };


  const handleUpdateBook = async (updatedData: { title: string; author: string; available: boolean }) => {
    if (!editBook) return;

    try {
      await axios.put(`${API_URL}/${editBook.id}`, updatedData, { withCredentials: true });
      setBooks((prev) =>
        prev.map((book) =>
          book.id === editBook.id ? { ...book, ...updatedData } : book
        )
      );
      toast.success("Book updated successfully!");
    } catch (err) {
      console.error("Error updating book", err);
      toast.error("Failed to update book.");
    } finally {
      setEditBook(null);
      setIsModalOpen(false);
    }
  };

  const handleSoftDeleteBook = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Book deleted (soft)!");
      setBooks((prev) =>
        prev.map((book) =>
          book.id === id ? { ...book, isdeleted: true } : book
        )
      );
    } catch (err) {
      console.error("Error soft deleting book", err);
      toast.error("Failed to delete book.");
    }
  };

  const handleRestoreBook = async (id: number) => {
    try {
      await axios.put(`${API_URL}/restore/${id}`, {}, { withCredentials: true });
      toast.success("Book restored!");
      setBooks((prev) =>
        prev.map((book) =>
          book.id === id ? { ...book, isdeleted: false } : book
        )
      );
    } catch (err) {
      console.error("Error restoring book", err);
      toast.error("Failed to restore book.");
    }
  };
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
  ;

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <BookOpenText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Manage Books</h2>
        </div>
      </div>

      {/* Add Filter and Add Book Button Below the Heading */}
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <FilterSection
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          filterStatus={filterStatus}
          setFilterStatus={handleFilterStatusChange}
          searchBy={searchBy}
          setSearchBy={handleSearchByChange}
          entityType="book"
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 w-full md:w-auto"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Book
        </Button>
      </div>



      {/* Book List */}
      <div className="space-y-4">
        {books.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No books found.</div>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 rounded-2xl shadow-md transition-all duration-300 ease-in-out ${book.isdeleted
                  ? "bg-red-50 border border-red-200"
                  : "bg-gray-800 hover:bg-gray-700 hover:shadow-xl"
                }`}
            >

              <div>
                <p
                  className={`text-lg font-semibold ${book.isdeleted ? "line-through text-gray-500" : "text-white"
                    }`}
                >
                  {book.title}
                </p>
                <p
                  className={`text-sm ${book.isdeleted ? "line-through text-gray-400 italic" : "text-gray-400"
                    }`}
                >
                  by {book.author}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditBook(book);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 ease-in-out"

                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>

                {book.isdeleted ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreBook(book.id)}
                    className="flex items-center gap-1"
                  >
                    <Undo className="w-4 h-4" />
                    Restore
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleSoftDeleteBook(book.id)}
                    className="bg-red-600 hover:bg-red-700 text-white "
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Book Modal */}
      <BookFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditBook(null);
        }}
        onSubmit={editBook ? handleUpdateBook : handleAddBook}
        initialData={editBook || undefined}
        isEdit={!!editBook}
      />
    </div>
  );
}
