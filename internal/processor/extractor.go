package processor

import (
	"regexp"

	"github.com/microcosm-cc/bluemonday"
)

var (
	// Simple regex for 4-8 digit codes, can be refined
	otpRegex = regexp.MustCompile(`\b\d{4,8}\b`)
	// Basic link extraction
	linkRegex = regexp.MustCompile(`https?://[^\s<>"']+`)
)

func ExtractOTP(body string) string {
	// naive implementation: first sequence of 4-8 digits
	// In production, we'd use more context-aware logic or ML
	return otpRegex.FindString(body)
}

func ExtractLinks(body string) []string {
	return linkRegex.FindAllString(body, -1)
}

func SanitizeHTML(html string) string {
	p := bluemonday.UGCPolicy()
	return p.Sanitize(html)
}
