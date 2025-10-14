package repository

import (
	"context"
	"database/sql"

	"github.com/karanm6505/dbms/server/internal/models"
)

type StudentRepository struct {
	db *sql.DB
}

func NewStudentRepository(db *sql.DB) *StudentRepository {
	return &StudentRepository{db: db}
}

func (r *StudentRepository) GetAll(ctx context.Context) ([]models.Student, error) {
	const query = `
		SELECT Student_ID, First_Name, Last_Name, Email, Status
		FROM student
		ORDER BY Student_ID
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	students := make([]models.Student, 0)

	for rows.Next() {
		var student models.Student
		if err := rows.Scan(&student.ID, &student.FirstName, &student.LastName, &student.Email, &student.Status); err != nil {
			return nil, err
		}
		students = append(students, student)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return students, nil
}

func (r *StudentRepository) GetByID(ctx context.Context, id int) (*models.Student, error) {
	const query = `
		SELECT Student_ID, First_Name, Last_Name, Email, Status
		FROM student
		WHERE Student_ID = ?
	`

	var student models.Student
	if err := r.db.QueryRowContext(ctx, query, id).Scan(&student.ID, &student.FirstName, &student.LastName, &student.Email, &student.Status); err != nil {
		return nil, err
	}

	return &student, nil
}

func (r *StudentRepository) Create(ctx context.Context, student *models.Student) error {
	const nextIDQuery = `
		SELECT COALESCE(MAX(Student_ID), 0) + 1
		FROM student
	`

	if err := r.db.QueryRowContext(ctx, nextIDQuery).Scan(&student.ID); err != nil {
		return err
	}

	const insertQuery = `
		INSERT INTO student (Student_ID, First_Name, Last_Name, Email, Status)
		VALUES (?, ?, ?, ?, ?)
	`

	_, err := r.db.ExecContext(ctx, insertQuery, student.ID, student.FirstName, student.LastName, student.Email, student.Status)
	return err
}
