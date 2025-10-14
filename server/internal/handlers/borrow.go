package handlers

import "net/http"

func (h *Handler) GetBorrowRecords(w http.ResponseWriter, r *http.Request) {
	records, err := h.BorrowRepo.GetAll(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch borrow records")
		return
	}

	writeJSON(w, http.StatusOK, records)
}
