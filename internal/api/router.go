package api

import (
	"time"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/gin-gonic/gin"
)

func NewRouter(h *Handler, cfg config.RedisConfig) *gin.Engine {
	r := gin.Default()
	
	// Middleware
	mw := NewMiddleware(cfg)

	v1 := r.Group("/api/v1")
	{
		// Apply stricter limit to creation: 5 requests per minute
		v1.POST("/addresses", mw.RateLimit(5, time.Minute), h.CreateAddress)
		
		v1.GET("/addresses/:id", h.GetAddress)
		v1.GET("/addresses/:id/emails", h.GetEmails)
		v1.GET("/emails/:id", h.GetEmail)
	}

	return r
}
