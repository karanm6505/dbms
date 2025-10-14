package models

type BorrowRecord struct {
	ID          int    `json:"borrow_id"`
	StudentID   int    `json:"student_id"`
	StudentName string `json:"student_name"`
	BookID      int    `json:"book_id"`
	BookTitle   string `json:"book_title"`
	StaffID     int    `json:"staff_id"`
	StaffName   string `json:"staff_name"`
	IssueDate   string `json:"issue_date"`
	DueDate     string `json:"due_date"`
	Status      string `json:"status"`
}
