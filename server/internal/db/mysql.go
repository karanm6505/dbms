package db

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/karanm6505/dbms/server/internal/config"

	_ "github.com/go-sql-driver/mysql"
)

func Connect(cfg config.DatabaseConfig) (*sql.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&multiStatements=true",
		cfg.User,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.Name,
	)

	database, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	database.SetMaxOpenConns(10)
	database.SetMaxIdleConns(5)
	database.SetConnMaxLifetime(time.Hour)

	if err := database.Ping(); err != nil {
		return nil, err
	}

	return database, nil
}
