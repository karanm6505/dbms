package handlers

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/karanm6505/dbms/server/internal/repository"
)

type executeRequest struct {
	Arguments []any `json:"arguments"`
}

func (h *Handler) GetTables(w http.ResponseWriter, r *http.Request) {
	tables, err := h.MetadataRepo.ListTables(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch tables")
		return
	}

	writeJSON(w, http.StatusOK, tables)
}

func (h *Handler) GetFunctions(w http.ResponseWriter, r *http.Request) {
	functions, err := h.MetadataRepo.ListFunctions(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch functions")
		return
	}

	writeJSON(w, http.StatusOK, functions)
}

func (h *Handler) GetProcedures(w http.ResponseWriter, r *http.Request) {
	procedures, err := h.MetadataRepo.ListProcedures(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch procedures")
		return
	}

	writeJSON(w, http.StatusOK, procedures)
}

func (h *Handler) GetTriggers(w http.ResponseWriter, r *http.Request) {
	triggers, err := h.MetadataRepo.ListTriggers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch triggers")
		return
	}

	writeJSON(w, http.StatusOK, triggers)
}

func (h *Handler) ExecuteProcedure(w http.ResponseWriter, r *http.Request) {
	if _, ok := h.requireAdmin(w, r); !ok {
		return
	}

	name := chi.URLParam(r, "name")

	req, err := decodeExecuteRequest(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	rows, err := h.MetadataRepo.ExecuteProcedure(r.Context(), name, req.Arguments)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, repository.ErrInvalidIdentifier) {
			status = http.StatusBadRequest
		}
		writeError(w, status, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"name": name,
		"rows": rows,
	})
}

func (h *Handler) ExecuteFunction(w http.ResponseWriter, r *http.Request) {
	if _, ok := h.requireAdmin(w, r); !ok {
		return
	}

	name := chi.URLParam(r, "name")

	req, err := decodeExecuteRequest(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	result, err := h.MetadataRepo.ExecuteFunction(r.Context(), name, req.Arguments)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, repository.ErrInvalidIdentifier) {
			status = http.StatusBadRequest
		}
		writeError(w, status, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"name":   name,
		"result": result,
	})
}

func decodeExecuteRequest(r *http.Request) (executeRequest, error) {
	var payload executeRequest

	if r.Body == nil || r.Body == http.NoBody {
		return payload, nil
	}
	defer r.Body.Close()

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&payload); err != nil {
		if errors.Is(err, io.EOF) {
			return payload, nil
		}
		return payload, err
	}

	return payload, nil
}
