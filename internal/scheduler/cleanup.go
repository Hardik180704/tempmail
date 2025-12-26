package scheduler

import (
	"log"
	"time"

	"github.com/Hardik180704/tempmail-pro.git/internal/store"
)

func StartCleanupJob(repo store.Repository, interval time.Duration) {
	ticker := time.NewTicker(interval)
	
	go func() {
		for {
			select {
			case <-ticker.C:
				log.Println("Running cleanup job...")
				if err := repo.DeleteExpiredData(); err != nil {
					log.Printf("Cleanup job failed: %v", err)
				} else {
					log.Println("Cleanup job completed successfully.")
				}
			}
		}
	}()
}
