import { useEffect, useState } from "react";

import { libraryApi } from "../api/library";
import { Book } from "../types";
import { DataTable } from "../components/DataTable";
import { ErrorState } from "../components/ErrorState";
import { LoadingIndicator } from "../components/LoadingIndicator";

const columns = [
  { key: "bookId", header: "ID" },
  { key: "title", header: "Title" },
  { key: "author", header: "Author" },
  { key: "genre", header: "Genre" },
  { key: "status", header: "Status" },
  { key: "yearPublished", header: "Year" },
];

export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const fetchBooks = async () => {
    try {
      const data = showAvailableOnly
        ? await libraryApi.getAvailableBooks()
        : await libraryApi.getBooks();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAvailableOnly]);

  if (loading) {
    return <LoadingIndicator message="Loading books..." />;
  }

  return (
    <div className="stack gap-lg">
      <header className="page-header">
        <h2>Books</h2>
        <p className="muted">
          Browse the catalog and filter by availability to see what can be
          borrowed now.
        </p>
      </header>

      {error && <ErrorState message={error} />}

      <div className="card">
        <label className="switch">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(event) => setShowAvailableOnly(event.target.checked)}
          />
          <span>Show only available books</span>
        </label>
      </div>

      <section className="card">
        <DataTable
          columns={columns}
          data={books}
          emptyMessage="No books match your filters."
        />
      </section>
    </div>
  );
}
