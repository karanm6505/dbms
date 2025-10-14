package repository

import (
	"context"
	"database/sql"

	"github.com/karanm6505/dbms/server/internal/models"
)

type BookRepository struct {
	db *sql.DB
}

func NewBookRepository(db *sql.DB) *BookRepository {
	return &BookRepository{db: db}
}

func (r *BookRepository) GetAll(ctx context.Context) ([]models.Book, error) {
	const query = `
		SELECT Book_ID, Title, Author, Publisher, Year_Published, Genre, Status
		FROM book
		ORDER BY Book_ID
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	books := make([]models.Book, 0)

	for rows.Next() {
		var book models.Book
		if err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Publisher, &book.YearPublished, &book.Genre, &book.Status); err != nil {
			return nil, err
		}
		books = append(books, book)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return books, nil
}

func (r *BookRepository) GetAvailable(ctx context.Context) ([]models.Book, error) {
	const query = `
		SELECT Book_ID, Title, Author, Publisher, Year_Published, Genre, Status
		FROM book
		WHERE Status = 'Available'
		ORDER BY Title
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	books := make([]models.Book, 0)

	for rows.Next() {
		var book models.Book
		if err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Publisher, &book.YearPublished, &book.Genre, &book.Status); err != nil {
			return nil, err
		}
		books = append(books, book)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return books, nil
}
