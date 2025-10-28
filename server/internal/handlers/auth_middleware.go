package handlers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt/v5"

	"github.com/karanm6505/dbms/server/internal/models"
)

type contextKey string

const userContextKey contextKey = "auth:user"

func (h *Handler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
		if authHeader == "" {
			writeError(w, http.StatusUnauthorized, "missing authorization header")
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			writeError(w, http.StatusUnauthorized, "invalid authorization header")
			return
		}

		tokenString := strings.TrimSpace(parts[1])
		if tokenString == "" {
			writeError(w, http.StatusUnauthorized, "invalid authorization header")
			return
		}

		claims := &userClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %s", token.Header["alg"])
			}
			return []byte(h.authConfig.JWTSecret), nil
		}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
		if err != nil {
			if errors.Is(err, jwt.ErrTokenExpired) {
				writeError(w, http.StatusUnauthorized, "token expired")
			} else {
				writeError(w, http.StatusUnauthorized, "invalid token")
			}
			return
		}

		if !token.Valid {
			writeError(w, http.StatusUnauthorized, "invalid token")
			return
		}

		userID, err := strconv.ParseInt(claims.Subject, 10, 64)
		if err != nil {
			writeError(w, http.StatusUnauthorized, "invalid token subject")
			return
		}

		user, err := h.UserRepo.GetByID(r.Context(), userID)
		if err != nil {
			writeError(w, http.StatusUnauthorized, "user not found")
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (h *Handler) currentUser(r *http.Request) (*models.User, bool) {
	value := r.Context().Value(userContextKey)
	if value == nil {
		return nil, false
	}

	user, ok := value.(*models.User)
	return user, ok
}

func (h *Handler) requireAdmin(w http.ResponseWriter, r *http.Request) (*models.User, bool) {
	user, ok := h.currentUser(r)
	if !ok {
		writeError(w, http.StatusUnauthorized, "authentication required")
		return nil, false
	}

	if !user.IsAdmin() {
		writeError(w, http.StatusForbidden, "administrator access required")
		return nil, false
	}

	return user, true
}
