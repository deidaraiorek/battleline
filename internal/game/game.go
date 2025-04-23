package game

import (
	"log"
	"math/rand"
	"sort"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Status int

const (
	Empty Status = iota
	Waiting
	Full
)
const INTIALCARDS = 7

type Game struct {
	Id           string
	Players      map[string]*Player
	Deck         []Card
	SpecialDeck  []Card
	Winby        string
	Lock         sync.Mutex
	CurrentTurn  string
	Status       Status
	LastActivity time.Time
	Flags        map[int]*Flag
	IsDrawing    bool
	Table        []Card
}

type PlaySpecialPayload struct {
	Card   Card   `json:"card"`
	Action string `json:"action"`

	ReturnCards []Card `json:"returnCards,omitempty"`

	// Flag-related fields
	SourceFlag int `json:"sourceFlag,omitempty"`
	TargetFlag int `json:"targetFlag,omitempty"`
	Flag       int `json:"flag,omitempty"`

	SelectedCard Card `json:"selectedCard,omitempty"`
}

func GenerateDeck() []Card {
	var deck []Card
	colors := []Color{RED, BLUE, GREEN, YELLOW, ORANGE, PURPLE}
	for _, color := range colors {
		for value := 1; value <= 10; value++ {
			card := Card{
				Id:        uuid.NewString(),
				Value:     value,
				Color:     color,
				IsSpecial: false,
			}
			deck = append(deck, card)
		}
	}
	rand.New(rand.NewSource(time.Now().UnixNano()))
	rand.Shuffle(len(deck), func(i, j int) {
		deck[i], deck[j] = deck[j], deck[i]
	})

	return deck
}

func GenerateSpecialDeck() []Card {
	deck := []Card{
		{
			Name:        SCOUT,
			Description: "Draw three cards from either or both decks. Choose two cards from your hand and place them face down on top of the respective decks.",
			CardEffect:  SCOUT_EFFECT,
			IsSpecial:   true,
		},
		{
			Name:        FOG,
			Description: "Disable formations at this flag. The total value of the cards on each side determines the winner.",
			CardEffect:  FOG_EFFECT,
			IsSpecial:   true,
		},
		{
			Name:        MUD,
			Description: "Formations at this flag must consist of four cards instead of three.",
			CardEffect:  MUD_EFFECT,
			IsSpecial:   true,
		},
		{
			Name:        DESERTER,
			Description: "Choose an opponent's card at an unclaimed flag and discard it face up.",
			CardEffect:  DESERTER_EFFECT,
			IsSpecial:   true,
		},
		{
			Name:        TRAITOR,
			Description: "Take one troop card from the opponent's side of an unclaimed flag and play it into an empty slot on your side.",
			CardEffect:  TRAITOR_EFFECT,
			IsSpecial:   true,
		},
		{
			Name:        REDEPLOY,
			Description: "Move one of your own cards at an unclaimed flag to another unclaimed flag, or discard it.",
			CardEffect:  REDEPLOY_EFFECT,
			IsSpecial:   true,
		},
		{
			Name:        ALEXANDER,
			Description: "Wild card. Define color and value when resolving the flag. Only one leader allowed per side.",
			CardEffect:  ALEXANDER_EFFECT,
			IsSpecial:   true,
		},
		{
			Name:        DARIUS,
			Description: "Wild card. Define color and value when resolving the flag. Only one leader allowed per side.",
			CardEffect:  DARIUS_EFFECT,
			IsSpecial:   true,
		},
		{
			Name:        BEARER,
			Description: "Shield Bearers: Wild card. Define color and value (not greater than 3) when resolving the flag.",
			CardEffect:  BEARER_EFFECT,
			IsSpecial:   true,
		},
		{
			Name:        CAVALRY,
			Description: "Play this card like any Troop card of value 8, but define its color when the Flag is resolved. ",
			CardEffect:  CALVALRY_EFFECT,
			IsSpecial:   true,
		},
	}

	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	r.Shuffle(len(deck), func(i, j int) {
		deck[i], deck[j] = deck[j], deck[i]
	})

	return deck
}

func GenerateFlags() map[int]*Flag {
	flags := make(map[int]*Flag)
	for i := range 9 {
		flag := &Flag{
			Claimed:      "",
			FormationMap: make(map[string]*Formation),
			Limit:        3,
			Fogged:       false,
		}
		flags[i] = flag
	}
	return flags
}

func (g *Game) Start() {
	for _, player := range g.Players {
		g.dealCards(player)
	}
	playerIDs := make([]string, 0, len(g.Players))
	for id := range g.Players {
		playerIDs = append(playerIDs, id)
	}
	g.CurrentTurn = playerIDs[rand.Intn(len(playerIDs))]

}

func (g *Game) dealCards(p *Player) {
	p.Hand = append(p.Hand, g.Deck[len(g.Deck)-INTIALCARDS:]...)
	g.Deck = g.Deck[:len(g.Deck)-INTIALCARDS]
}

func (g *Game) PlayCard(playerId string, card Card, flagId int) {
	flag := g.Flags[flagId]

	formation, ok := flag.FormationMap[playerId]
	if !ok {
		formation = &Formation{Cards: []Card{}}
		flag.FormationMap[playerId] = formation
	}
	formation.Cards = append(formation.Cards, card)
	g.Table = append(g.Table, card)
	hand := g.Players[playerId].Hand
	newHand := make([]Card, 0, len(hand))
	for _, c := range hand {
		if c.IsSpecial {
			if c.Name != card.Name {
				newHand = append(newHand, c)
			}
		} else {
			if c.Id != card.Id {
				newHand = append(newHand, c)
			}
		}
	}
	g.Players[playerId].Hand = newHand
	if len(formation.Cards) == flag.Limit {
		g.CheckClaimFlag(flag, playerId)
	}
	log.Println("User id: ", playerId, "played card: ", card, "at flag: ", flagId)
	g.IsDrawing = true

}

func (g *Game) HandleDraw(playerId string, cate string) {
	switch cate {
	case "normal":
		g.handlenormalDraw(playerId)
	case "special":
		g.handleSpecialDraw(playerId)
	}

	g.CurrentTurn = g.GetOpponentId(playerId)

	g.IsDrawing = false
}

func (g *Game) handlenormalDraw(playerId string) {
	card := g.Deck[len(g.Deck)-1]
	g.Deck = g.Deck[:len(g.Deck)-1]
	g.Players[playerId].Hand = append(g.Players[playerId].Hand, card)
}

func (g *Game) handleSpecialDraw(playerId string) {
	card := g.SpecialDeck[len(g.SpecialDeck)-1]
	g.SpecialDeck = g.SpecialDeck[:len(g.SpecialDeck)-1]
	g.Players[playerId].Hand = append(g.Players[playerId].Hand, card)
}

func (g *Game) CheckClaimFlag(flag *Flag, playerId string) {
	if flag.Claimed != "" {
		return
	}
	opponentId := g.GetOpponentId(playerId)

	playerFormation := flag.FormationMap[playerId]
	playerType, playerTotal := flag.GetFormationType(playerFormation.Cards)

	playerFormation.Type = playerType
	playerFormation.Total = playerTotal

	opponentFormation, exists := flag.FormationMap[opponentId]
	if !exists || opponentFormation == nil {
		opponentFormation = &Formation{Cards: []Card{}}
		flag.FormationMap[opponentId] = opponentFormation
	}

	cardsNeeded := flag.Limit - len(opponentFormation.Cards)

	if cardsNeeded <= 0 {
		opponentType, opponentTotal := flag.GetFormationType(opponentFormation.Cards)
		opponentFormation.Type = opponentType
		opponentFormation.Total = opponentTotal

		opponentBetter := isFormationBetter(opponentType, opponentTotal, playerType, playerTotal)
		if opponentBetter == 1 || opponentBetter == 0 {
			flag.Claimed = opponentId
			g.Players[opponentId].FlagsGot += 1
		} else {
			flag.Claimed = playerId
			g.Players[playerId].FlagsGot += 1

		}
		return
	}

	canOpponentWin := g.canBeatWithDeckCards(opponentId, opponentFormation.Cards, cardsNeeded, playerType, playerTotal, playerId, flag)

	if !canOpponentWin {
		flag.Claimed = playerId
		g.Players[playerId].FlagsGot += 1
	}
}

func (g *Game) GetOpponentId(playerId string) string {
	for id := range g.Players {
		if id != playerId {
			return id
		}
	}
	return ""
}

func (g *Game) CheckWinState() {
	for playerId := range g.Players {
		flagCount := 0
		claimedFlags := []int{}

		for flagId, flag := range g.Flags {
			if flag.Claimed == playerId {
				flagCount++
				claimedFlags = append(claimedFlags, flagId)
			}
		}
		if flagCount >= 5 {
			g.Winby = playerId
			return
		}
		if len(claimedFlags) >= 3 {
			sort.Ints(claimedFlags)

			consecutive := 1
			maxConsecutive := 1
			for i := 1; i < len(claimedFlags); i++ {
				if claimedFlags[i] == claimedFlags[i-1]+1 {
					consecutive++
					if consecutive > maxConsecutive {
						maxConsecutive = consecutive
					}
				} else {
					consecutive = 1
				}
			}

			if maxConsecutive >= 3 {
				g.Winby = playerId
				return
			}
		}
	}
}

func (g *Game) HandleSpecialActions(payload PlaySpecialPayload, playerId string) {
	card := payload.Card
	switch card.Name {
	case "Scout":
		switch payload.Action {
		case "scout_draw":
			for _ = range 3 {
				g.handlenormalDraw(playerId)
			}
			log.Print("Player Id: ", playerId, "drawed 3 cards from deck")
			g.NoticeToOpponent(playerId, payload)
			g.RemoveSpecialCardFromHand(SCOUT, playerId)
		case "scout_return":
			for _, card := range payload.ReturnCards {
				if card.IsSpecial {
					g.SpecialDeck = append(g.SpecialDeck, card)
				} else {
					g.Deck = append(g.Deck, card)
				}
				g.RemoveCardFromHand(card, playerId)
			}
			log.Print("Player Id: ", playerId, "return ", len(payload.ReturnCards), "to deck")
			g.CurrentTurn = g.GetOpponentId(playerId)
		}
	case "Redeploy":
		switch payload.Action {
		case "redeploy_discard":
			g.RemoveCardFromFlag(payload.SourceFlag, payload.SelectedCard.Id, playerId)

		case "redeploy_to_flag":
			sourceFlag := payload.SourceFlag
			g.RemoveCardFromFlag(sourceFlag, payload.SelectedCard.Id, playerId)
			g.PlayCard(playerId, payload.SelectedCard, payload.TargetFlag)
		}
		g.NoticeToOpponent(playerId, payload)
		g.IsDrawing = true
		g.RemoveSpecialCardFromHand(REDEPLOY, playerId)
	case "Deserter":
		opponentId := g.GetOpponentId(playerId)
		g.RemoveCardFromFlag(payload.Flag, payload.SelectedCard.Id, opponentId)
		g.NoticeToOpponent(playerId, payload)
		g.IsDrawing = true
		g.RemoveSpecialCardFromHand(DESERTER, playerId)
	case "Traitor":
		opponentId := g.GetOpponentId(playerId)
		g.RemoveCardFromFlag(payload.SourceFlag, payload.SelectedCard.Id, opponentId)
		g.PlayCard(playerId, payload.SelectedCard, payload.TargetFlag)
		g.NoticeToOpponent(playerId, payload)
		g.IsDrawing = true
		g.RemoveSpecialCardFromHand(TRAITOR, playerId)
	case "Mud":
		g.Flags[payload.Flag].Limit = 4
		g.NoticeToOpponent(playerId, payload)
		g.IsDrawing = true
		g.RemoveSpecialCardFromHand(MUD, playerId)
	case "Fog":
		g.Flags[payload.Flag].Fogged = true
		g.NoticeToOpponent(playerId, payload)
		g.IsDrawing = true
		g.RemoveSpecialCardFromHand(FOG, playerId)
	}
}

func (g *Game) RemoveCardFromHand(card Card, playerId string) {
	player := g.Players[playerId]
	newHand := make([]Card, 0, len(player.Hand))
	for _, c := range player.Hand {
		if c.Id != card.Id {
			newHand = append(newHand, c)
		}
	}
	player.Hand = newHand
}

func (g *Game) RemoveCardFromFlag(flagId int, cardId string, playerId string) {
	flag := g.Flags[flagId]
	formation, ok := flag.FormationMap[playerId]
	if !ok {
		log.Println("Formation not found for player", playerId, "at flag", flagId)
		return
	}
	newCards := []Card{}
	for _, card := range formation.Cards {
		if card.Id != cardId {
			newCards = append(newCards, card)
		}
	}
	formation.Cards = newCards
	flag.FormationMap[playerId] = formation
	log.Printf("Player %s removed card %s from their formation at flag %d", playerId, cardId, flagId)
}

func (g *Game) NoticeToOpponent(playerId string, payload PlaySpecialPayload) {
	opponentId := g.GetOpponentId(playerId)
	conn := g.Players[opponentId].Conn
	if conn != nil {
		conn.WriteJSON(struct {
			Type    string            `json:"type"`
			Payload map[string]string `json:"payload"`
		}{
			Type: "notice",
			Payload: map[string]string{
				"cardName":        payload.Card.Name,
				"cardDescription": payload.Card.Description,
			},
		})
	}

}
