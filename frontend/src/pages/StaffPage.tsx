import { useEffect, useState } from "react";

import { libraryApi } from "../api/library";
import { StaffMember } from "../types";
import { DataTable } from "../components/DataTable";
import { ErrorState } from "../components/ErrorState";
import { LoadingIndicator } from "../components/LoadingIndicator";

const columns = [
  { key: "staffId", header: "ID" },
  {
    key: "name",
    header: "Name",
    render: (staff: StaffMember) => `${staff.firstName} ${staff.lastName}`,
  },
  { key: "position", header: "Position" },
  { key: "status", header: "Status" },
];

export function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await libraryApi.getStaff();
        setStaff(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load staff");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) {
    return <LoadingIndicator message="Loading staff..." />;
  }

  return (
    <div className="stack gap-lg">
      <header className="page-header">
        <h2>Staff</h2>
        <p className="muted">
          All staff members who help manage the library and support students.
        </p>
      </header>

      {error && <ErrorState message={error} />}

      <section className="card">
        <DataTable
          columns={columns}
          data={staff}
          emptyMessage="No staff members found."
        />
      </section>
    </div>
  );
}
