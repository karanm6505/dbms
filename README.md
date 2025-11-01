# Library Management System

Complete full-stack application with MySQL database, Go REST API, and React frontend for managing library operations including books, students, staff, and borrowing records.

## Quick Start (Docker) 🐳

```bash
# Start all services (database + backend + frontend)
docker compose up --build

# Access the application
open http://localhost:8080
```

The Docker stack includes:
- **Frontend**: React app served by nginx on **port 8080**
- **Backend**: Go REST API on **port 5050**
- **Database**: MySQL 8.4 on **port 3306**

## Local Development

### Prerequisites
- Go 1.24+
- Node.js 20+
- MySQL 8+

### 1. Database Setup

```bash
# Reset schema, seed data, functions, triggers, procedures
./scripts/reset_local_db.sh

# Or specify custom credentials
MYSQL_USER=root MYSQL_PASSWORD=secret ./scripts/reset_local_db.sh
```

Default credentials:
- **Admin** – `karanm6505@gmail.com` / `karanm2005`
- Newly registered users receive the `viewer` role automatically.

### 2. Backend (Go API)

```bash
cd server
cp .env.example .env
# Edit .env with your MySQL credentials (DB_PASSWORD, etc.)
go mod download
go run ./cmd/api
```

Backend runs on http://localhost:5050

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

---

## Project Structure

```
.
├── server/                 # Go backend (Chi router + MySQL)
│   ├── cmd/api/           # Main entry point
│   ├── internal/          # Business logic
│   │   ├── config/        # Environment config
│   │   ├── db/            # MySQL connection
│   │   ├── handlers/      # HTTP handlers
│   │   ├── models/        # Domain models
│   │   └── repository/    # Data access layer
│   └── .env.example       # Backend config template
├── frontend/              # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   └── types/         # TypeScript types
│   └── .env.example       # Frontend config template
├── docker/                # Docker configuration
│   ├── backend/           # Go API Dockerfile + entrypoint
│   ├── frontend/          # React build + nginx config
│   └── db/                # MySQL initialization
├── ddl_dml.sql            # Database schema + seed data
├── functions.sql          # Stored functions
├── procedures.sql         # Stored procedures
├── triggers.sql           # Database triggers
├── library_setup.sql      # Master setup script
└── docker-compose.yml     # Multi-container orchestration
```

---

## Features

### Core Functionality
- 📊 **Dashboard** with real-time statistics
- 👩‍🎓 **Student Management** – Add, view, and toggle student status
- 📚 **Book Catalog** – Browse books with availability tracking
- 🔄 **Borrowing System** – Create borrow records and track returns
- 👔 **Staff Management** – View and manage library staff

### Database Schema Tools
- 🔧 **Functions** – Execute stored functions with custom arguments
- 📝 **Procedures** – Run stored procedures and inspect result sets
- ⚡ **Triggers** – View registered triggers with validation guide
- 📖 **Schema Reference** – Man-page style documentation hub

---

## API Documentation

See [`server/README.md`](server/README.md) for complete endpoint documentation including:
- Students, books, staff, borrow records
- Dashboard statistics
- Schema metadata (tables, functions, procedures, triggers)
- Execution endpoints for stored routines

---

## Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Stop services
docker compose down

# Reset database (removes volume)
docker compose down -v
docker compose up --build
```

---

## Environment Variables

### Backend (`server/.env`)
```bash
API_PORT=5050
FRONTEND_ORIGINS=http://localhost:5173,http://localhost:8080
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=Library_Management_System
```

### Frontend (`frontend/.env`)
```bash
# Leave blank for same-origin requests (Docker setup)
VITE_API_BASE_URL=http://localhost:5050

# Enable dev proxy
VITE_USE_PROXY=true
```

---

## Testing

```bash
# Backend unit tests
cd server
go test ./...

# Frontend type-check and build
cd frontend
npm run build
```

---

## Troubleshooting

### Database Connection Errors
1. Verify MySQL is running:
   ```bash
   mysql -u root -p
   ```
2. Check credentials in `server/.env`
3. Ensure `Library_Management_System` database exists

### CORS Issues
- Backend allows `http://localhost:5173`, `http://127.0.0.1:5173`, and the Docker frontend on `http://localhost:8080`
- Override or extend the list with the `FRONTEND_ORIGINS` environment variable (comma-separated)

### Docker Issues
```bash
# Check service status
docker-compose ps

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

## Database Components

### Tables
- `student` – Student records with status tracking
- `book` – Book catalog with availability status
- `staff` – Library staff information
- `borrow` – Borrowing transactions
- `computer` – Computer lab management

### Functions
- Utility functions for availability checks, overdue calculations, and statistics

### Triggers
- Automatic book status updates
- Borrowing limit enforcement
- Data consistency validation

### Stored Procedures
- Common operations like adding books, listing staff, checking borrowed books

---

## License

Academic project for DBMS coursework.
