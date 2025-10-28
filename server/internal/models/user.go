package models

import "time"

type Role string

const (
	RoleAdmin  Role = "admin"
	RoleViewer Role = "viewer"
)

type User struct {
	ID           int64     `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         Role      `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (r Role) IsValid() bool {
	switch r {
	case RoleAdmin, RoleViewer:
		return true
	default:
		return false
	}
}

func (u *User) IsAdmin() bool {
	return u.Role == RoleAdmin
}
