import { FormEvent, useEffect, useState } from "react";

import { libraryApi } from "../api/library";
import { Student } from "../types";
import { DataTable } from "../components/DataTable";
import { ErrorState } from "../components/ErrorState";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useAuth } from "../hooks/useAuth";

const studentColumns = [
  { key: "studentId", header: "ID" },
  {
    key: "name",
    header: "Name",
    render: (student: Student) => `${student.firstName} ${student.lastName}`,
  },
  { key: "email", header: "Email" },
  { key: "status", header: "Status" },
];

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "Active",
  });
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin } = useAuth();

  const fetchStudents = async () => {
    try {
      const data = await libraryApi.getStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAdmin) {
      setError("You need administrator access to add students.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newStudent = await libraryApi.createStudent(formState);
      setStudents((previous) => [...previous, newStudent]);
      setFormState({ firstName: "", lastName: "", email: "", status: "Active" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading students..." />;
  }

  return (
    <div className="stack gap-lg">
      <header className="page-header">
        <h2>Students</h2>
        <p className="muted">Browse and add students to the library system.</p>
      </header>

      {error && <ErrorState message={error} />}

      <section className="card">
        <h3 className="section-title">Add a student</h3>
        {isAdmin ? (
          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>First name</span>
              <input
                required
                value={formState.firstName}
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    firstName: event.target.value,
                  }))
                }
                placeholder="Alice"
              />
            </label>
            <label className="form-field">
              <span>Last name</span>
              <input
                required
                value={formState.lastName}
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    lastName: event.target.value,
                  }))
                }
                placeholder="Walker"
              />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input
                required
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    email: event.target.value,
                  }))
                }
                placeholder="alice@example.com"
              />
            </label>
            <label className="form-field">
              <span>Status</span>
              <select
                value={formState.status}
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    status: event.target.value,
                  }))
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <div className="form-actions">
              <button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Add student"}
              </button>
            </div>
          </form>
        ) : (
          <p className="muted">
            Only administrators can add or update student records. Contact an admin if you
            need changes made on your behalf.
          </p>
        )}
      </section>

      <section className="card">
        <h3 className="section-title">Student list</h3>
        <DataTable
          columns={studentColumns}
          data={students}
          emptyMessage="No students found. Add your first student above."
        />
      </section>
    </div>
  );
}
