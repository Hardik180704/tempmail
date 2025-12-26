package queue

import (
	"encoding/json"
	"log"
	"time"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/hibiken/asynq"
)

const (
	TypeEmailProcessing = "email:process"
	TypeWebhookDelivery = "webhook:deliver"
)

type EmailProcessingPayload struct {
	EmailID string
	Path    string
}

type WebhookDeliveryPayload struct {
	AddressID string      `json:"address_id"`
	EmailID   string      `json:"email_id"`
	URL       string      `json:"url"`
	Data      interface{} `json:"data"`
	Attempt   int         `json:"attempt"`
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

func (c *Client) EnqueueWebhookDelivery(addressID, emailID, url string, data interface{}) error {
	payload, err := json.Marshal(WebhookDeliveryPayload{
		AddressID: addressID,
		EmailID:   emailID,
		URL:       url,
		Data:      data,
	})
	if err != nil {
		return err
	}

	task := asynq.NewTask(TypeWebhookDelivery, payload, asynq.MaxRetry(3), asynq.Timeout(20*time.Second))
	info, err := c.client.Enqueue(task)
	if err != nil {
		return err
	}
	log.Printf("Enqueued webhook task: id=%s queue=%s", info.ID, info.Queue)
	return nil
}

func (c *Client) Close() {
	c.client.Close()
}
