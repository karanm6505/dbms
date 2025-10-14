package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
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

	handler := handlers.New(database, studentRepo, bookRepo, staffRepo, borrowRepo, statsRepo)

	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	router.Get("/api/health", handler.HealthCheck)
	router.Get("/api/students", handler.GetStudents)
	router.Get("/api/students/{id}", handler.GetStudentByID)
	router.Post("/api/students", handler.CreateStudent)
	router.Get("/api/books", handler.GetBooks)
	router.Get("/api/books/available", handler.GetAvailableBooks)
	router.Get("/api/staff", handler.GetStaff)
	router.Get("/api/borrows", handler.GetBorrowRecords)
	router.Get("/api/dashboard/stats", handler.GetDashboardStats)

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
