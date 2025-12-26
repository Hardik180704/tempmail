package storage

import (
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

// Store interface for saving email content
type Store interface {
	Save(r io.Reader) (string, int64, error)
}

// LocalStore implements Store using local file system
type LocalStore struct {
	basePath string
}

func NewLocalStore(basePath string) (*LocalStore, error) {
	if err := os.MkdirAll(basePath, 0755); err != nil {
		return nil, err
	}
	return &LocalStore{basePath: basePath}, nil
}

func (s *LocalStore) Save(r io.Reader) (string, int64, error) {
	id := uuid.New().String()
	filename := fmt.Sprintf("%s.eml", id)
	path := filepath.Join(s.basePath, filename)

	f, err := os.Create(path)
	if err != nil {
		return "", 0, err
	}
	defer f.Close()

	n, err := io.Copy(f, r)
	if err != nil {
		return "", 0, err
	}

	return path, n, nil
}
