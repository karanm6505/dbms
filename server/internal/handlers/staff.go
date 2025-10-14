package handlers

import "net/http"

func (h *Handler) GetStaff(w http.ResponseWriter, r *http.Request) {
	staff, err := h.StaffRepo.GetAll(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch staff")
		return
	}

	writeJSON(w, http.StatusOK, staff)
}
