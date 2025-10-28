package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/go-sql-driver/mysql"

	"github.com/karanm6505/dbms/server/internal/models"
)

var ErrUserAlreadyExists = errors.New("user already exists")

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	const query = `
		SELECT user_id, email, password_hash, role, created_at, updated_at
		FROM users
		WHERE email = ?
	`

	user := &models.User{}
	if err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	); err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id int64) (*models.User, error) {
	const query = `
		SELECT user_id, email, password_hash, role, created_at, updated_at
		FROM users
		WHERE user_id = ?
	`

	user := &models.User{}
	if err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	); err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) Create(ctx context.Context, user *models.User) error {
	const query = `
		INSERT INTO users (email, password_hash, role)
		VALUES (?, ?, ?)
	`

	result, err := r.db.ExecContext(ctx, query, user.Email, user.PasswordHash, user.Role)
	if err != nil {
		var mysqlErr *mysql.MySQLError
		if errors.As(err, &mysqlErr) && mysqlErr.Number == 1062 {
			return ErrUserAlreadyExists
		}
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	fresh, err := r.GetByID(ctx, id)
	if err != nil {
		return err
	}

	*user = *fresh
	return nil
}
