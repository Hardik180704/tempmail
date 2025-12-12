package queue

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/Hardik180704/tempmail-pro.git/internal/processor"
	"github.com/Hardik180704/tempmail-pro.git/internal/store"
	"github.com/hibiken/asynq"
)

type Worker struct {
	server *asynq.Server
	repo   store.Repository
}

func NewWorker(cfg config.RedisConfig, repo store.Repository) *Worker {
	server := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr:     cfg.Addr,
			Password: cfg.Password,
			DB:       cfg.DB,
		},
		asynq.Config{
			Concurrency: 5,
			Queues: map[string]int{
				"critical": 6,
				"default":  3,
				"low":      1,
			},
		},
	)
	return &Worker{server: server, repo: repo}
}

func (w *Worker) Start() {
	mux := asynq.NewServeMux()
	mux.HandleFunc(TypeEmailProcessing, w.HandleEmailProcessingTask)

	if err := w.server.Run(mux); err != nil {
		log.Fatalf("Could not run server: %v", err)
	}
}

func (w *Worker) HandleEmailProcessingTask(ctx context.Context, t *asynq.Task) error {
	var p EmailProcessingPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("json.Unmarshal failed: %v: %w", err, asynq.SkipRetry)
	}

	log.Printf("Processing email task: ID=%s Path=%s", p.EmailID, p.Path)

	// Parse the email
	email, err := processor.ParseEmail(p.Path)
	if err != nil {
		log.Printf("Failed to parse email: %v", err)
		return err
	}

	// Extract extra metadata
	otp := processor.ExtractOTP(email.TextBody)
	links := processor.ExtractLinks(email.TextBody)
	_ = otp // Store in DB later if we add field
	_ = links

	// Link to Address
	// Naive: assume single recipient in 'To' is our target
	// In reality we should check all recipients and see which one belongs to our system
	if len(email.To) > 0 {
		// Just take the first one or cleaner logic
		// TODO: Extract clean email address from "Name <email@domain.com>" format
		targetEmail := email.To[0] 
		addr, err := w.repo.GetAddressByEmail(targetEmail)
		if err == nil {
			email.AddressID = addr.ID
		} else {
			log.Printf("Address not found for %s, storing as orphan or assigning to catch-all", targetEmail)
			// Decide policy: Create on fly? Verify existence?
			// For now, if we can't find the address, we might drop it or save without AddressID (if nullable)
			// Let's assume we require an address.
		}
	}

	// Save to DB
	if err := w.repo.SaveEmail(email); err != nil {
		log.Printf("Failed to save email to DB: %v", err)
		return err // Retry
	}

	log.Printf(">>> SAVED EMAIL: ID=%s Subject='%s' <<<", email.ID, email.Subject)

	return nil
}
