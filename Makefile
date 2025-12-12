.PHONY: up down build run test clean

up:
	docker-compose up -d

down:
	docker-compose down

build:
	go build -o bin/server cmd/server/main.go

run:
	go run cmd/server/main.go

test:
	go test ./...

clean:
	rm -rf bin/
