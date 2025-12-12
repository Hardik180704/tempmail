package smtp

import (
	"errors"
	"io"
	"log"

	"github.com/Hardik180704/tempmail-pro.git/internal/queue"
	"github.com/Hardik180704/tempmail-pro.git/internal/storage"
	"github.com/emersion/go-smtp"
)

// Session holds the state of an SMTP session
type Session struct {
	store       storage.Store
	queueClient *queue.Client
	from        string
	to          []string
}

func NewSession(store storage.Store, queueClient *queue.Client) *Session {
	return &Session{
		store:       store,
		queueClient: queueClient,
		to:          make([]string, 0),
	}
}

func (s *Session) Mail(from string, opts *smtp.MailOptions) error {
	log.Printf("MAIL FROM:%s", from)
	s.from = from
	return nil
}

func (s *Session) Rcpt(to string, opts *smtp.RcptOptions) error {
	log.Printf("RCPT TO:%s", to)
	// TODO: Validate if "to" address exists or domain is valid
	s.to = append(s.to, to)
	return nil
}

func (s *Session) Data(r io.Reader) error {
	log.Printf("DATA received from %s", s.from)

	path, _, err := s.store.Save(r)
	if err != nil {
		log.Printf("Error saving email: %v", err)
		return err
	}

	// Extract ID from path (naive approach for now, assuming filename is ID.eml)
	// In production, Store.Save should return ID explicitly
	// For now we just pass "unknown-id" or parse it back
	
	// Enqueue for processing
	if err := s.queueClient.EnqueueEmailProcessing("email-id-placeholder", path); err != nil {
		log.Printf("Failed to enqueue email processing: %v", err)
		// We don't fail the SMTP transaction if queue fails, but we should alert
	}

	log.Printf("Email saved to %s and enqueued for processing", path)
	return nil
}

func (s *Session) Reset() {
	s.from = ""
	s.to = make([]string, 0)
}

func (s *Session) Logout() error {
	return nil
}

// AuthPlain is not supported for now as we are a receiving server (mostly open or specialized auth)
// But for a public temp mail, we generally don't require AUTH for incoming mail from other MTAs
// However, go-smtp requires Login if Auth is enabled. We will disable Auth for now.
func (s *Session) AuthPlain(username, password string) error {
	return errors.New("auth not supported")
}
