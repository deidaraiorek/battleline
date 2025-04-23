package game

type ScoutEffect struct{}

func (e ScoutEffect) Apply(g *Game, playerID string, targetFormation int) error {
	// Your effect logic here
	return nil
}

func (e ScoutEffect) GetDescription() string {
	return "Draw three cards from either or both decks. Choose two cards from your hand and place them face down on top of the respective decks."
}

type FogEffect struct{}

func (e FogEffect) Apply(g *Game, playerID string, targetFormation int) error {
	// Effect logic
	return nil
}

func (e FogEffect) GetDescription() string {
	return "Disable formations at this flag. The total value of the cards on each side determines the winner."
}

// Repeat similarly for others:
type MudEffect struct{}

func (e MudEffect) Apply(g *Game, playerID string, targetFormation int) error { return nil }
func (e MudEffect) GetDescription() string {
	return "Formations at this flag must consist of four cards instead of three."
}

type DeserterEffect struct{}

func (e DeserterEffect) Apply(g *Game, playerID string, targetFormation int) error { return nil }
func (e DeserterEffect) GetDescription() string {
	return "Choose an opponent's card at an unclaimed flag and discard it face up."
}

type TraitorEffect struct{}

func (e TraitorEffect) Apply(g *Game, playerID string, targetFormation int) error { return nil }
func (e TraitorEffect) GetDescription() string {
	return "Take one troop card from the opponent's side of an unclaimed flag and play it into an empty slot on your side."
}

type RedeployEffect struct{}

func (e RedeployEffect) Apply(g *Game, playerID string, targetFormation int) error { return nil }
func (e RedeployEffect) GetDescription() string {
	return "Move one of your own cards at an unclaimed flag to another unclaimed flag, or discard it."
}

type LeaderEffect struct {
	Name string
}

func (e LeaderEffect) Apply(g *Game, playerID string, targetFormation int) error { return nil }
func (e LeaderEffect) GetDescription() string {
	return "Wild card. Define color and value when resolving the flag. Only one leader allowed per side."
}

type BearerEffect struct{}

func (e BearerEffect) Apply(g *Game, playerID string, targetFormation int) error { return nil }
func (e BearerEffect) GetDescription() string {
	return "Shield Bearers: Wild card. Define color and value (not greater than 3) when resolving the flag."
}

type CavalryEffect struct{}

func (c CavalryEffect) Apply(g *Game, playerID string, targetFormation int) error { return nil }
func (c CavalryEffect) GetDescription() string {
	return "Shield Bearers: Wild card. Define color and value (not greater than 3) when resolving the flag."
}
