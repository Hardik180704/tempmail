package main

import (
	"io"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/webhook", func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		log.Printf("Received Webhook: %s", string(body))
		
		sig := r.Header.Get("X-Webhook-Signature")
		log.Printf("Signature: %s", sig)

		w.WriteHeader(http.StatusOK)
	})

	log.Println("Listening for webhooks on :9090")
	log.Fatal(http.ListenAndServe(":9090", nil))
}
