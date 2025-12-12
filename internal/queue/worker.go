package queue

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/Hardik180704/tempmail-pro.git/internal/processor"
	"github.com/hibiken/asynq"
)

type Worker struct {
	server *asynq.Server
}

func NewWorker(cfg config.RedisConfig) *Worker {
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
	return &Worker{server: server}
}

func (w *Worker) Start() {
	mux := asynq.NewServeMux()
	mux.HandleFunc(TypeEmailProcessing, HandleEmailProcessingTask)

	if err := w.server.Run(mux); err != nil {
		log.Fatalf("Could not run server: %v", err)
	}
}

func HandleEmailProcessingTask(ctx context.Context, t *asynq.Task) error {
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

	// In a real implementation, we would now save this structured 'email' object to DB
	// For now, we just log the results to prove it works
	log.Printf(">>> PARSED EMAIL: Subject='%s', From='%s' <<<", email.Subject, email.From)
	log.Printf(">>> EXTRACED: OTP='%s', LinkCount=%d <<<", otp, len(links))

	return nil
}
