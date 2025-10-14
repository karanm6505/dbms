package models

type Staff struct {
	ID        int    `json:"staff_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Position  string `json:"position"`
	Status    string `json:"status"`
}
