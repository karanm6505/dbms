package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"net/mail"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"

	"github.com/karanm6505/dbms/server/internal/models"
)

type errorResponse struct {
	Error string `json:"error"`
}

type createStudentRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Status    string `json:"status"`
}

func (h *Handler) GetStudents(w http.ResponseWriter, r *http.Request) {
	students, err := h.StudentRepo.GetAll(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch students")
		return
	}

	writeJSON(w, http.StatusOK, students)
}

func (h *Handler) GetStudentByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	studentID, err := strconv.Atoi(idParam)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid student id")
		return
	}

	student, err := h.StudentRepo.GetByID(r.Context(), studentID)
	if err != nil {
		if err == sql.ErrNoRows {
			writeError(w, http.StatusNotFound, "student not found")
			return
		}
		writeError(w, http.StatusInternalServerError, "failed to fetch student")
		return
	}

	writeJSON(w, http.StatusOK, student)
}

func (h *Handler) CreateStudent(w http.ResponseWriter, r *http.Request) {
	if _, ok := h.requireAdmin(w, r); !ok {
		return
	}

	var req createStudentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastName = strings.TrimSpace(req.LastName)
	req.Email = strings.TrimSpace(req.Email)
	req.Status = strings.TrimSpace(req.Status)

	if req.FirstName == "" || req.LastName == "" || req.Email == "" {
		writeError(w, http.StatusBadRequest, "first_name, last_name, and email are required")
		return
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		writeError(w, http.StatusBadRequest, "invalid email address")
		return
	}

	if req.Status == "" {
		req.Status = "Active"
	}

	student := &models.Student{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Status:    req.Status,
	}

	if err := h.StudentRepo.Create(r.Context(), student); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create student")
		return
	}

	writeJSON(w, http.StatusCreated, student)
}
