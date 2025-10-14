package handlers

import "net/http"

func (h *Handler) GetBooks(w http.ResponseWriter, r *http.Request) {
	books, err := h.BookRepo.GetAll(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch books")
		return
	}

	writeJSON(w, http.StatusOK, books)
}

func (h *Handler) GetAvailableBooks(w http.ResponseWriter, r *http.Request) {
	books, err := h.BookRepo.GetAvailable(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch available books")
		return
	}

	writeJSON(w, http.StatusOK, books)
}
