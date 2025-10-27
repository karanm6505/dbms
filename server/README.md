# Library Management API (Go + Chi)

This service exposes REST endpoints for the Library Management System backed by MySQL.

## Prerequisites

- Go 1.21 or newer
- MySQL (schema from `../library_setup.sql` loaded)
- Copy `.env.example` to `.env` and adjust credentials

## Quick start

```bash
cd server
cp .env.example .env
# edit .env to match your DB credentials

# fetch dependencies
go mod tidy

# run the API
go run ./cmd/api
```

The server boots on the port defined in `API_PORT` (default `5050`). Health check is available at `GET /api/health`.

### Available endpoints

| Method | Path                                      | Description                               |
|--------|-------------------------------------------|-------------------------------------------|
| GET    | `/api/health`                             | Service heartbeat check                   |
| GET    | `/api/students`                           | List all students                         |
| GET    | `/api/students/{id}`                      | Fetch a single student by ID              |
| POST   | `/api/students`                           | Create a new student record               |
| GET    | `/api/books`                              | List all books                            |
| GET    | `/api/books/available`                    | List books with status Available          |
| GET    | `/api/staff`                              | List all staff members                    |
| GET    | `/api/borrows`                            | List borrow transactions                  |
| GET    | `/api/dashboard/stats`                    | Summary statistics for dashboard          |
| GET    | `/api/schema/tables`                      | List tables in the active database        |
| GET    | `/api/schema/functions`                   | List stored functions                     |
| GET    | `/api/schema/procedures`                  | List stored procedures                    |
| GET    | `/api/schema/triggers`                    | List database triggers                    |
| POST   | `/api/schema/functions/{name}/execute`    | Execute a stored function with arguments  |
| POST   | `/api/schema/procedures/{name}/execute`   | Execute a stored procedure with arguments |

## Project layout

```
server/
├── cmd/api/           # application entrypoint
├── internal/
│   ├── config/        # environment loading
│   ├── db/            # database connection helpers
│   ├── handlers/      # HTTP handlers (Chi)
│   └── repository/    # data access layer (MySQL queries)
├── .env.example
└── go.mod
```

## Next steps

- Add update/delete endpoints and expand validation beyond students
- Introduce structured logging (zerolog/zap) and tracing if needed
- Add unit/integration tests (testing + sqlmock or Testcontainers)
