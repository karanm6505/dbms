import { useEffect, useMemo, useState } from "react";

import { libraryApi } from "../api/library";
import { BorrowRecord } from "../types";
import { DataTable } from "../components/DataTable";
import { ErrorState } from "../components/ErrorState";
import { LoadingIndicator } from "../components/LoadingIndicator";

const columns = [
  { key: "borrowId", header: "ID" },
  { key: "studentName", header: "Student" },
  { key: "bookTitle", header: "Book" },
  { key: "staffName", header: "Assigned Staff" },
  { key: "issueDate", header: "Issued" },
  { key: "dueDate", header: "Due" },
  { key: "status", header: "Status" },
];

export function BorrowsPage() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await libraryApi.getBorrowRecords();
        setRecords(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load borrow records"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    if (statusFilter === "All") {
      return records;
    }
    return records.filter((record) => record.status === statusFilter);
  }, [records, statusFilter]);

  if (loading) {
    return <LoadingIndicator message="Loading borrow records..." />;
  }

  return (
    <div className="stack gap-lg">
      <header className="page-header">
        <h2>Borrowing activity</h2>
        <p className="muted">
          Track current and historical borrowing transactions across the
          library.
        </p>
      </header>

      {error && <ErrorState message={error} />}

      <div className="card">
        <label className="form-field">
          <span>Status filter</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All</option>
            <option value="Issued">Issued</option>
            <option value="Returned">Returned</option>
          </select>
        </label>
      </div>

      <section className="card">
        <DataTable
          columns={columns}
          data={filteredRecords}
          emptyMessage="No borrow records match your filters."
        />
      </section>
    </div>
  );
}
