package api

import (
	"github.com/gin-gonic/gin"
)

func NewRouter(h *Handler) *gin.Engine {
	r := gin.Default()

	v1 := r.Group("/api/v1")
	{
		v1.POST("/addresses", h.CreateAddress)
		v1.GET("/addresses/:id", h.GetAddress)
		v1.GET("/addresses/:id/emails", h.GetEmails)
		v1.GET("/emails/:id", h.GetEmail)
	}

	return r
}
