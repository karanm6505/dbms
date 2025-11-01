import { FormEvent, useEffect, useState } from "react";

import { schemaApi } from "../api/schema";
import { DbRoutine } from "../types";
import { ErrorState } from "../components/ErrorState";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { DataTable } from "../components/DataTable";
import { useAuth } from "../hooks/useAuth";

const columns = [{ key: "name", header: "Function name" }];

export function FunctionsPage() {
  const [functions, setFunctions] = useState<DbRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedFunction, setSelectedFunction] = useState<string>("");
  const [argumentInput, setArgumentInput] = useState<string>("[]");
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await schemaApi.getFunctions();
        setFunctions(data);
        if (data.length) {
          setSelectedFunction((current) => current || data[0].name);
        }
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load functions"
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
    setExecutionResult(null);

    if (!isAdmin) {
      setExecutionError("You need administrator access to execute stored functions.");
      return;
    }

    if (!selectedFunction) {
      setExecutionError("Choose a function to execute");
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
      const response = await schemaApi.executeFunction(
        selectedFunction,
        parsedArguments
      );
      setExecutionResult(JSON.stringify(response.result, null, 2));
    } catch (error) {
      setExecutionError(
        error instanceof Error ? error.message : "Failed to execute function"
      );
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading stored functions..." />;
  }

  return (
    <div className="stack gap-lg">
      <header className="page-header">
        <h2>Stored functions</h2>
        <p className="muted">
          Explore stored functions and run them with custom arguments.
        </p>
      </header>

      {fetchError && <ErrorState message={fetchError} />}

      <section className="card">
        <h3 className="section-title">Available functions</h3>
        <DataTable
          columns={columns}
          data={functions}
          emptyMessage="No stored functions found in the database."
        />
      </section>

      <section className="card">
        <h3 className="section-title">Execute a function</h3>
        <p className="muted">
          Arguments must be supplied as a JSON array. Leave empty or use [] for
          functions with no parameters.
        </p>
        <form className="stack gap-lg" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Function</span>
            <select
              value={selectedFunction}
              onChange={(event) => setSelectedFunction(event.target.value)}
            >
              <option value="">Select a function</option>
              {functions.map((item) => (
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
              {executing ? "Running..." : "Execute function"}
            </button>
          </div>
        </form>

        {executionError && <ErrorState message={executionError} />}

        {executionResult && (
          <div className="stack">
            <span className="muted">Result</span>
            <pre className="code-block">{executionResult}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
