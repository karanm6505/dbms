package repository

import "testing"

func TestBuildPlaceholders(t *testing.T) {
	tests := []struct {
		name   string
		count  int
		expect string
	}{
		{"zero", 0, ""},
		{"one", 1, "?"},
		{"three", 3, "?,?,?"},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := buildPlaceholders(tc.count)
			if got != tc.expect {
				t.Fatalf("expected %q, got %q", tc.expect, got)
			}
		})
	}
}

func TestBuildCallableQuery(t *testing.T) {
	tests := []struct {
		name   string
		args   int
		expect string
	}{
		{"noArgs", 0, "CALL sample()"},
		{"withArgs", 2, "CALL sample(?,?)"},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := buildCallableQuery("CALL", "sample", tc.args)
			if got != tc.expect {
				t.Fatalf("expected %q, got %q", tc.expect, got)
			}
		})
	}
}

func TestIsValidIdentifier(t *testing.T) {
	tests := []struct {
		identifier string
		valid      bool
	}{
		{"valid_name", true},
		{"_underscore", true},
		{"1invalid", false},
		{"invalid-name", false},
	}

	for _, tc := range tests {
		t.Run(tc.identifier, func(t *testing.T) {
			if got := isValidIdentifier(tc.identifier); got != tc.valid {
				t.Fatalf("expected %v", tc.valid)
			}
		})
	}
}

func TestNormalizeDBValue(t *testing.T) {
	t.Run("nil stays nil", func(t *testing.T) {
		if normalizeDBValue(nil) != nil {
			t.Fatal("expected nil value to remain nil")
		}
	})

	t.Run("binary converts to string", func(t *testing.T) {
		got := normalizeDBValue([]byte("hello"))
		if got != "hello" {
			t.Fatalf("expected 'hello', got %T(%v)", got, got)
		}
	})

	t.Run("other types stay the same", func(t *testing.T) {
		value := 42
		if got := normalizeDBValue(value); got != value {
			t.Fatalf("expected %v, got %v", value, got)
		}
	})
}
