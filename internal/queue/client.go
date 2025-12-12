package queue

import (
	"encoding/json"
	"log"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/hibiken/asynq"
)

const (
	TypeEmailProcessing = "email:process"
)

type EmailProcessingPayload struct {
	EmailID string
	Path    string
}

type Client struct {
	client *asynq.Client
}

func NewClient(cfg config.RedisConfig) *Client {
	client := asynq.NewClient(asynq.RedisClientOpt{
		Addr:     cfg.Addr,
		Password: cfg.Password,
		DB:       cfg.DB,
	})
	return &Client{client: client}
}

func (c *Client) EnqueueEmailProcessing(emailID string, path string) error {
	payload, err := json.Marshal(EmailProcessingPayload{EmailID: emailID, Path: path})
	if err != nil {
		return err
	}

	task := asynq.NewTask(TypeEmailProcessing, payload)
	info, err := c.client.Enqueue(task)
	if err != nil {
		return err
	}
	log.Printf("Enqueued task: id=%s queue=%s", info.ID, info.Queue)
	return nil
}

func (c *Client) Close() {
	c.client.Close()
}
