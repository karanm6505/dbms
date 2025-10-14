package repository

import (
	"context"
	"database/sql"

	"github.com/karanm6505/dbms/server/internal/models"
)

type StaffRepository struct {
	db *sql.DB
}

func NewStaffRepository(db *sql.DB) *StaffRepository {
	return &StaffRepository{db: db}
}

func (r *StaffRepository) GetAll(ctx context.Context) ([]models.Staff, error) {
	const query = `
		SELECT Staff_ID, First_Name, Last_Name, Position, Status
		FROM staff
		ORDER BY Staff_ID
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	staffMembers := make([]models.Staff, 0)

	for rows.Next() {
		var staff models.Staff
		if err := rows.Scan(&staff.ID, &staff.FirstName, &staff.LastName, &staff.Position, &staff.Status); err != nil {
			return nil, err
		}
		staffMembers = append(staffMembers, staff)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return staffMembers, nil
}
