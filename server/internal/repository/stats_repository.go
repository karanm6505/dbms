package repository

import (
	"context"
	"database/sql"

	"github.com/karanm6505/dbms/server/internal/models"
)

type StatsRepository struct {
	db *sql.DB
}

func NewStatsRepository(db *sql.DB) *StatsRepository {
	return &StatsRepository{db: db}
}

func (r *StatsRepository) GetDashboardStats(ctx context.Context) (models.DashboardStats, error) {
	var stats models.DashboardStats

	queries := map[string]*int{
		"SELECT COUNT(*) FROM student":                                    &stats.TotalStudents,
		"SELECT COUNT(*) FROM student WHERE Status = 'Active'":            &stats.ActiveStudents,
		"SELECT COUNT(*) FROM book":                                       &stats.TotalBooks,
		"SELECT COUNT(*) FROM book WHERE Status = 'Available'":            &stats.AvailableBooks,
		"SELECT COUNT(*) FROM book WHERE Status IN ('Issued','Borrowed')": &stats.BorrowedBooks,
		"SELECT COUNT(*) FROM staff":                                      &stats.TotalStaff,
	}

	for query, target := range queries {
		row := r.db.QueryRowContext(ctx, query)
		if err := row.Scan(target); err != nil {
			return models.DashboardStats{}, err
		}
	}

	return stats, nil
}
