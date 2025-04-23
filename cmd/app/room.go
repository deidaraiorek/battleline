package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/deidaraiorek/battleline/internal/game"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type PlayCardPayload struct {
	Card   game.Card `json:"card"`
	FlagId int       `json:"flagId"`
}

type DrawCardPayload struct {
	DeckType string `json:"deckType"`
}

func (a *App) handleCreateRoom(w http.ResponseWriter, r *http.Request) {
	id, err := a.rm.CreateNewRoom()
	if err != nil {
		http.Error(w, "failed to create room", http.StatusInternalServerError)
		return
	}
	resp := map[string]string{"id": id}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
	}
}

func (a *App) handleJoinRoom(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	room, existed := a.rm.Rooms[id]
	if !existed {
		http.Error(w, "Room not found", http.StatusNotFound)
		return
	}
	room.Lock.Lock()
	defer room.Lock.Unlock()
	if room.Status == game.Full {
		http.Error(w, "Room is full", http.StatusForbidden)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Can not establish connection", http.StatusInternalServerError)
		return
	}

	playerID := uuid.NewString()
	player := &game.Player{
		Id:       playerID,
		Conn:     conn,
		Hand:     []game.Card{},
		FlagsGot: 0,
	}

	room.Players[playerID] = player

	room.LastActivity = time.Now()

	if room.Status == game.Empty {
		room.Status = game.Waiting
	} else {
		room.Status = game.Full
		room.Start()
		BroadcastGameState(room)

	}
	log.Print("User id: ", playerID, "joined room: ", id, "current status: ", room.Status)
	conn.WriteJSON(Message{
		Type: "connected",
		Payload: map[string]string{
			"playerId": playerID,
			"roomId":   id,
		},
	})
	go handlePlayerMessages(conn, room, playerID)

}

func handlePlayerMessages(conn *websocket.Conn, room *game.Game, playerId string) {
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Read error:", err)
			break
		}
		var msg Message
		err = json.Unmarshal(message, &msg)
		if err != nil {
			log.Println("JSON unmarshal error:", err)
			continue
		}
		handleMessage(msg, room, playerId)
		room.CheckWinState()
		BroadcastGameState(room)
	}
}

func handleMessage(msg Message, room *game.Game, playerId string) {
	switch msg.Type {
	case "playCard":
		var payload PlayCardPayload
		if parsePayload(msg.Payload, &payload) {
			room.PlayCard(playerId, payload.Card, payload.FlagId)
			// handlePlayCard(payload, room, playerId)
		}
	case "drawCard":
		var payload DrawCardPayload
		if parsePayload(msg.Payload, &payload) {
			room.HandleDraw(playerId, payload.DeckType)
		}
	case "claimFlag":
		var payload PlayCardPayload
		if parsePayload(msg.Payload, &payload) {
			flag := room.Flags[payload.FlagId]
			room.CheckClaimFlag(flag, playerId)
		}
	case "playSpecial":
		var payload game.PlaySpecialPayload
		if parsePayload(msg.Payload, &payload) {
			room.HandleSpecialActions(payload, playerId)
		}

	// case "chatMessage":
	// 	var payload ChatMessagePayload
	// 	if parsePayload(msg.Payload, &payload) {
	// 		handleChatMessage(payload, room, playerId)
	// 	}
	default:
		fmt.Println("Unknown message type:", msg.Type)
	}
}

func parsePayload(raw interface{}, out interface{}) bool {
	bytes, err := json.Marshal(raw)
	if err != nil {
		log.Println("Error marshalling payload:", err)
		return false
	}
	err = json.Unmarshal(bytes, out)
	if err != nil {
		log.Println("Error unmarshalling payload:", err)
		return false
	}
	return true
}

func BroadcastGameState(room *game.Game) {
	for _, player := range room.Players {
		msg := preparePlayerView(player, room)
		if player.Conn != nil {
			player.Conn.WriteJSON(msg)
		}
	}
}

func preparePlayerView(player *game.Player, room *game.Game) Message {
	flagsData := make([]map[int]interface{}, 0, len(room.Flags))
	for id, flag := range room.Flags {
		flagObj := make(map[int]interface{})
		formationMap := make(map[string]interface{})
		for uId, formation := range flag.FormationMap {
			formationMap[uId] = map[string]interface{}{
				"hand":   formation.Cards,
				"userId": uId,
			}

		}
		flagData := map[string]interface{}{
			"formationMap": formationMap,
			"claimed":      flag.Claimed,
			"limit":        flag.Limit,
			"fogged":       flag.Fogged,
		}
		flagObj[id] = flagData

		flagsData = append(flagsData, flagObj)
	}
	payload := map[string]interface{}{
		"hand":             player.Hand,
		"flags":            flagsData,
		"deckCount":        len(room.Deck),
		"specialDeckCount": len(room.SpecialDeck),
		"currentTurn":      room.CurrentTurn,
		"isDrawing":        room.IsDrawing,
		"winby":            room.Winby,
	}
	return Message{
		Type:    "gamestate",
		Payload: payload,
	}
}
