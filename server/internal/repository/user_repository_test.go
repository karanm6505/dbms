package repository

import (
	"context"
	"database/sql"
	"errors"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/go-sql-driver/mysql"
	"github.com/karanm6505/dbms/server/internal/models"
)

func TestUserRepository_GetByEmail(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to create sqlmock: %v", err)
	}
	t.Cleanup(func() { db.Close() })

	repo := NewUserRepository(db)

	email := "admin@example.com"
	rows := sqlmock.NewRows([]string{"user_id", "email", "password_hash", "role", "created_at", "updated_at"}).
		AddRow(int64(1), email, "hash", models.RoleAdmin, time.Now(), time.Now())

	mock.ExpectQuery(regexp.QuoteMeta(`
		SELECT user_id, email, password_hash, role, created_at, updated_at
		FROM users
		WHERE email = ?
	`)).
		WithArgs(email).
		WillReturnRows(rows)

	ctx := context.Background()
	user, err := repo.GetByEmail(ctx, email)
	if err != nil {
		t.Fatalf("GetByEmail returned error: %v", err)
	}

	if user.Email != email {
		t.Fatalf("expected email %s, got %s", email, user.Email)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("expectations were not met: %v", err)
	}
}

func TestUserRepository_GetByID_NotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to create sqlmock: %v", err)
	}
	t.Cleanup(func() { db.Close() })

	repo := NewUserRepository(db)

	mock.ExpectQuery(regexp.QuoteMeta(`
		SELECT user_id, email, password_hash, role, created_at, updated_at
		FROM users
		WHERE user_id = ?
	`)).
		WithArgs(int64(42)).
		WillReturnError(sql.ErrNoRows)

	ctx := context.Background()
	user, err := repo.GetByID(ctx, 42)
	if err == nil {
		t.Fatalf("expected error, got nil")
	}

	if user != nil {
		t.Fatalf("expected nil user, got %+v", user)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("expectations were not met: %v", err)
	}
}

func TestUserRepository_Create(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to create sqlmock: %v", err)
	}
	t.Cleanup(func() { db.Close() })

	repo := NewUserRepository(db)

	queryRows := sqlmock.NewRows([]string{"user_id", "email", "password_hash", "role", "created_at", "updated_at"}).
		AddRow(int64(1), "new@example.com", "hash", models.RoleViewer, time.Now(), time.Now())

	mock.ExpectExec(regexp.QuoteMeta(`
		INSERT INTO users (email, password_hash, role)
		VALUES (?, ?, ?)
	`)).
		WithArgs("new@example.com", "hash", models.RoleViewer).
		WillReturnResult(sqlmock.NewResult(1, 1))

	mock.ExpectQuery(regexp.QuoteMeta(`
		SELECT user_id, email, password_hash, role, created_at, updated_at
		FROM users
		WHERE user_id = ?
	`)).
		WithArgs(int64(1)).
		WillReturnRows(queryRows)

	user := &models.User{Email: "new@example.com", PasswordHash: "hash", Role: models.RoleViewer}

	if err := repo.Create(context.Background(), user); err != nil {
		t.Fatalf("Create returned error: %v", err)
	}

	if user.ID != 1 {
		t.Fatalf("expected user ID 1, got %d", user.ID)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("expectations were not met: %v", err)
	}
}

func TestUserRepository_CreateDuplicateEmail(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to create sqlmock: %v", err)
	}
	t.Cleanup(func() { db.Close() })

	repo := NewUserRepository(db)

	mock.ExpectExec(regexp.QuoteMeta(`
		INSERT INTO users (email, password_hash, role)
		VALUES (?, ?, ?)
	`)).
		WithArgs("duplicate@example.com", "hash", models.RoleViewer).
		WillReturnError(&mysql.MySQLError{Number: 1062, Message: "duplicate"})

	user := &models.User{Email: "duplicate@example.com", PasswordHash: "hash", Role: models.RoleViewer}

	err = repo.Create(context.Background(), user)
	if !errors.Is(err, ErrUserAlreadyExists) {
		t.Fatalf("expected ErrUserAlreadyExists, got %v", err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("expectations were not met: %v", err)
	}
}
