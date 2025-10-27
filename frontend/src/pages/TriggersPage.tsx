import { useEffect, useState } from "react";

import { schemaApi } from "../api/schema";
import { DbTrigger } from "../types";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorState } from "../components/ErrorState";
import { DataTable } from "../components/DataTable";

const columns = [
  { key: "name", header: "Trigger" },
  { key: "timing", header: "Timing" },
  { key: "event", header: "Event" },
  { key: "table", header: "Table" },
];

export function TriggersPage() {
  const [triggers, setTriggers] = useState<DbTrigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await schemaApi.getTriggers();
        setTriggers(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load triggers");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <LoadingIndicator message="Loading triggers..." />;
  }

  return (
    <div className="stack gap-lg">
      <header className="page-header">
        <h2>Database triggers</h2>
        <p className="muted">
          Review active database triggers and learn how to validate their behaviour.
        </p>
      </header>

      {error && <ErrorState message={error} />}

      <section className="card">
        <h3 className="section-title">Registered triggers</h3>
        <DataTable
          columns={columns}
          data={triggers}
          emptyMessage="No triggers were found for this database."
        />
      </section>

      <section className="card stack gap-lg">
        <div>
          <h3 className="section-title">How to exercise a trigger</h3>
          <p className="muted">
            Triggers execute automatically in response to table events. Use the
            steps below as a playbook when you want to validate a trigger without
            leaving the browser.
          </p>
        </div>
        <ol className="playbook">
          <li>
            Identify the target table and the trigger event from the list above
            (for example <span className="inline-code">AFTER INSERT ON students</span>).
          </li>
          <li>
            Use the students, books, or borrows pages to perform the matching
            action (insert, update, or delete). You can also execute a stored
            procedure that performs the same change.
          </li>
          <li>
            Observe the side effects — reload the related list, or query the
            database using a stored function or procedure to confirm the trigger
            ran successfully.
          </li>
        </ol>
        <p className="muted">
          Need to troubleshoot? Call a diagnostic stored function or procedure
          from the dedicated pages to view the state affected by your trigger.
        </p>
      </section>
    </div>
  );
}
