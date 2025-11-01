package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	"github.com/karanm6505/dbms/server/internal/config"
	"github.com/karanm6505/dbms/server/internal/db"
	"github.com/karanm6505/dbms/server/internal/handlers"
	"github.com/karanm6505/dbms/server/internal/repository"
)

func main() {
	_ = godotenv.Load()

	cfg := config.Load()

	database, err := db.Connect(cfg.Database)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer database.Close()

	studentRepo := repository.NewStudentRepository(database)
	bookRepo := repository.NewBookRepository(database)
	staffRepo := repository.NewStaffRepository(database)
	borrowRepo := repository.NewBorrowRepository(database)
	statsRepo := repository.NewStatsRepository(database)
	metadataRepo := repository.NewMetadataRepository(database, cfg.Database.Name)
	userRepo := repository.NewUserRepository(database)

	handler := handlers.New(
		database,
		studentRepo,
		bookRepo,
		staffRepo,
		borrowRepo,
		statsRepo,
		metadataRepo,
		userRepo,
		cfg.Auth,
	)

	allowedOrigins := []string{
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"http://localhost:8080",
		"http://127.0.0.1:8080",
	}

	if rawOrigins := os.Getenv("FRONTEND_ORIGINS"); rawOrigins != "" {
		for _, origin := range strings.Split(rawOrigins, ",") {
			if trimmed := strings.TrimSpace(origin); trimmed != "" {
				allowedOrigins = append(allowedOrigins, trimmed)
			}
		}
	}

	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	router.Get("/api/health", handler.HealthCheck)
	router.Post("/api/auth/login", handler.Login)
	router.Post("/api/auth/register", handler.Register)

	router.Group(func(r chi.Router) {
		r.Use(handler.AuthMiddleware)

	r.Get("/api/auth/me", handler.Me)
	r.Get("/api/students", handler.GetStudents)
		r.Get("/api/students/{id}", handler.GetStudentByID)
		r.Post("/api/students", handler.CreateStudent)
		r.Get("/api/books", handler.GetBooks)
		r.Get("/api/books/available", handler.GetAvailableBooks)
		r.Get("/api/staff", handler.GetStaff)
		r.Get("/api/borrows", handler.GetBorrowRecords)
		r.Get("/api/dashboard/stats", handler.GetDashboardStats)
		r.Get("/api/schema/tables", handler.GetTables)
		r.Get("/api/schema/functions", handler.GetFunctions)
		r.Get("/api/schema/procedures", handler.GetProcedures)
		r.Get("/api/schema/triggers", handler.GetTriggers)
		r.Post("/api/schema/functions/{name}/execute", handler.ExecuteFunction)
		r.Post("/api/schema/procedures/{name}/execute", handler.ExecuteProcedure)
	})

	server := &http.Server{
		Addr:              fmt.Sprintf(":%d", cfg.API.Port),
		Handler:           router,
		ReadHeaderTimeout: 15 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		log.Printf("Library API listening on http://localhost:%d", cfg.API.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	waitForShutdown(server)
}

func waitForShutdown(server *http.Server) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	<-quit
	log.Println("shutdown signal received")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("graceful shutdown failed: %v", err)
		if err := server.Close(); err != nil {
			log.Printf("force close error: %v", err)
		}
	}
	log.Println("server stopped")
}
