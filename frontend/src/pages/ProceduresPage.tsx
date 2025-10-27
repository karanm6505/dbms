import { FormEvent, useEffect, useState } from "react";

import { schemaApi } from "../api/schema";
import { DbRoutine } from "../types";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorState } from "../components/ErrorState";
import { DataTable } from "../components/DataTable";

const columns = [{ key: "name", header: "Procedure name" }];

export function ProceduresPage() {
  const [procedures, setProcedures] = useState<DbRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedProcedure, setSelectedProcedure] = useState<string>("");
  const [argumentInput, setArgumentInput] = useState<string>("[]");
  const [executing, setExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionRows, setExecutionRows] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await schemaApi.getProcedures();
        setProcedures(data);
        if (data.length) {
          setSelectedProcedure((current) => current || data[0].name);
        }
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load procedures"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExecutionError(null);
    setExecutionRows(null);

    if (!selectedProcedure) {
      setExecutionError("Choose a procedure to execute");
      return;
    }

    let parsedArguments: unknown[] = [];
    const rawInput = argumentInput.trim();

    if (rawInput.length) {
      try {
        const parsed = JSON.parse(rawInput);
        if (!Array.isArray(parsed)) {
          throw new Error("Arguments must be provided as a JSON array");
        }
        parsedArguments = parsed;
      } catch (error) {
        setExecutionError(
          error instanceof Error ? error.message : "Invalid JSON arguments"
        );
        return;
      }
    }

    setExecuting(true);

    try {
      const response = await schemaApi.executeProcedure(
        selectedProcedure,
        parsedArguments
      );
      setExecutionRows(JSON.stringify(response.rows, null, 2));
    } catch (error) {
      setExecutionError(
        error instanceof Error ? error.message : "Failed to execute procedure"
      );
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading stored procedures..." />;
  }

  return (
    <div className="stack gap-lg">
      <header className="page-header">
        <h2>Stored procedures</h2>
        <p className="muted">
          Execute stored procedures and inspect the returned result sets.
        </p>
      </header>

      {fetchError && <ErrorState message={fetchError} />}

      <section className="card">
        <h3 className="section-title">Available procedures</h3>
        <DataTable
          columns={columns}
          data={procedures}
          emptyMessage="No stored procedures found in the database."
        />
      </section>

      <section className="card">
        <h3 className="section-title">Execute a procedure</h3>
        <p className="muted">
          When a procedure returns multiple result sets they will be combined and
          shown below.
        </p>
        <form className="stack gap-lg" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Procedure</span>
            <select
              value={selectedProcedure}
              onChange={(event) => setSelectedProcedure(event.target.value)}
            >
              <option value="">Select a procedure</option>
              {procedures.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Arguments (JSON array)</span>
            <textarea
              rows={4}
              value={argumentInput}
              onChange={(event) => setArgumentInput(event.target.value)}
              placeholder='[]'
            />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={executing}>
              {executing ? "Running..." : "Execute procedure"}
            </button>
          </div>
        </form>

        {executionError && <ErrorState message={executionError} />}

        {executionRows && (
          <div className="stack">
            <span className="muted">Result set</span>
            <pre className="code-block">{executionRows}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
