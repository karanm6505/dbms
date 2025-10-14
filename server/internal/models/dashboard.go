package models

type DashboardStats struct {
	TotalStudents  int `json:"total_students"`
	ActiveStudents int `json:"active_students"`
	TotalBooks     int `json:"total_books"`
	AvailableBooks int `json:"available_books"`
	BorrowedBooks  int `json:"borrowed_books"`
	TotalStaff     int `json:"total_staff"`
}
