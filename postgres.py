"""End-to-end demo of CRUD plus semantic vector search for job listings."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Iterable, List, Sequence

import psycopg2
from pgvector import Vector
from pgvector.psycopg2 import register_vector
from sentence_transformers import SentenceTransformer


MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


@dataclass(frozen=True)
class JobSeed:
    title: str
    description: str
    category: str | None = None
    location: str | None = None
    salary: float | None = None


SEED_JOBS: Sequence[JobSeed] = (
    JobSeed(
        title="Data Analyst",
        description="Analyze data and build dashboards using Python and SQL.",
        category="Analytics",
        location="Remote",
        salary=95000.0,
    ),
    JobSeed(
        title="BI Developer",
        description="Develop Tableau dashboards and data reports.",
        category="Business Intelligence",
        location="New York, NY",
        salary=105000.0,
    ),
    JobSeed(
        title="ML Engineer",
        description="Build machine learning models in Python",
        category="Machine Learning",
        location="San Francisco, CA",
        salary=155000.0,
    ),
    JobSeed(
        title="Sales Analyst",
        description="Work on Excel sales data and metrics",
        category="Sales",
        location="Chicago, IL",
        salary=85000.0,
    ),
)


def get_connection() -> psycopg2.extensions.connection:
    """Create a PostgreSQL connection using environment defaults."""

    return psycopg2.connect(
        dbname=os.getenv("PGDATABASE", "postgres"),
        user=os.getenv("PGUSER", os.getenv("USER", "postgres")),
        password=os.getenv("PGPASSWORD", ""),
        host=os.getenv("PGHOST", "localhost"),
        port=os.getenv("PGPORT", "5432"),
    )


def ensure_schema(conn: psycopg2.extensions.connection) -> None:
    """Ensure the pgvector extension and jobs table exist."""

    with conn.cursor() as cur:
        cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS jobs (
                job_id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT,
                location TEXT,
                salary NUMERIC,
                embedding vector(384) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
            );
            """
        )
        cur.execute(
            """
            CREATE OR REPLACE FUNCTION set_jobs_updated_at()
            RETURNS TRIGGER LANGUAGE plpgsql AS $$
            BEGIN
                NEW.updated_at := NOW();
                RETURN NEW;
            END;
            $$;
            """
        )
        cur.execute("DROP TRIGGER IF EXISTS set_jobs_updated_at ON jobs;")
        cur.execute(
            """
            CREATE TRIGGER set_jobs_updated_at
            BEFORE UPDATE ON jobs
            FOR EACH ROW
            EXECUTE FUNCTION set_jobs_updated_at();
            """
        )
        cur.execute(
            """
            CREATE INDEX IF NOT EXISTS jobs_embedding_ivfflat_idx
                ON jobs USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = 100);
            """
        )
        cur.execute("ANALYZE jobs;")
    conn.commit()


def embed_texts(model: SentenceTransformer, texts: Iterable[str]) -> List[List[float]]:
    """Generate ℓ2-normalised embeddings for the provided texts."""

    embeddings = model.encode(
        list(texts),
        convert_to_numpy=True,
        normalize_embeddings=True,
    )
    return [vector.tolist() for vector in embeddings]


def seed_jobs(
    conn: psycopg2.extensions.connection,
    model: SentenceTransformer,
    jobs: Sequence[JobSeed],
) -> None:
    """Insert demonstration jobs with embeddings (Task 2)."""

    descriptions = [job.description for job in jobs]
    embeddings = embed_texts(model, descriptions)

    with conn.cursor() as cur:
        cur.execute("TRUNCATE jobs RESTART IDENTITY;")
        for job, embedding in zip(jobs, embeddings, strict=True):
            cur.execute(
                """
                INSERT INTO jobs (title, description, category, location, salary, embedding)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    job.title,
                    job.description,
                    job.category,
                    job.location,
                    job.salary,
                    Vector(embedding),
                ),
            )
    conn.commit()


def display_jobs(conn: psycopg2.extensions.connection) -> None:
    """Fetch and print all jobs (Task 3)."""

    print("\nCurrent jobs:")
    with conn.cursor() as cur:
        cur.execute(
            "SELECT job_id, title, description, category, location, salary FROM jobs ORDER BY job_id;"
        )
        for row in cur.fetchall():
            job_id, title, description, category, location, salary = row
            print(
                f"[{job_id}] {title}\n    Description: {description}\n"
                f"    Category: {category or '—'} | Location: {location or '—'} | Salary: {salary or '—'}"
            )


def update_job_description(
    conn: psycopg2.extensions.connection,
    model: SentenceTransformer,
    job_id: int,
    new_description: str,
) -> None:
    """Update a job description and refresh its embedding (Task 4)."""

    embedding = embed_texts(model, [new_description])[0]
    with conn.cursor() as cur:
        cur.execute(
            """
            UPDATE jobs
               SET description = %s,
                   embedding = %s,
                   updated_at = NOW()
             WHERE job_id = %s;
            """,
            (new_description, Vector(embedding), job_id),
        )
    conn.commit()


def delete_job(conn: psycopg2.extensions.connection, job_id: int) -> None:
    """Delete a job by id (Task 5)."""

    with conn.cursor() as cur:
        cur.execute("DELETE FROM jobs WHERE job_id = %s;", (job_id,))
    conn.commit()


def semantic_search(
    conn: psycopg2.extensions.connection,
    model: SentenceTransformer,
    query: str,
    limit: int = 3,
) -> None:
    """Perform cosine-similarity search across job embeddings (Task 6)."""

    query_embedding = Vector(embed_texts(model, [query])[0])
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT job_id,
                   title,
                   description,
                   1 - (embedding <=> %s) AS cosine_similarity
              FROM jobs
             ORDER BY embedding <=> %s
             LIMIT %s;
            """,
            (query_embedding, query_embedding, limit),
        )
        rows = cur.fetchall()

    print(f"\nTop {limit} results for query: '{query}'")
    for job_id, title, description, similarity in rows:
        print(
            f"[{job_id}] {title} (similarity: {similarity:.4f})\n"
            f"    {description}"
        )


def main() -> None:
    print("Connecting to PostgreSQL and preparing schema…")
    model = SentenceTransformer(MODEL_NAME)
    with get_connection() as conn:
        register_vector(conn)
        ensure_schema(conn)
        seed_jobs(conn, model, SEED_JOBS)
        display_jobs(conn)
        update_job_description(
            conn,
            model,
            job_id=2,
            new_description="Design interactive dashboards with Power BI and SQL",
        )
        delete_job(conn, job_id=4)
        display_jobs(conn)
        semantic_search(
            conn,
            model,
            query="Looking for data roles with Python and dashboards",
            limit=3,
        )


if __name__ == "__main__":
    main()

