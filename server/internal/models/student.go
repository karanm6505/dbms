package models

type Student struct {
	ID        int    `json:"student_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Status    string `json:"status"`
}
