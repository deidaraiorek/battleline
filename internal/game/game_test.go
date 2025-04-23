package game

// import (
// 	"testing"

// 	"github.com/stretchr/testify/assert"
// )

// // Helper function to create cards with specified values and colors
// func createTestCards(values []int, colors []Color) []Card {
// 	cards := make([]Card, len(values))
// 	for i := range values {
// 		cards[i] = Card{
// 			Id:    string(rune(i + 65)), // A, B, C, etc.
// 			Value: values[i],
// 			Color: colors[i],
// 		}
// 	}
// 	return cards
// }

// func TestFormationIdentification(t *testing.T) {
// 	t.Run("Wedge Formation", func(t *testing.T) {
// 		// Valid wedge
// 		cards := createTestCards([]int{3, 4, 5}, []Color{RED, RED, RED})
// 		assert.True(t, IsWedge(cards), "Valid wedge formation should return true")

// 		// Invalid wedge (non-consecutive)
// 		cards = createTestCards([]int{3, 5, 6}, []Color{RED, RED, RED})
// 		assert.False(t, IsWedge(cards), "Non-consecutive cards should not be a wedge")

// 		// Invalid wedge (different colors)
// 		cards = createTestCards([]int{3, 4, 5}, []Color{RED, RED, BLUE})
// 		assert.False(t, IsWedge(cards), "Different colors should not be a wedge")

// 		// Too few cards
// 		cards = createTestCards([]int{3, 4}, []Color{RED, RED})
// 		assert.False(t, IsWedge(cards), "Too few cards should not be a wedge")

// 		// Empty hand
// 		cards = []Card{}
// 		assert.False(t, IsWedge(cards), "Empty hand should not be a wedge")
// 	})

// 	t.Run("Phalanx Formation", func(t *testing.T) {
// 		// Valid phalanx
// 		cards := createTestCards([]int{7, 7, 7}, []Color{RED, BLUE, GREEN})
// 		assert.True(t, IsPhalanx(cards), "Valid phalanx formation should return true")

// 		// Invalid phalanx
// 		cards = createTestCards([]int{7, 7, 8}, []Color{RED, BLUE, GREEN})
// 		assert.False(t, IsPhalanx(cards), "Different values should not be a phalanx")

// 		// Single card
// 		cards = createTestCards([]int{7}, []Color{RED})
// 		assert.True(t, IsPhalanx(cards), "Single card should be considered a phalanx")

// 		// Empty hand
// 		cards = []Card{}
// 		assert.False(t, IsPhalanx(cards), "Empty hand should not be a phalanx")
// 	})

// 	t.Run("Battalion Formation", func(t *testing.T) {
// 		// Valid battalion
// 		cards := createTestCards([]int{2, 5, 8}, []Color{RED, RED, RED})
// 		assert.True(t, IsBattalion(cards), "Valid battalion formation should return true")

// 		// Invalid battalion
// 		cards = createTestCards([]int{2, 5, 8}, []Color{RED, RED, BLUE})
// 		assert.False(t, IsBattalion(cards), "Different colors should not be a battalion")

// 		// Single card
// 		cards = createTestCards([]int{7}, []Color{RED})
// 		assert.True(t, IsBattalion(cards), "Single card should be considered a battalion")

// 		// Empty hand
// 		cards = []Card{}
// 		assert.False(t, IsBattalion(cards), "Empty hand should not be a battalion")
// 	})

// 	t.Run("Skirmish Formation", func(t *testing.T) {
// 		// Valid skirmish
// 		cards := createTestCards([]int{3, 4, 5}, []Color{RED, BLUE, GREEN})
// 		assert.True(t, IsSkirmish(cards), "Valid skirmish formation should return true")

// 		// Invalid skirmish
// 		cards = createTestCards([]int{3, 5, 6}, []Color{RED, BLUE, GREEN})
// 		assert.False(t, IsSkirmish(cards), "Non-consecutive values should not be a skirmish")

// 		// Too few cards
// 		cards = createTestCards([]int{3, 4}, []Color{RED, BLUE})
// 		assert.False(t, IsSkirmish(cards), "Too few cards should not be a skirmish")

// 		// Empty hand
// 		cards = []Card{}
// 		assert.False(t, IsSkirmish(cards), "Empty hand should not be a skirmish")
// 	})
// }

