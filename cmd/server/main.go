package main

import (
	"fmt"
	"log"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	fmt.Printf("Starting TempMail Pro Service on port %s\n", cfg.Server.Port)
	fmt.Printf("Database Host: %s\n", cfg.Database.Host)
	fmt.Printf("SMTP Domain context: %s\n", cfg.SMTP.Domain)
}
