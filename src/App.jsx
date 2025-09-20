import React, { useState, useEffect } from "react";
import { BookOpen, BarChart3, Plus, LogOut } from "lucide-react";
import { useBooks } from "./hooks/useBooks";
import { filterBooks } from "./utils/bookUtils";
import Sidebar from "./components/Sidebar";
import BookGrid from "./components/BookGrid";
import BookModal from "./components/modals/BookModal";
import StatisticsPage from "./components/StatisticsPage";
import Auth from "./components/Auth";
import { supabase } from "./supabaseClient";

const App = () => {
  const {
    user: initialUser,
    books,
    tags,
    addBook,
    updateBook,
    deleteBook,
    moveToShelf,
  } = useBooks();

  const [user, setUser] = useState(initialUser);
  const [currentShelf, setCurrentShelf] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    author: "",
    tags: [],
    minPages: "",
    maxPages: "",
    minRating: "",
    maxRating: "",
    minSpice: "",
    maxSpice: "",
    form: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});

  // Debug: track which book is being edited
  useEffect(() => {
    console.log("editingBook changed:", editingBook);
  }, [editingBook]);

  // Listen to auth changes from Supabase
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const shelves = [
    { id: "all", name: "All Books", icon: BookOpen },
    { id: "to-read", name: "To Read", icon: BookOpen },
    { id: "reading", name: "Currently Reading", icon: BookOpen },
    { id: "read", name: "Read", icon: BookOpen },
  ];

  const filteredBooks = filterBooks(books, currentShelf, searchTerm, filters);

  const toggleNote = (bookId) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const handleAddBook = async (bookData) => {
    try {
      const success = await addBook(bookData);
      return success;
    } catch (error) {
      console.error("Failed to add book:", error);
      return false;
    }
  };

  const handleUpdateBook = async (updatedBook) => {
    try {
      const success = await updateBook(updatedBook);
      if (success) setEditingBook(null);
      return success;
    } catch (error) {
      console.error("Failed to update book:", error);
      return false;
    }
  };

  const clearFilters = () => {
    setFilters({
      author: "",
      tags: [],
      minPages: "",
      maxPages: "",
      minRating: "",
      maxRating: "",
      minSpice: "",
      maxSpice: "",
      form: "",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // 🔐 Show Auth page if not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Auth />
      </div>
    );
  }

  // 📊 Stats page
  if (showStats) {
    return <StatisticsPage books={books} onBack={() => setShowStats(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Book Library</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowStats(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <BarChart3 size={20} />
              <span>Statistics</span>
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              <span>Add Book</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Sidebar
            shelves={shelves}
            currentShelf={currentShelf}
            setCurrentShelf={setCurrentShelf}
            books={books}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            tags={tags}
            clearFilters={clearFilters}
          />
        </div>

        {/* Book Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {shelves.find((s) => s.id === currentShelf)?.name}
              <span className="ml-2 text-lg text-gray-500">({filteredBooks.length})</span>
            </h2>
          </div>

          <BookGrid
            books={filteredBooks}
            expandedNotes={expandedNotes}
            toggleNote={toggleNote}
            onEdit={setEditingBook}
            onDelete={deleteBook}
            onMoveToShelf={moveToShelf}
            currentShelf={currentShelf}
            shelves={shelves}
          />
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddForm && (
        <BookModal
          mode="add"
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddBook}
          tags={tags}
        />
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <BookModal
          mode="edit"
          initialBook={editingBook}
          onClose={() => setEditingBook(null)}
          onSubmit={handleUpdateBook}
          tags={tags}
        />
      )}
    </div>
  );
};

export default App;
