import React, { useState } from "react";
import { X } from "lucide-react";

const TagsSection = ({ book, onChange, tags }) => {
  const bookTags = book.tags || [];
  const [currentTagInput, setCurrentTagInput] = useState("");

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tags
      </label>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {bookTags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
            >
              {tag}
              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...book,
                    tags: bookTags.filter((_, i) => i !== index),
                  });
                }}
                className="ml-1 text-blue-600 hover:text-blue-700"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentTagInput}
            onChange={(e) => setCurrentTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = currentTagInput.trim();
                if (value && !bookTags.includes(value)) {
                  onChange({ ...book, tags: [...bookTags, value] });
                  setCurrentTagInput("");
                }
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type a tag and press Enter"
          />
        </div>
        {tags.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">
              Existing tags (click to add):
            </p>
            <div className="flex flex-wrap gap-1">
              {tags.sort().map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (!bookTags.includes(tag)) {
                      onChange({ ...book, tags: [...bookTags, tag] });
                    }
                  }}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsSection;
