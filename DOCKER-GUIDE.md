# 🐳 Docker Quick Start Guide

## Starting the Application

```bash
# Build and start all services (first time or after code changes)
docker-compose up --build

# Start in detached mode (runs in background)
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Accessing the Application

Once running, access:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5050/api
- **Database**: localhost:3306

## Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (resets database)
docker-compose down -v
```

## Database Credentials

```
Host: db (or localhost:3306 from host machine)
Database: Library_Management_System
User: library_app
Password: library_pass
Root Password: supersecret
```

## Troubleshooting

### Rebuild from scratch
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Check service status
```bash
docker-compose ps
```

### Access MySQL directly
```bash
# From host machine
mysql -h 127.0.0.1 -P 3306 -u library_app -plibrary_pass Library_Management_System

# From inside container
docker-compose exec db mysql -u library_app -plibrary_pass Library_Management_System
```

### View backend logs
```bash
docker-compose logs backend
```

### Restart a single service
```bash
docker-compose restart backend
```

## Development vs Docker

### Local Development (Hot Reload)
```bash
# Terminal 1: Backend
cd server
go run ./cmd/api

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### Docker (Production-like)
```bash
docker-compose up
```

## Database Initialization

The database is automatically initialized on first run with:
- ✅ Schema (tables)
- ✅ Sample data
- ✅ Stored functions
- ✅ Stored procedures  
- ✅ Triggers

All SQL files are loaded in this order:
1. `ddl_dml.sql` - Tables and data
2. `functions.sql` - Stored functions
3. `triggers.sql` - Database triggers
4. `procedures.sql` - Stored procedures

## Port Mapping

| Service  | Container Port | Host Port |
|----------|----------------|-----------|
| Frontend | 80             | 8080      |
| Backend  | 5050           | 5050      |
| Database | 3306           | 3306      |

## Environment Variables

Environment variables are set in `docker-compose.yml`. To override:

```bash
# Create docker-compose.override.yml
services:
  backend:
    environment:
      API_PORT: 8080
```
