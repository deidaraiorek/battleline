package main

import (
	"log"

	"github.com/deidaraiorek/battleline/cmd/app"
)

func main() {
	app := app.NewApp("0.0.0.0:5000")

	if err := app.Run(); err != nil {
		log.Fatalf("Application error: %v", err)
	}
	log.Println("Server gracefully stopped")
}