// func TestGetFormationType(t *testing.T) {
// 	t.Run("Formation Type Detection", func(t *testing.T) {
// 		// Wedge formation
// 		cards := createTestCards([]int{3, 4, 5}, []Color{RED, RED, RED})
// 		formationType, total := GetFormationType(cards)
// 		assert.Equal(t, WEDGE, formationType, "Should detect wedge formation")
// 		assert.Equal(t, 12, total, "Total should be 12")

// 		// Phalanx formation
// 		cards = createTestCards([]int{7, 7, 7}, []Color{RED, BLUE, GREEN})
// 		formationType, total = GetFormationType(cards)
// 		assert.Equal(t, PHALANX, formationType, "Should detect phalanx formation")
// 		assert.Equal(t, 21, total, "Total should be 21")

// 		// Battalion formation
// 		cards = createTestCards([]int{2, 5, 8}, []Color{RED, RED, RED})
// 		formationType, total = GetFormationType(cards)
// 		assert.Equal(t, BATTALION, formationType, "Should detect battalion formation")
// 		assert.Equal(t, 15, total, "Total should be 15")

// 		// Skirmish formation
// 		cards = createTestCards([]int{3, 4, 5}, []Color{RED, BLUE, GREEN})
// 		formationType, total = GetFormationType(cards)
// 		assert.Equal(t, SKIRMISH, formationType, "Should detect skirmish formation")
// 		assert.Equal(t, 12, total, "Total should be 12")

// 		// Host formation
// 		cards = createTestCards([]int{2, 5, 9}, []Color{RED, BLUE, GREEN})
// 		formationType, total = GetFormationType(cards)
// 		assert.Equal(t, HOST, formationType, "Should detect host formation")
// 		assert.Equal(t, 16, total, "Total should be 16")

// 		// Empty hand
// 		cards = []Card{}
// 		formationType, total = GetFormationType(cards)
// 		assert.Equal(t, HOST, formationType, "Empty hand should be host formation")
// 		assert.Equal(t, 0, total, "Total should be 0")
// 	})
// }

// func TestIsFormationBetter(t *testing.T) {
// 	t.Run("Formation Comparison", func(t *testing.T) {
// 		// Better formation type
// 		assert.Equal(t, 1, isFormationBetter(WEDGE, 12, PHALANX, 21),
// 			"Wedge should be better than Phalanx regardless of total")

// 		// Worse formation type
// 		assert.Equal(t, 2, isFormationBetter(BATTALION, 20, WEDGE, 15),
// 			"Battalion should not be better than Wedge regardless of total")

// 		// Same type, higher total
// 		assert.Equal(t, 1, isFormationBetter(BATTALION, 20, BATTALION, 15),
// 			"Same formation with higher total should be better")

// 		// Same type, lower total
// 		assert.Equal(t, 2, isFormationBetter(SKIRMISH, 12, SKIRMISH, 15),
// 			"Same formation with lower total should not be better")

// 		// Same type, same total
// 		assert.Equal(t, 0, isFormationBetter(HOST, 15, HOST, 15),
// 			"Same formation with equal total should not be better")
// 	})
// }

// func TestCanBeatWithDeckCards(t *testing.T) {
// 	t.Run("One Card Needed", func(t *testing.T) {
// 		// Can beat with one card
// 		deck := createTestCards([]int{5}, []Color{RED})
// 		opponentCards := createTestCards([]int{3, 4}, []Color{RED, RED})
// 		assert.True(t, canBeatWithDeckCards(deck, opponentCards, 1, HOST, 15),
// 			"Should be able to beat with one card to form a wedge")

// 		// Cannot beat with one card
// 		deck = createTestCards([]int{5}, []Color{RED})
// 		opponentCards = createTestCards([]int{4, 5, 6}, []Color{RED, RED})
// 		assert.True(t, canBeatWithDeckCards(deck, opponentCards, 1, WEDGE, 12),
// 			"Should not be able to beat a wedge with these cards")
// 	})

// 	t.Run("Two Cards Needed", func(t *testing.T) {
// 		// Can beat with two cards
// 		deck := createTestCards([]int{8, 8}, []Color{BLUE, GREEN})
// 		opponentCards := createTestCards([]int{8}, []Color{RED})
// 		assert.True(t, canBeatWithDeckCards(deck, opponentCards, 2, BATTALION, 20),
// 			"Should be able to beat with two cards to form a phalanx")

