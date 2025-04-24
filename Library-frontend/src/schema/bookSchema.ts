import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
}
export const useBooks = (page: number, limit: number,  searchQuery: string,
  searchBy: string,
  filterStatus: string) => {
  return useQuery({
    queryKey: ["books", page, limit, searchQuery, searchBy, filterStatus], 
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL; 
        const response = await axios.get(`${apiUrl}/api/books/available`, {
          params: {
          page,
          limit,
          searchQuery,
          searchBy,
          filterStatus,
        },
      });
      return {
        books: response.data.books as Book[],
        totalPages: response.data.totalPages,
      };
    },
  });
};
