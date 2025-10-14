package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/karanm6505/dbms/server/internal/models"
)

type BorrowRepository struct {
	db *sql.DB
}

func NewBorrowRepository(db *sql.DB) *BorrowRepository {
	return &BorrowRepository{db: db}
}

func (r *BorrowRepository) GetAll(ctx context.Context) ([]models.BorrowRecord, error) {
	const query = `
		SELECT 
			b.Borrow_ID,
			b.Student_ID,
			s.First_Name,
			s.Last_Name,
			b.Book_ID,
			bk.Title,
			b.Staff_ID,
			st.First_Name,
			st.Last_Name,
			b.Issue_Date,
			b.Due_Date,
			b.Status
		FROM borrow b
		JOIN student s ON b.Student_ID = s.Student_ID
		JOIN book bk ON b.Book_ID = bk.Book_ID
		JOIN staff st ON b.Staff_ID = st.Staff_ID
		ORDER BY b.Borrow_ID
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	records := make([]models.BorrowRecord, 0)

	for rows.Next() {
		var (
			record       models.BorrowRecord
			studentFirst string
			studentLast  string
			staffFirst   string
			staffLast    string
			issueDate    sql.NullTime
			dueDate      sql.NullTime
		)

		if err := rows.Scan(
			&record.ID,
			&record.StudentID,
			&studentFirst,
			&studentLast,
			&record.BookID,
			&record.BookTitle,
			&record.StaffID,
			&staffFirst,
			&staffLast,
			&issueDate,
			&dueDate,
			&record.Status,
		); err != nil {
			return nil, err
		}

		record.StudentName = studentFirst + " " + studentLast
		record.StaffName = staffFirst + " " + staffLast

		record.IssueDate = formatDate(issueDate)
		record.DueDate = formatDate(dueDate)

		records = append(records, record)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return records, nil
}

func formatDate(value sql.NullTime) string {
	if !value.Valid {
		return ""
	}
	return value.Time.Format(time.DateOnly)
}
