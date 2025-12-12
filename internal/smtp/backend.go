package smtp

import (
	"github.com/Hardik180704/tempmail-pro.git/internal/storage"
	"github.com/emersion/go-smtp"
)

// Backend implements smtp.Backend
type Backend struct {
	store storage.Store
}

func NewBackend(store storage.Store) *Backend {
	return &Backend{
		store: store,
	}
}

func (b *Backend) NewSession(c *smtp.Conn) (smtp.Session, error) {
	return NewSession(b.store), nil
}
