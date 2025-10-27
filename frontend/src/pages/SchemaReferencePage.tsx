import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { schemaApi } from "../api/schema";
import { DbRoutine, DbTrigger, SchemaTable } from "../types";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorState } from "../components/ErrorState";

interface SchemaState {
  tables: SchemaTable[];
  functions: DbRoutine[];
  procedures: DbRoutine[];
  triggers: DbTrigger[];
}

const emptySchema: SchemaState = {
  tables: [],
  functions: [],
  procedures: [],
  triggers: [],
};

export function SchemaReferencePage() {
  const [schema, setSchema] = useState<SchemaState>(emptySchema);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [tables, functions, procedures, triggers] = await Promise.all([
          schemaApi.getTables(),
          schemaApi.getFunctions(),
          schemaApi.getProcedures(),
          schemaApi.getTriggers(),
        ]);
        setSchema({ tables, functions, procedures, triggers });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load schema metadata"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <LoadingIndicator message="Opening reference guide..." />;
  }

  return (
    <div className="stack gap-lg">
      <header className="page-header">
        <h2>Schema reference</h2>
        <p className="muted">
          A living manual that documents the tables, routines, and triggers in
          your library database.
        </p>
      </header>

      {error && <ErrorState message={error} />}

      <section className="card stack gap-lg">
        <div>
          <h3 className="section-title">Quick start</h3>
          <p>
            Use this page as a man-page style reference while you work on the
            project. Every entry links back to the interactive pages where you
            can run queries or mutate data.
          </p>
        </div>
        <div className="reference-grid">
          <div className="reference-tile">
            <span className="reference-tile__label">Stored functions</span>
            <Link className="reference-tile__link" to="/schema/functions">
              Launch function runner →
            </Link>
          </div>
          <div className="reference-tile">
            <span className="reference-tile__label">Stored procedures</span>
            <Link className="reference-tile__link" to="/schema/procedures">
              Launch procedure runner →
            </Link>
          </div>
          <div className="reference-tile">
            <span className="reference-tile__label">Triggers</span>
            <Link className="reference-tile__link" to="/schema/triggers">
              Review trigger playbook →
            </Link>
          </div>
        </div>
      </section>

      <section className="card stack gap-lg">
        <div>
          <h3 className="section-title">Tables</h3>
          <p className="muted">{schema.tables.length} tables are available.</p>
        </div>
        <ul className="reference-list">
          {schema.tables.map((table) => (
            <li key={table.name}>
              <span className="inline-code">{table.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card stack gap-lg">
        <div>
          <h3 className="section-title">Stored functions</h3>
          <p className="muted">
            {schema.functions.length}
            {schema.functions.length === 1 ? " function" : " functions"} are ready to
            execute.
          </p>
        </div>
        <ul className="reference-list">
          {schema.functions.map((routine) => (
            <li key={routine.name}>
              <span className="inline-code">{routine.name}()</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card stack gap-lg">
        <div>
          <h3 className="section-title">Stored procedures</h3>
          <p className="muted">
            {schema.procedures.length}
            {schema.procedures.length === 1 ? " procedure" : " procedures"} available.
          </p>
        </div>
        <ul className="reference-list">
          {schema.procedures.map((routine) => (
            <li key={routine.name}>
              <span className="inline-code">CALL {routine.name}(...)</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card stack gap-lg">
        <div>
          <h3 className="section-title">Triggers</h3>
          <p className="muted">
            {schema.triggers.length}
            {schema.triggers.length === 1 ? " trigger" : " triggers"} keep your data
            consistent.
          </p>
        </div>
        <ul className="reference-list">
          {schema.triggers.map((trigger) => (
            <li key={trigger.name}>
              <span className="inline-code">{trigger.name}</span> — {trigger.timing}{" "}
              {trigger.event} on{" "}
              <span className="inline-code">{trigger.table}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}