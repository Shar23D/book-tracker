import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import BookForm from "../forms/BookForm";

const BookModal = ({ mode = "add", initialBook = null, tags, onClose, onSubmit }) => {
  const emptyBook = {
    title: "",
    author: "",
    pages: "",
    rating: "",
    spiceRating: "",
    tags: [],
    note: "",
    form: "ebook",
    shelf: "to-read",
    readingDates: [],
  };

  const [bookData, setBookData] = useState(initialBook || emptyBook);

  // Update bookData whenever initialBook changes
  useEffect(() => {
    setBookData(initialBook || emptyBook);
  }, [initialBook]);

  const handleSubmit = async () => {
    const success = await onSubmit(bookData);
    if (success) {
      if (mode === "add") setBookData(emptyBook);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "add" ? "Add New Book" : "Edit Book"}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <BookForm
            book={bookData}
            onChange={setBookData}
            tags={tags}
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitText={mode === "add" ? "Add Book" : "Save Changes"}
          />
        </div>
      </div>
    </div>
  );
};

export default BookModal;
