package game

import "sort"

const (
	HOST = iota
	SKIRMISH
	BATTALION
	PHALANX
	WEDGE
)

var FormationTypes = map[int]func([]Card) bool{
	WEDGE:     IsWedge,
	PHALANX:   IsPhalanx,
	BATTALION: IsBattalion,
	SKIRMISH:  IsSkirmish,
}

type Flag struct {
	Id           string
	Claimed      string
	FormationMap map[string]*Formation
	Limit        int
	Fogged       bool
}

type Formation struct {
	Type  int
	Cards []Card
	Total int
}

func (flag *Flag) GetFormationType(cards []Card) (int, int) {
	sort.Slice(cards, func(i, j int) bool {
		return cards[i].Value < cards[j].Value
	})

	total := 0
	if flag.Fogged {
		return HOST, total
	}

	if IsWedge(cards) {
		return WEDGE, total
	}
	if IsPhalanx(cards) {
		return PHALANX, total
	}
	if IsBattalion(cards) {
		return BATTALION, total
	}
	if IsSkirmish(cards) {
		return SKIRMISH, total
	}

	return HOST, total
}

func isFormationBetter(type1, total1, type2, total2 int) int {
	if type1 > type2 {
		return 1
	} else if type1 < type2 {
		return 2
	} else {
		if total1 > total2 {
			return 1
		} else if total2 > total1 {
			return 2
		}
		return 0
	}
}

func (g *Game) canBeatWithDeckCards(opponentId string, opponentCards []Card, cardsNeeded int, playerType, playerTotal int, playerId string, flag *Flag) bool {
	player := g.Players[playerId]
	opponent := g.Players[opponentId]
	deck := append([]Card{}, g.Deck...)
	deck = append(deck, player.Hand...)
	deck = append(deck, opponent.Hand...)
	switch cardsNeeded {
	case 1:
		for _, card := range deck {
			testHand := append(append([]Card{}, opponentCards...), card)
			testType, testTotal := flag.GetFormationType(testHand)

			opponentBetter := isFormationBetter(testType, testTotal, playerType, playerTotal)
			if opponentBetter == 1 {
				return true
			}
		}

	case 2:
		for i := 0; i < len(deck); i++ {
			for j := i + 1; j < len(deck); j++ {
				testHand := append(append([]Card{}, opponentCards...),
					deck[i], deck[j])
				testType, testTotal := flag.GetFormationType(testHand)
				opponentBetter := isFormationBetter(testType, testTotal, playerType, playerTotal)
				if opponentBetter == 1 {
					return true
				}
			}
		}

	case 3:
		for i := 0; i < len(deck); i++ {
			for j := i + 1; j < len(deck); j++ {
				for k := j + 1; k < len(deck); k++ {
					testHand := append(append([]Card{}, opponentCards...),
						deck[i], deck[j], deck[k])
					testType, testTotal := flag.GetFormationType(testHand)
					opponentBetter := isFormationBetter(testType, testTotal, playerType, playerTotal)
					if opponentBetter == 1 {
						return true
					}
				}
			}
		}

	case 4:
		// Four cards needed (Mud effect)
		for i := 0; i < len(deck); i++ {
			for j := i + 1; j < len(deck); j++ {
				for k := j + 1; k < len(deck); k++ {
					for l := k + 1; l < len(deck); l++ {
						testHand := append(append([]Card{}, opponentCards...),
							deck[i], deck[j], deck[k], deck[l])
						testType, testTotal := flag.GetFormationType(testHand)
						opponentBetter := isFormationBetter(testType, testTotal, playerType, playerTotal)
						if opponentBetter == 1 {
							return true
						}
					}
				}
			}
		}
	}

	return false
}
