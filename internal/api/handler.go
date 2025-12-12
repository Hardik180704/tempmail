package api

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/Hardik180704/tempmail-pro.git/internal/store"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	repo store.Repository
}

func NewHandler(repo store.Repository) *Handler {
	return &Handler{repo: repo}
}

type CreateAddressRequest struct {
	Alias string `json:"alias"`
}

func (h *Handler) CreateAddress(c *gin.Context) {
	var req CreateAddressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		// If alias not provided, generate random
		req.Alias = generateRandomAlias(8)
	}
	if req.Alias == "" {
		req.Alias = generateRandomAlias(8)
	}

	addr, err := h.repo.CreateAddress(req.Alias)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, addr)
}

func (h *Handler) GetAddress(c *gin.Context) {
	id := c.Param("id")
	addr, err := h.repo.GetAddress(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}
	c.JSON(http.StatusOK, addr)
}

func (h *Handler) GetEmails(c *gin.Context) {
	addressID := c.Param("id")
	emails, err := h.repo.GetEmails(addressID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, emails)
}

func (h *Handler) GetEmail(c *gin.Context) {
	id := c.Param("id")
	email, err := h.repo.GetEmail(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Email not found"})
		return
	}
	c.JSON(http.StatusOK, email)
}

// Helpers
var letters = []rune("abcdefghijklmnopqrstuvwxyz0123456789")

func generateRandomAlias(n int) string {
	b := make([]rune, n)
	rand.Seed(time.Now().UnixNano())
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
