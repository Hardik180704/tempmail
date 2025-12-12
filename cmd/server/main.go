package main

import (
	"log"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/Hardik180704/tempmail-pro.git/internal/queue"
	"github.com/Hardik180704/tempmail-pro.git/internal/smtp"
	"github.com/Hardik180704/tempmail-pro.git/internal/storage"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize Storage
	store, err := storage.NewLocalStore("storage/raw")
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}

	// Initialize Queue Client
	queueClient := queue.NewClient(cfg.Redis)
	defer queueClient.Close()

	// Initialize and Start Queue Worker
	worker := queue.NewWorker(cfg.Redis)
	go worker.Start()

	// Initialize SMTP Server
	smtpServer := smtp.NewServer(cfg.SMTP, store, queueClient)

	// Start SMTP Server
	go func() {
		if err := smtpServer.Start(); err != nil {
			log.Fatalf("Failed to start SMTP server: %v", err)
		}
	}()

	// Keep the main function running
	select {}
}
