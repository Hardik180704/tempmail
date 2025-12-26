package smtp

import (
	"fmt"
	"log"
	"time"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/Hardik180704/tempmail-pro.git/internal/queue"
	"github.com/Hardik180704/tempmail-pro.git/internal/storage"
	"github.com/emersion/go-smtp"
)

// Server represents the SMTP server
type Server struct {
	smtpServer *smtp.Server
}

func NewServer(cfg config.SMTPConfig, store storage.Store, queueClient *queue.Client) *Server {
	be := NewBackend(store, queueClient)

	s := smtp.NewServer(be)
	s.Addr = fmt.Sprintf(":%d", cfg.Port)
	s.Domain = cfg.Domain
	s.ReadTimeout = 10 * time.Second
	s.WriteTimeout = 10 * time.Second
	s.MaxMessageBytes = cfg.MaxSize
	s.MaxRecipients = 50
	s.AllowInsecureAuth = true

	return &Server{
		smtpServer: s,
	}
}

func (s *Server) Start() error {
	log.Printf("Starting SMTP server at %s", s.smtpServer.Addr)
	return s.smtpServer.ListenAndServe()
}
