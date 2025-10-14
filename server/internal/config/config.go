package config

import (
	"log"
	"os"
	"strconv"
)

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
}

type APIConfig struct {
	Port int
}

type Config struct {
	API      APIConfig
	Database DatabaseConfig
}

func Load() Config {
	port := getEnvAsInt("API_PORT", 5050)

	return Config{
		API: APIConfig{Port: port},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "3306"),
			User:     getEnv("DB_USER", "root"),
			Password: getEnv("DB_PASSWORD", ""),
			Name:     getEnv("DB_NAME", "Library_Management_System"),
		},
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		if parsed, err := strconv.Atoi(value); err == nil {
			return parsed
		}
		log.Printf("warning: %s must be an integer, falling back to %d", key, fallback)
	}
	return fallback
}
