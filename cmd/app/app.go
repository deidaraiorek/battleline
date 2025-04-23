package app

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/cors"

	"github.com/deidaraiorek/battleline/internal/room"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
)

type App struct {
	addr   string
	server *http.Server
	router *chi.Mux
	rm     *room.RoomManager
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewApp(addr string) *App {
	app := &App{
		addr:   addr,
		router: chi.NewMux(),
		rm:     room.NewRoomManager(),
	}

	app.setupRoutes()

	app.server = &http.Server{
		Addr:    app.addr,
		Handler: app.router,
	}
	return app
}

func (a *App) setupRoutes() {
	a.router.Use(middleware.Logger)
	a.router.Use(middleware.StripSlashes)

	a.router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	a.router.Route("/", func(r chi.Router) {
		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("Hello World"))
		})
	})
	a.router.Route("/room", func(r chi.Router) {
		r.Post("/create", a.handleCreateRoom)
		r.Route("/{id}", func(r chi.Router) {
			r.Get("/", a.handleJoinRoom)
		})
	})

}

func (app *App) Run() error {
	go func() {
		ticker := time.NewTicker(1 * time.Hour)
		defer ticker.Stop()

		for range ticker.C {
			app.rm.CleanupInactiveRooms()
		}
	}()
	go func() {
		log.Printf("Server listening on %s", app.addr)
		if err := app.server.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	return app.waitForShutdown()
}

func (app *App) waitForShutdown() error {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	log.Println("Server shutting down...")
	return app.server.Shutdown(ctx)
}
