package handlers

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestDecodeExecuteRequestNilBody(t *testing.T) {
	r := httptest.NewRequest(http.MethodPost, "/", nil)

	payload, err := decodeExecuteRequest(r)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if payload.Arguments != nil && len(payload.Arguments) != 0 {
		t.Fatalf("expected no arguments, got %v", payload.Arguments)
	}
}

func TestDecodeExecuteRequestEmptyJSON(t *testing.T) {
	body := bytes.NewBufferString(`{}`)
	r := httptest.NewRequest(http.MethodPost, "/", body)

	payload, err := decodeExecuteRequest(r)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if len(payload.Arguments) != 0 {
		t.Fatalf("expected empty arguments, got %v", payload.Arguments)
	}
}

func TestDecodeExecuteRequestWithArguments(t *testing.T) {
	json := `{"arguments": [1, "two", true]}`
	r := httptest.NewRequest(http.MethodPost, "/", bytes.NewBufferString(json))

	payload, err := decodeExecuteRequest(r)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if len(payload.Arguments) != 3 {
		t.Fatalf("expected 3 arguments, got %d", len(payload.Arguments))
	}
}

func TestDecodeExecuteRequestInvalidJSON(t *testing.T) {
	r := httptest.NewRequest(http.MethodPost, "/", bytes.NewBufferString(`{`))

	_, err := decodeExecuteRequest(r)
	if err == nil {
		t.Fatal("expected error for invalid json")
	}
}
