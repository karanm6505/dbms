package handlers

import "net/http"

func (h *Handler) GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.StatsRepo.GetDashboardStats(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch dashboard stats")
		return
	}

	writeJSON(w, http.StatusOK, stats)
}
