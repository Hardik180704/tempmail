package store

import (
	"time"

	"github.com/Hardik180704/tempmail-pro.git/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	CreateAddress(alias string, webhookURL string) (*domain.Address, error)
	CreateWebhookLog(log *domain.WebhookLog) error
	GetAddress(id string) (*domain.Address, error)
	GetAddressByEmail(email string) (*domain.Address, error)
	SaveEmail(email *domain.Email) error
	GetEmails(addressID string) ([]domain.Email, error)
	GetEmail(id string) (*domain.Email, error)
}

type GormRepository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *GormRepository {
	return &GormRepository{db: db}
}

func (r *GormRepository) CreateAddress(alias string, webhookURL string) (*domain.Address, error) {
	addr := &domain.Address{
		ID:         uuid.New().String(),
		Email:      alias + "@temp-mail.dev", // TODO: Config
		Alias:      alias,
		WebhookURL: webhookURL,
		CreatedAt:  time.Now(),
		ExpiresAt:  time.Now().Add(24 * time.Hour),
		IsActive:   true,
	}

	if err := r.db.Create(addr).Error; err != nil {
		return nil, err
	}
	return addr, nil
}

func (r *GormRepository) CreateWebhookLog(log *domain.WebhookLog) error {
	if log.ID == "" {
		log.ID = uuid.New().String()
	}
	if log.CreatedAt.IsZero() {
		log.CreatedAt = time.Now()
	}
	return r.db.Create(log).Error
}

func (r *GormRepository) GetAddress(id string) (*domain.Address, error) {
	var addr domain.Address
	if err := r.db.First(&addr, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &addr, nil
}

func (r *GormRepository) GetAddressByEmail(email string) (*domain.Address, error) {
	var addr domain.Address
	if err := r.db.First(&addr, "email = ?", email).Error; err != nil {
		return nil, err
	}
	return &addr, nil
}

func (r *GormRepository) SaveEmail(email *domain.Email) error {
	if email.ID == "" {
		email.ID = uuid.New().String()
	}
	return r.db.Create(email).Error
}

func (r *GormRepository) GetEmails(addressID string) ([]domain.Email, error) {
	var emails []domain.Email
	// Preload attachments if needed, usually just getting list first
	if err := r.db.Where("address_id = ?", addressID).Order("received_at desc").Find(&emails).Error; err != nil {
		return nil, err
	}
	return emails, nil
}

func (r *GormRepository) GetEmail(id string) (*domain.Email, error) {
	var email domain.Email
	if err := r.db.Preload("Attachments").First(&email, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &email, nil
}
