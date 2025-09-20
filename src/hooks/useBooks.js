import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState(null);

  // Listen to auth changes
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch all books for this user
  const fetchBooks = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_books")
      .select(`
        id,
        shelf,
        rating,
        spice_rating,
        form,
        note,
        inserted_at,
        book:books (
          id,
          title,
          author,
          pages
        ),
        user_book_tags (
          tag:tags(name, id)
        )
      `)
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: false });

    if (error) {
      console.error("Error fetching books:", error);
      return;
    }

    // Flatten structure: merge book + user_book data
    const formatted = data.map((ub) => ({
      id: ub.id, // user_books id
      book_id: ub.book?.id,
      title: ub.book?.title,
      author: ub.book?.author,
      pages: ub.book?.pages,
      shelf: ub.shelf,
      rating: ub.rating,
      spice_rating: ub.spice_rating,
      form: ub.form,
      note: ub.note,
      tags: ub.user_book_tags?.map((t) => t.tag.name) || [],
      inserted_at: ub.inserted_at,
    }));

    setBooks(formatted);

    // Extract unique tags
    const allTags = new Set();
    formatted.forEach((b) => b.tags.forEach((t) => allTags.add(t)));
    setTags(Array.from(allTags).sort());
  }, [user]);

  useEffect(() => {
    if (user) fetchBooks();
    else {
      setBooks([]);
      setTags([]);
    }
  }, [user, fetchBooks]);

  // Add a book
  const addBook = async (newBook) => {
    if (!user) return false;

    if (!newBook.title.trim() || !newBook.author.trim()) {
      alert("Title and author are required!");
      return false;
    }

    // 1. Check if book already exists
    let { data: existingBook } = await supabase
      .from("books")
      .select("id")
      .eq("title", newBook.title)
      .eq("author", newBook.author)
      .maybeSingle();

    if (!existingBook) {
      const { data: inserted, error: insertError } = await supabase
        .from("books")
        .insert([{ title: newBook.title, author: newBook.author, pages: newBook.pages || null }])
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting book:", insertError);
        return false;
      }
      existingBook = inserted;
    }

    // 2. Insert into user_books
    const { data: userBook, error: userBookError } = await supabase
      .from("user_books")
      .insert([{
        user_id: user.id,
        book_id: existingBook.id,
        shelf: newBook.shelf || "to-read",
        rating: newBook.rating ? Number(newBook.rating) : null,
        spice_rating: newBook.spice_rating ? Number(newBook.spice_rating) : null,
        form: newBook.form || "ebook",
        note: newBook.note || "",
      }])
      .select()
      .single();

    if (userBookError) {
      console.error("Error inserting user_books:", userBookError);
      return false;
    }

    // 3. Handle tags (ensure each exists for this user, then link)
    for (const tagName of newBook.tags || []) {
      let { data: tag } = await supabase
        .from("tags")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", tagName)
        .maybeSingle();

      if (!tag) {
        const { data: newTag } = await supabase
          .from("tags")
          .insert([{ user_id: user.id, name: tagName }])
          .select()
          .single();
        tag = newTag;
      }

      await supabase.from("user_book_tags").insert([{
        user_book_id: userBook.id,
        tag_id: tag.id
      }]);
    }

    await fetchBooks(); // refresh
    return true;
  };

  // Update book
  const updateBook = async (updatedBook) => {
    if (!user) return false;

    const { error } = await supabase
      .from("user_books")
      .update({
        shelf: updatedBook.shelf,
        rating: updatedBook.rating ? Number(updatedBook.rating) : null,
        spice_rating: updatedBook.spice_rating ? Number(updatedBook.spice_rating) : null,
        form: updatedBook.form,
        note: updatedBook.note,
      })
      .eq("id", updatedBook.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating user_books:", error);
      return false;
    }

    // Update tags: clear + reinsert
    await supabase.from("user_book_tags").delete().eq("user_book_id", updatedBook.id);
    for (const tagName of updatedBook.tags || []) {
      let { data: tag } = await supabase
        .from("tags")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", tagName)
        .maybeSingle();

      if (!tag) {
        const { data: newTag } = await supabase
          .from("tags")
          .insert([{ user_id: user.id, name: tagName }])
          .select()
          .single();
        tag = newTag;
      }

      await supabase.from("user_book_tags").insert([{
        user_book_id: updatedBook.id,
        tag_id: tag.id
      }]);
    }

    await fetchBooks();
    return true;
  };

  // Delete book (user’s entry, not global book)
  const deleteBook = async (userBookId) => {
    if (!user) return false;
    if (!window.confirm("Are you sure you want to delete this book?")) return false;

    const { error } = await supabase.from("user_books").delete().eq("id", userBookId).eq("user_id", user.id);

    if (error) {
      console.error("Error deleting book:", error);
      return false;
    }

    await fetchBooks();
    return true;
  };

  // Move to shelf
  const moveToShelf = async (userBookId, newShelf) => {
    if (!user) return false;

    const { error } = await supabase
      .from("user_books")
      .update({ shelf: newShelf })
      .eq("id", userBookId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error moving book:", error);
      return false;
    }

    await fetchBooks();
    return true;
  };

  return { user, books, tags, addBook, updateBook, deleteBook, moveToShelf, fetchBooks };
};
