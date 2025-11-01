-- Enable the pgvector extension to store and query embedding vectors.
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to store job listings alongside their semantic embeddings.
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

-- Update the modification timestamp whenever a row changes.
CREATE OR REPLACE FUNCTION set_jobs_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_jobs_updated_at ON jobs;
CREATE TRIGGER set_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION set_jobs_updated_at();

-- Approximate nearest-neighbor index for cosine similarity search across embeddings.
-- Adjust the list count based on data volume (higher lists => better recall, slower writes).
CREATE INDEX IF NOT EXISTS jobs_embedding_ivfflat_idx
    ON jobs USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Collect statistics so the query planner can leverage the index effectively.
ANALYZE jobs;