// 		// Cannot beat with two cards
// 		deck = createTestCards([]int{1, 2}, []Color{BLUE, GREEN})
// 		opponentCards = createTestCards([]int{8}, []Color{RED})
// 		assert.False(t, canBeatWithDeckCards(deck, opponentCards, 2, PHALANX, 24),
// 			"Should not be able to beat a phalanx with these cards")
// 	})

// 	t.Run("Three Cards Needed", func(t *testing.T) {
// 		// Can beat with three cards
// 		deck := createTestCards([]int{9, 9, 9}, []Color{RED, BLUE, GREEN})
// 		opponentCards := []Card{}
// 		assert.True(t, canBeatWithDeckCards(deck, opponentCards, 3, BATTALION, 20),
// 			"Should be able to beat with three cards to form a phalanx")

// 		// Cannot beat with three cards
// 		deck = createTestCards([]int{1, 2, 3}, []Color{BLUE, GREEN, YELLOW})
// 		opponentCards = []Card{}
// 		assert.False(t, canBeatWithDeckCards(deck, opponentCards, 3, WEDGE, 12),
// 			"Should not be able to beat a wedge with these cards")
// 	})

// 	t.Run("Four Cards Needed (Mud Effect)", func(t *testing.T) {
// 		// Can beat with four cards
// 		deck := createTestCards([]int{7, 8, 9, 10}, []Color{RED, RED, RED, RED})
// 		opponentCards := []Card{}
// 		assert.True(t, canBeatWithDeckCards(deck, opponentCards, 4, BATTALION, 20),
// 			"Should be able to beat with four cards to form a wedge")

// 		// Cannot beat with four cards
// 		deck = createTestCards([]int{1, 2, 3, 4}, []Color{BLUE, GREEN, YELLOW, PURPLE})
// 		opponentCards = []Card{}
// 		assert.False(t, canBeatWithDeckCards(deck, opponentCards, 4, WEDGE, 30),
// 			"Should not be able to beat a high-value wedge with these cards")
// 	})
// }

// func TestCheckClaimFlag(t *testing.T) {
// 	t.Run("Complete vs Empty Formation", func(t *testing.T) {
// 		game := setupTestGame()
// 		flag := &Flag{
// 			FormationMap: map[string]*Formation{
// 				"player1": {
// 					Cards: createTestCards([]int{3, 4, 5}, []Color{RED, RED, RED}),
// 				},
// 				"player2": {
// 					Cards: []Card{},
// 				},
// 			},
// 			Limit: 3,
// 		}
// 		game.Flags[0] = flag

// 		// Can only claim if opponent can't possibly beat it
// 		game.Deck = createTestCards([]int{1, 2, 3}, []Color{BLUE, GREEN, YELLOW})

// 		game.checkClaimFlag(flag, "player1")
// 		assert.Equal(t, "player1", flag.Claimed, "Player1 should claim flag with wedge vs empty opponent")
// 	})

// 	t.Run("Better Formation Wins", func(t *testing.T) {
// 		game := setupTestGame()
// 		flag := &Flag{
// 			FormationMap: map[string]*Formation{
// 				"player1": {
// 					Cards: createTestCards([]int{3, 4, 5}, []Color{RED, BLUE, GREEN}), // Skirmish
// 				},
// 				"player2": {
// 					Cards: createTestCards([]int{6, 6, 6}, []Color{RED, BLUE, GREEN}), // Phalanx
// 				},
// 			},
// 			Limit: 3,
// 		}
// 		game.Flags[0] = flag

// 		game.checkClaimFlag(flag, "player1")
// 		assert.Equal(t, "player2", flag.Claimed, "Better formation (phalanx) should win over skirmish")
// 	})

// 	t.Run("Cannot Claim If Opponent Can Beat", func(t *testing.T) {
// 		game := setupTestGame()
// 		game.Deck = createTestCards([]int{8, 8, 8}, []Color{RED, BLUE, GREEN}) // Can form a Phalanx

// 		flag := &Flag{
// 			FormationMap: map[string]*Formation{
// 				"player1": {
// 					Cards: createTestCards([]int{2, 3, 4}, []Color{RED, RED, RED}), // Battalion
// 				},
// 				"player2": {
// 					Cards: []Card{}, // Empty, but could potentially draw winning cards
// 				},
// 			},
// 			Limit: 3,
// 		}
// 		game.Flags[0] = flag

