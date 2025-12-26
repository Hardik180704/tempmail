package main

import (
	"log"
	"time"

	"github.com/Hardik180704/tempmail-pro.git/internal/api"
	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/Hardik180704/tempmail-pro.git/internal/queue"
	"github.com/Hardik180704/tempmail-pro.git/internal/scheduler"
	"github.com/Hardik180704/tempmail-pro.git/internal/smtp"
	"github.com/Hardik180704/tempmail-pro.git/internal/storage"
	storePkg "github.com/Hardik180704/tempmail-pro.git/internal/store"
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

	// Initialize Database
	db, err := storePkg.NewDB(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Initialize Repository
	repo := storePkg.NewRepository(db)

	// Initialize Queue Client
	queueClient := queue.NewClient(cfg.Redis)
	defer queueClient.Close()

	// Initialize and Start Queue Worker
	// Worker needs repo now
	worker := queue.NewWorker(cfg.Redis, repo, queueClient)
	go worker.Start()

	// Initialize API
	apiHandler := api.NewHandler(repo)
	r := api.NewRouter(apiHandler, cfg.Redis)

	// Start API Server
	go func() {
		log.Printf("Starting API server on %s", cfg.Server.Port)
		if err := r.Run(cfg.Server.Port); err != nil {
			log.Fatalf("Failed to start API server: %v", err)
		}
	}()

	// Initialize SMTP Server
	smtpServer := smtp.NewServer(cfg.SMTP, store, queueClient)

	// Start SMTP Server
	go func() {
		if err := smtpServer.Start(); err != nil {
			log.Fatalf("Failed to start SMTP server: %v", err)
		}
	}()

	// Start Cleanup Job
	scheduler.StartCleanupJob(repo, 1*time.Hour)

	// Keep the main function running
	select {}
}
