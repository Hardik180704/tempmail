package smtp

import (
	"errors"
	"io"
	"log"

	"github.com/Hardik180704/tempmail-pro.git/internal/storage"
	"github.com/emersion/go-smtp"
)

// Session holds the state of an SMTP session
type Session struct {
	store storage.Store
	from  string
	to    []string
}

func NewSession(store storage.Store) *Session {
	return &Session{
		store: store,
		to:    make([]string, 0),
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
	
	path, size, err := s.store.Save(r)
	if err != nil {
		log.Printf("Error saving email: %v", err)
		return err
	}

	log.Printf("Email saved to %s (size: %d bytes)", path, size)
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
