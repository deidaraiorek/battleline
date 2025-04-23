package room

import (
	"crypto/rand"
	"math/big"
	"sync"
	"time"

	"github.com/deidaraiorek/battleline/internal/game"
)

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

type RoomManager struct {
	Rooms map[string]*game.Game
	Lock  sync.Mutex
}

func NewRoomManager() *RoomManager {
	return &RoomManager{
		Rooms: make(map[string]*game.Game),
	}
}

func (rm *RoomManager) CreateNewRoom() (string, error) {
	rm.Lock.Lock()
	defer rm.Lock.Unlock()
	id, err := generateSecureID(6)
	if err != nil {
		return "", err
	}
	newGame := &game.Game{
		Id:          id,
		Players:     make(map[string]*game.Player),
		Deck:        game.GenerateDeck(),
		SpecialDeck: game.GenerateSpecialDeck(),
		Status:      game.Empty,
		Flags:       game.GenerateFlags(),
		IsDrawing:   false,
		Winby:       "",
	}
	rm.Rooms[id] = newGame
	return id, nil
}

func generateSecureID(length int) (string, error) {
	bytes := make([]byte, length)
	for i := range bytes {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		bytes[i] = charset[num.Int64()]
	}
	return string(bytes), nil
}

func (rm *RoomManager) CleanupInactiveRooms() {
	rm.Lock.Lock()
	defer rm.Lock.Unlock()
	for id, game := range rm.Rooms {
		if time.Since(game.LastActivity) > 2*time.Hour {
			delete(rm.Rooms, id)
		}
	}
}
