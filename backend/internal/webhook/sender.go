package webhook

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type WebhookPayload struct {
	Event     string      `json:"event"`
	Timestamp time.Time   `json:"timestamp"`
	Data      interface{} `json:"data"`
}

func SendWebhook(url string, payload interface{}, secret string) (int, string, error) {
	// Wrap payload
	container := WebhookPayload{
		Event:     "email_received",
		Timestamp: time.Now(),
		Data:      payload,
	}

	body, err := json.Marshal(container)
	if err != nil {
		return 0, "", fmt.Errorf("marshal failed: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return 0, "", fmt.Errorf("new request failed: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	
	// HMAC Signing
	if secret != "" {
		h := hmac.New(sha256.New, []byte(secret))
		h.Write(body)
		signature := hex.EncodeToString(h.Sum(nil))
		req.Header.Set("X-Webhook-Signature", signature)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return 0, "", err
	}
	defer resp.Body.Close()

	// Read limited response
	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	respBody := buf.String()
	if len(respBody) > 1024 {
		respBody = respBody[:1024] + "..."
	}

	if resp.StatusCode >= 300 {
		return resp.StatusCode, respBody, fmt.Errorf("status %d", resp.StatusCode)
	}

	return resp.StatusCode, respBody, nil
}
