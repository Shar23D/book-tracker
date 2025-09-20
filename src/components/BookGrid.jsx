import React from "react";
import { BookOpen } from "lucide-react";
import BookCard from "./BookCard";

const BookGrid = ({
  books,
  expandedNotes,
  toggleNote,
  onEdit,
  onDelete,
  onMoveToShelf,
  currentShelf,
  shelves,
}) => {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {currentShelf === "all"
            ? "Add your first book to get started"
            : `No books in ${shelves.find((s) => s.id === currentShelf)?.name.toLowerCase()}`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isNoteExpanded={expandedNotes[book.id]}
          onToggleNote={() => toggleNote(book.id)}
          onEdit={onEdit} // Click card to edit
          onDelete={onDelete}
          onMoveToShelf={onMoveToShelf}
        />
      ))}
    </div>
  );
};

export default BookGrid;
