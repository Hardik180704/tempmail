package domain

import (
	"time"

	"github.com/lib/pq"
)

// Address represents a temporary email address
type Address struct {
	ID         string    `json:"id"`
	Email      string    `json:"email"`
	UserID     string    `json:"user_id,omitempty"` // For authenticated users/API keys
	Alias      string    `json:"alias,omitempty"`
	WebhookURL string    `json:"webhook_url,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	ExpiresAt  time.Time `json:"expires_at"`
	IsActive   bool      `json:"is_active"`
}

// WebhookLog tracks webhook delivery attempts
type WebhookLog struct {
	ID           string    `json:"id"`
	AddressID    string    `json:"address_id"`
	EmailID      string    `json:"email_id"`
	URL          string    `json:"url"`
	StatusCode   int       `json:"status_code"`
	Success      bool      `json:"success"`
	Attempt      int       `json:"attempt"`
	Response     string    `json:"response"` // Truncated response body
	ErrorMessage string    `json:"error_message"`
	CreatedAt    time.Time `json:"created_at"`
}

// Email represents a received email message
type Email struct {
	ID          string         `json:"id"`
	AddressID   string         `json:"address_id"`
	Subject     string         `json:"subject"`
	From        string         `json:"from"`
	To          pq.StringArray `json:"to" gorm:"type:text[]"`
	TextBody    string         `json:"text_body"`
	HTMLBody    string         `json:"html_body"`
	RawContent  string         `json:"raw_content,omitempty"` // Stored in S3/Blob, only path or content here
	Attachments []Attachment   `json:"attachments" gorm:"foreignKey:EmailID"`
	ReceivedAt  time.Time      `json:"received_at"`
	Size        int64          `json:"size"`
	IsRead      bool           `json:"is_read"`
}

// Attachment represents an email attachment
type Attachment struct {
	ID          string `json:"id"`
	EmailID     string `json:"email_id"`
	Filename    string `json:"filename"`
	ContentType string `json:"content_type"`
	Size        int64  `json:"size"`
	Path        string `json:"path"` // Path to object storage
}
