package smtp

import (
	"github.com/Hardik180704/tempmail-pro.git/internal/queue"
	"github.com/Hardik180704/tempmail-pro.git/internal/storage"
	"github.com/emersion/go-smtp"
)

// Backend implements smtp.Backend
type Backend struct {
	store       storage.Store
	queueClient *queue.Client
}

func NewBackend(store storage.Store, queueClient *queue.Client) *Backend {
	return &Backend{
		store:       store,
		queueClient: queueClient,
	}
}

func (b *Backend) NewSession(c *smtp.Conn) (smtp.Session, error) {
	return NewSession(b.store, b.queueClient), nil
}
