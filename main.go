package main

import (
	"log"
	"os"

	"github.com/deidaraiorek/battleline/cmd/app"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	app := app.NewApp(":" + port)
	if err := app.Run(); err != nil {
		log.Fatalf("Application error: %v", err)
	}
	log.Println("Server gracefully stopped")
}
