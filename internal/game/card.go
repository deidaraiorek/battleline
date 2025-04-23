package game

type Value int
type Color string

const (
	SCOUT     = "Scout"
	FOG       = "Fog"
	MUD       = "Mud"
	DESERTER  = "Deserter"
	TRAITOR   = "Traitor"
	REDEPLOY  = "Redeploy"
	ALEXANDER = "Alexander"
	DARIUS    = "Darius"
	BEARER    = "Shield Bearers"
	CAVALRY   = "Cavalry"
)

var (
	SCOUT_EFFECT     CardEffect = ScoutEffect{}
	FOG_EFFECT       CardEffect = FogEffect{}
	MUD_EFFECT       CardEffect = MudEffect{}
	DESERTER_EFFECT  CardEffect = DeserterEffect{}
	TRAITOR_EFFECT   CardEffect = TraitorEffect{}
	REDEPLOY_EFFECT  CardEffect = RedeployEffect{}
	ALEXANDER_EFFECT CardEffect = LeaderEffect{Name: ALEXANDER}
	DARIUS_EFFECT    CardEffect = LeaderEffect{Name: DARIUS}
	BEARER_EFFECT    CardEffect = BearerEffect{}
	CALVALRY_EFFECT  CardEffect = CavalryEffect{}
)

type CardEffect interface {
	Apply(g *Game, playerID string, targetFormation int) error
	GetDescription() string
}

type Special bool

const (
	RED    Color = "Red"
	BLUE   Color = "Blue"
	GREEN  Color = "Green"
	YELLOW Color = "Yellow"
	ORANGE Color = "Orange"
	PURPLE Color = "Purple"
)

type Card struct {
	Id          string     `json:"Id"`
	Value       int        `json:"Value"`
	Color       Color      `json:"Color"`
	IsSpecial   Special    `json:"IsSpecial"`
	Description string     `json:"Description,omitempty"`
	Name        string     `json:"Name,omitempty"`
	CardEffect  CardEffect `json:"-"`
}

func IsWedge(cards []Card) bool {
	if len(cards) < 3 {
		return false
	}
	for i := 1; i < len(cards); i++ {
		if cards[i].Value != cards[i-1].Value+1 || cards[i].Color != cards[i-1].Color {
			return false
		}
	}
	return true
}

func IsPhalanx(cards []Card) bool {
	if len(cards) == 0 {
		return false
	}
	firstValue := cards[0].Value
	for _, card := range cards[1:] {
		if card.Value != firstValue {
			return false
		}
	}
	return true
}

func IsBattalion(cards []Card) bool {
	if len(cards) == 0 {
		return false
	}
	firstColor := cards[0].Color
	for _, card := range cards[1:] {
		if card.Color != firstColor {
			return false
		}
	}
	return true
}

func IsSkirmish(cards []Card) bool {
	if len(cards) < 3 {
		return false
	}
	for i := 1; i < len(cards); i++ {
		if cards[i].Value != cards[i-1].Value+1 {
			return false
		}
	}
	return true
}
