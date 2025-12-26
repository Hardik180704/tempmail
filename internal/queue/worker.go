package queue

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/Hardik180704/tempmail-pro.git/internal/domain"
	"github.com/Hardik180704/tempmail-pro.git/internal/processor"
	"github.com/Hardik180704/tempmail-pro.git/internal/store"
	"github.com/Hardik180704/tempmail-pro.git/internal/webhook"
	"github.com/hibiken/asynq"
)

type Worker struct {
	server      *asynq.Server
	repo        store.Repository
	queueClient *Client // Add reference back to client to enqueue new tasks
}

func NewWorker(cfg config.RedisConfig, repo store.Repository, queueClient *Client) *Worker {
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
	return &Worker{server: server, repo: repo, queueClient: queueClient}
}

func (w *Worker) Start() {
	mux := asynq.NewServeMux()
	mux.HandleFunc(TypeEmailProcessing, w.HandleEmailProcessingTask)
	mux.HandleFunc(TypeWebhookDelivery, w.HandleWebhookDeliveryTask)

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
	var webhookURL string
	if len(email.To) > 0 {
		targetEmail := email.To[0]
		addr, err := w.repo.GetAddressByEmail(targetEmail)
		if err == nil {
			email.AddressID = addr.ID
			webhookURL = addr.WebhookURL
		} else {
			log.Printf("Address not found for %s", targetEmail)
		}
	}

	// Save to DB
	if err := w.repo.SaveEmail(email); err != nil {
		log.Printf("Failed to save email to DB: %v", err)
		return err // Retry
	}

	log.Printf(">>> SAVED EMAIL: ID=%s Subject='%s' <<<", email.ID, email.Subject)

	// Trigger Webhook if configured
	if webhookURL != "" {
		// Create a separate client here or reuse one passed to worker?
		// For simplicity, let's create a ephemeral client or better: pass client to Worker
		// But Wait! Worker doesn't have reference to Queue Client.
		// We can initialize one. Ideally Worker struct should have it.
		// Let's create a task manually if we can, or just create a new client.
		// Creating new client is cheap-ish.
		
		// Ideally we inject Queue Client into Worker. Let's do that in next step.
		// For now, assume w.queueClient exists. WE MUST UPDATE WORKER STRUCT.
		if w.queueClient != nil {
			w.queueClient.EnqueueWebhookDelivery(email.AddressID, email.ID, webhookURL, email)
		}
	}

	return nil
}

func (w *Worker) HandleWebhookDeliveryTask(ctx context.Context, t *asynq.Task) error {
	var p WebhookDeliveryPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("json.Unmarshal failed: %v: %w", err, asynq.SkipRetry)
	}

	log.Printf("Delivering webhook to %s (Attempt %d)", p.URL, p.Attempt)

	statusCode, respBody, err := webhook.SendWebhook(p.URL, p.Data, "secret-key") // TODO: Configurable secret

	// Log attempt
	wl := &domain.WebhookLog{
		AddressID:    p.AddressID,
		EmailID:      p.EmailID,
		URL:          p.URL,
		StatusCode:   statusCode,
		Success:      err == nil,
		Attempt:      p.Attempt,
		Response:     respBody,
		ErrorMessage: "",
	}
	if err != nil {
		wl.ErrorMessage = err.Error()
	}
	
	_ = w.repo.CreateWebhookLog(wl)

	if err != nil {
		log.Printf("Webhook failed: %v", err)
		return err // Asynq will retry
	}

	log.Printf("Webhook delivered successfully to %s", p.URL)
	return nil
}
