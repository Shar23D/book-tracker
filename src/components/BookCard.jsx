import React from "react";
import { Star, Flame, StickyNote, X, Trash2 } from "lucide-react";

const BookCard = ({
  book,
  isNoteExpanded,
  onToggleNote,
  onEdit,
  onDelete,
  onMoveToShelf,
}) => {
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));

  const renderSpice = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Flame
        key={i}
        size={16}
        className={i < rating ? "text-red-500 fill-current" : "text-gray-300"}
      />
    ));

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
      {/* Clicking the card (except buttons) triggers edit */}
      <div onClick={() => onEdit(book)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
        <p className="text-gray-600 mb-2">by {book.author}</p>

        {book.pages > 0 && <p className="text-sm text-gray-500 mb-2">{book.pages} pages</p>}

        <div className="flex items-center space-x-4 mb-2">
          {book.rating > 0 && <div className="flex items-center space-x-1">{renderStars(book.rating)}</div>}
          {book.spiceRating > 0 && <div className="flex items-center space-x-1">{renderSpice(book.spiceRating)}</div>}
        </div>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${book.form === "audiobook" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
            }`}
        >
          {book.form}
        </span>

        {/* Tags */}
        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {book.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Collapsible Note */}
      {book.note && isNoteExpanded && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg relative">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onToggleNote();
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
          <p className="text-sm text-gray-700 pr-6">{book.note}</p>
        </div>
      )}

      {/* Shelf Selector */}
      <select
        value={book.shelf}
        onClick={(e) => e.stopPropagation()} // Prevent modal opening
        onChange={(e) => onMoveToShelf(book.id, e.target.value)}
        className="w-full mt-3 px-3 py-2 border rounded-lg text-sm"
      >
        <option value="to-read">To Read</option>
        <option value="reading">Currently Reading</option>
        <option value="read">Read</option>
      </select>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent modal opening
          onDelete(book.id);
        }}
        className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
      >
        <Trash2 size={16} /> Delete
      </button>
    </div>
  );
};

export default BookCard;