// 		game.checkClaimFlag(flag, "player1")
// 		assert.Equal(t, "", flag.Claimed, "Should not claim flag when opponent can potentially win")
// 	})

// 	t.Run("Can Claim If Opponent Cannot Beat", func(t *testing.T) {
// 		game := setupTestGame()
// 		game.Deck = createTestCards([]int{1, 2, 1}, []Color{BLUE, GREEN, YELLOW}) // Weak cards

// 		flag := &Flag{
// 			FormationMap: map[string]*Formation{
// 				"player1": {
// 					Cards: createTestCards([]int{8, 9, 10}, []Color{RED, RED, RED}), // Wedge with high values
// 				},
// 				"player2": {
// 					Cards: []Card{}, // Empty
// 				},
// 			},
// 			Limit: 3,
// 		}
// 		game.Flags[0] = flag

// 		game.checkClaimFlag(flag, "player1")
// 		assert.Equal(t, "player1", flag.Claimed,
// 			"Should claim flag when opponent cannot possibly beat formation")
// 	})

// 	t.Run("Partial Formations Competing", func(t *testing.T) {
// 		game := setupTestGame()
// 		game.Deck = createTestCards([]int{1, 2}, []Color{YELLOW, ORANGE}) // Not enough cards to win

// 		flag := &Flag{
// 			FormationMap: map[string]*Formation{
// 				"player1": {
// 					Cards: createTestCards([]int{9, 10}, []Color{RED, RED}), // Incomplete formation
// 				},
// 				"player2": {
// 					Cards: createTestCards([]int{5}, []Color{BLUE}), // Incomplete formation
// 				},
// 			},
// 			Limit: 3,
// 		}
// 		game.Flags[0] = flag

// 		// Add third card to player1's formation
// 		flag.FormationMap["player1"].Cards = append(
// 			flag.FormationMap["player1"].Cards,
// 			Card{Value: 8, Color: RED}, // Complete wedge (8-9-10)
// 		)

// 		game.checkClaimFlag(flag, "player1")
// 		assert.Equal(t, "player1", flag.Claimed,
// 			"Should claim flag when opponent has partial formation that can't win")
// 	})

// 	t.Run("Mud Effect (4 Cards Required)", func(t *testing.T) {
// 		game := setupTestGame()
// 		flag := &Flag{
// 			FormationMap: map[string]*Formation{
// 				"player1": {
// 					Cards: createTestCards([]int{7, 8, 9, 10}, []Color{RED, RED, RED, RED}), // 4-card wedge
// 				},
// 				"player2": {
// 					Cards: createTestCards([]int{7, 8, 9}, []Color{BLUE, BLUE, BLUE}), // 3-card battalion
// 				},
// 			},
// 			Limit: 4, // Mud effect
// 		}
// 		game.Flags[0] = flag

// 		game.checkClaimFlag(flag, "player1")
// 		assert.Equal(t, "player1", flag.Claimed,
// 			"Player with complete 4-card formation should win when Mud effect is active")
// 	})

// 	t.Run("Tie Resolution", func(t *testing.T) {
// 		game := setupTestGame()
// 		flag := &Flag{
// 			FormationMap: map[string]*Formation{
// 				"player1": {
// 					Cards: createTestCards([]int{5, 6, 7}, []Color{RED, BLUE, GREEN}), // Host, total 18
// 				},
// 				"player2": {
// 					Cards: createTestCards([]int{4, 7, 7}, []Color{RED, BLUE, GREEN}), // Host, total 18
// 				},
// 			},
// 			Limit: 3,
// 		}
// 		game.Flags[0] = flag

// 		game.checkClaimFlag(flag, "player1")
// 		assert.Equal(t, "", flag.Claimed,
// 			"Flag should remain unclaimed in case of a tie")
// 	})
// }

// // Helper function to set up a test game
// func setupTestGame() *Game {
// 	return &Game{
// 		Players: map[string]*Player{
// 			"player1": {Id: "player1"},
// 			"player2": {Id: "player2"},
// 		},
// 		Flags: map[int]*Flag{},
// 		Deck:  []Card{},
// 	}
// }
