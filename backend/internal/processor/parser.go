package processor

import (
	"os"
	"time"

	"github.com/Hardik180704/tempmail-pro.git/internal/domain"
	"github.com/jhillyerd/enmime"
	"github.com/lib/pq"
)

func ParseEmail(path string) (*domain.Email, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	env, err := enmime.ReadEnvelope(file)
	if err != nil {
		return nil, err
	}

	// Basic metadata
	email := &domain.Email{
		Subject:    env.GetHeader("Subject"),
		From:       env.GetHeader("From"),
		ReceivedAt: time.Now(), // Ideally parsing 'Date' header or file mod time
		TextBody:   env.Text,
		HTMLBody:   SanitizeHTML(env.HTML),
	}

	// Recipients
	to := env.GetHeader("To")
	if to != "" {
		email.To = pq.StringArray{to}
	}

	// Attachments (Metadata only)
	for _, att := range env.Attachments {
		email.Attachments = append(email.Attachments, domain.Attachment{
			Filename:    att.FileName,
			ContentType: att.ContentType,
			Size:        int64(len(att.Content)),
			// We aren't saving attachment content separately yet in this phase
		})
	}

	return email, nil
}
