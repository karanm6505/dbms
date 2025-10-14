package models

type Book struct {
	ID            int    `json:"book_id"`
	Title         string `json:"title"`
	Author        string `json:"author"`
	Publisher     string `json:"publisher"`
	YearPublished int    `json:"year_published"`
	Genre         string `json:"genre"`
	Status        string `json:"status"`
}
