import { useEffect, useState } from "react";

import { libraryApi } from "../api/library";
import { DashboardSummary } from "../types";
import { ErrorState } from "../components/ErrorState";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { StatCard } from "../components/StatCard";

export function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await libraryApi.getDashboardSummary();
        setData(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingIndicator message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!data) {
    return <ErrorState message="No dashboard data available." />;
  }

  return (
    <div className="stack gap-lg">
      <header className="page-header">
        <h2>Dashboard</h2>
        <p className="muted">
          Snapshot of your library: students, books, and borrowing activity.
        </p>
      </header>
      <section className="grid stats-grid">
        <StatCard label="Total Students" value={data.totalStudents} accent="blue" />
        <StatCard label="Active Students" value={data.activeStudents} accent="green" />
        <StatCard label="Total Books" value={data.totalBooks} accent="purple" />
        <StatCard
          label="Available Books"
          value={data.availableBooks}
          accent="green"
        />
        <StatCard label="Borrowed Books" value={data.borrowedBooks} accent="orange" />
        <StatCard label="Total Staff" value={data.totalStaff} accent="purple" />
      </section>
    </div>
  );
}
