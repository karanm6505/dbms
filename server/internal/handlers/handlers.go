package handlers

import (
	"database/sql"

	"github.com/karanm6505/dbms/server/internal/repository"
)

type Handler struct {
	DB          *sql.DB
	StudentRepo *repository.StudentRepository
	BookRepo    *repository.BookRepository
	StaffRepo   *repository.StaffRepository
	BorrowRepo  *repository.BorrowRepository
	StatsRepo   *repository.StatsRepository
}

func New(
	db *sql.DB,
	studentRepo *repository.StudentRepository,
	bookRepo *repository.BookRepository,
	staffRepo *repository.StaffRepository,
	borrowRepo *repository.BorrowRepository,
	statsRepo *repository.StatsRepository,
) *Handler {
	return &Handler{
		DB:          db,
		StudentRepo: studentRepo,
		BookRepo:    bookRepo,
		StaffRepo:   staffRepo,
		BorrowRepo:  borrowRepo,
		StatsRepo:   statsRepo,
	}
}
