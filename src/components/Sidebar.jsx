import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";

const Sidebar = ({
  shelves,
  currentShelf,
  setCurrentShelf,
  books,
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  tags,
  clearFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      {/* Shelves */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Shelves</h2>
        <div className="space-y-2">
          {shelves.map((shelf) => {
            const Icon = shelf.icon;
            const count =
              shelf.id === "all"
                ? books.length
                : books.filter((book) => book.shelf === shelf.id).length;

            return (
              <button
                key={shelf.id}
                onClick={() => setCurrentShelf(shelf.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${currentShelf === shelf.id
                    ? "bg-blue-100 text-blue-900"
                    : "hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} />
                  <span>{shelf.name}</span>
                </div>
                <span className="text-sm text-gray-500">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <Filter size={20} />
          <span>Advanced Filters</span>
        </button>

        {showFilters && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={filters.author}
                onChange={(e) =>
                  setFilters({ ...filters, author: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="relative">
                <select
                  multiple
                  value={filters.tags}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      tags: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  size={Math.min(Math.max(tags.length, 3), 6)}
                >
                  {tags.sort().map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  Hold Ctrl/Cmd to select multiple tags
                </div>
                {filters.tags.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-1">Selected:</div>
                    <div className="flex flex-wrap gap-1">
                      {filters.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              setFilters({
                                ...filters,
                                tags: filters.tags.filter((t) => t !== tag),
                              });
                            }}
                            className="ml-1 text-blue-600 hover:text-blue-700"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pages</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPages}
                  onChange={(e) =>
                    setFilters({ ...filters, minPages: e.target.value })
                  }
                  className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPages}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPages: e.target.value })
                  }
                  className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex space-x-2">
                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters({ ...filters, minRating: e.target.value })
                  }
                  className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Min</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.maxRating}
                  onChange={(e) =>
                    setFilters({ ...filters, maxRating: e.target.value })
                  }
                  className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Max</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Spice Rating
              </label>
              <div className="flex space-x-2">
                <select
                  value={filters.minSpice}
                  onChange={(e) =>
                    setFilters({ ...filters, minSpice: e.target.value })
                  }
                  className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Min</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.maxSpice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxSpice: e.target.value })
                  }
                  className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Max</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Format</label>
              <select
                value={filters.form}
                onChange={(e) =>
                  setFilters({ ...filters, form: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">All</option>
                <option value="ebook">ebook</option>
                <option value="audiobook">audiobook</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
