import { useState } from "react";
import { useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; 

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { BookOpen, Pencil } from "lucide-react";

interface Book {
  title: string;
  author: string;
  available: boolean;
}

interface BookFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (book: { title: string; author: string; available: boolean }) => void;
  initialData?: { title: string; author: string; available: boolean };
  isEdit?: boolean;
}

export default function BookFormModal({
  open,
  onClose,
  onSubmit,
  initialData = { title: "", author: "", available: true },
  isEdit = false,
}: BookFormModalProps) {
  const [title, setTitle] = useState(initialData.title);
  const [author, setAuthor] = useState(initialData.author);
  const [editBook, setEditBook] = useState<Book | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialData.title || "");
      setAuthor(initialData.author || "");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!title.trim() || !author.trim()) {
      toast.error("Title and Author are required.");
      return;
    }

    onSubmit({ title: title.trim(), author: author.trim(), available: true });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-800 to-blue-900 text-white border border-gray-700 shadow-2xl">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-xl font-semibold">
            {isEdit ? <Pencil size={20} /> : <BookOpen size={20} />}
            {isEdit ? "Edit Book" : "Add Book"}
          </DialogTitle>

        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          <Input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white"
          >
            {isEdit ? "Update" : "Add"} Book
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
