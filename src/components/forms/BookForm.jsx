import React from "react";
import ReadingDatesSection from "./ReadingDatesSection";
import TagsSection from "./TagSection";
import FormField from "./FormField";

const BookForm = ({ book, onChange, tags, onSubmit, onCancel, submitText }) => {
  const handleChange = (field, value) => {
    onChange({ ...book, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Title & Author */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Title *">
          <input
            type="text"
            value={book.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Book title"
          />
        </FormField>

        <FormField label="Author *">
          <input
            type="text"
            value={book.author}
            onChange={(e) => handleChange("author", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Author name"
          />
        </FormField>
      </div>

      {/* Pages, Rating, Spice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Pages">
          <input
            type="number"
            value={book.pages}
            onChange={(e) => handleChange("pages", e.target.value)}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </FormField>

        <FormField label="Rating (1-5)">
          <select
            value={book.rating}
            onChange={(e) => handleChange("rating", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Spice Rating (1-5)">
          <select
            value={book.spiceRating}
            onChange={(e) => handleChange("spiceRating", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select spice</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} pepper{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Format & Shelf */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Format">
          <select
            value={book.form}
            onChange={(e) => handleChange("form", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ebook">ebook</option>
            <option value="audiobook">audiobook</option>
          </select>
        </FormField>

        <FormField label="Shelf">
          <select
            value={book.shelf}
            onChange={(e) => handleChange("shelf", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="to-read">To Read</option>
            <option value="reading">Currently Reading</option>
            <option value="read">Read</option>
          </select>
        </FormField>
      </div>

      {/* Reading Dates & Tags */}
      <ReadingDatesSection book={book} onChange={onChange} />
      <TagsSection book={book} onChange={onChange} tags={tags} />

      {/* Notes */}
      <FormField label="Notes">
        <textarea
          value={book.note || ""}
          onChange={(e) => handleChange("note", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Thoughts or quotes"
        />
      </FormField>

      {/* Actions */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {submitText}
        </button>
      </div>
    </div>
  );
};

export default BookForm;
