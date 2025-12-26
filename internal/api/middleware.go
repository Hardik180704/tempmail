package api

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/Hardik180704/tempmail-pro.git/internal/config"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type Middleware struct {
	rdb *redis.Client
}

func NewMiddleware(cfg config.RedisConfig) *Middleware {
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.Addr,
		Password: cfg.Password,
		DB:       cfg.DB,
	})
	return &Middleware{rdb: rdb}
}

func (m *Middleware) RateLimit(limit int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		key := fmt.Sprintf("ratelimit:%s", ip)

		count, err := m.rdb.Incr(context.Background(), key).Result()
		if err != nil {
			// If redis fails, fail open or closed? Let's log and pass for now
			c.Next()
			return
		}

		if count == 1 {
			m.rdb.Expire(context.Background(), key, window)
		}

		if count > int64(limit) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded",
			})
			return
		}

		c.Next()
	}
}
