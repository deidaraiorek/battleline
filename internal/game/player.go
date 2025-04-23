package game

import "github.com/gorilla/websocket"

type Player struct {
	Id       string
	Conn     *websocket.Conn
	Hand     []Card
	FlagsGot int
}

func (g *Game) RemoveSpecialCardFromHand(cardName string, playerId string) {
	player := g.Players[playerId]
	newHand := make([]Card, 0, len(player.Hand))
	for _, c := range player.Hand {
		if c.Name == "" || c.Name != cardName {
			newHand = append(newHand, c)
		}
	}
	player.Hand = newHand
}
