import React, { useState } from "react";

const FloatingGuideButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        aria-label="Game Guide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Battle Line - Game Guide
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold">Overview</h3>
              <p>
                Ancient battles were fought in organized formations. The leaders
                of both sides directed their forces along the battle line to
                gain tactical advantages. How will you muster the battle line?
              </p>

              <h3 className="text-xl font-semibold mt-4">Game Details</h3>
              <ul>
                <li>
                  <strong>Players:</strong> Two
                </li>
                <li>
                  <strong>Playing Time:</strong> 30 minutes
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">Components</h3>
              <ul>
                <li>This rulebook</li>
                <li>
                  60 Troop cards, in six colors each with the values 1 to 10
                </li>
                <li>Ten Tactics cards (white, with different backs)</li>
                <li>Nine Flags (plastic pieces)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">Preparation</h3>
              <p>
                Layout the nine Flags in a line between the two players. Cut the
                Troop deck until one player has the higher number—that player
                shuffles and deals seven Troop cards to each player's hand.
                Place the remaining Troop cards as a facedown deck at one end of
                the battle line. Shuffle the ten Tactics cards and place them as
                a facedown deck at the other end of the battle line.
              </p>

              <h3 className="text-xl font-semibold mt-4">Objective</h3>
              <p>
                The players aim to create powerful formations on their side of
                the Flags to beat the formations on the opponent's side of the
                respective Flags. The first player to win three adjacent Flags
                (a Breakthrough) or any five Flags (an Envelopment) achieves
                victory.
              </p>
              <p>
                The non-dealer plays first; play alternates thereafter. On his
                turn, a player selects either one Troop card or one Tactics card
                from his hand and places it face up on his side of the battle
                line. At the end of his turn, the player draws one card from
                either deck to refresh his hand to seven. When both decks run
                out, no further cards can be drawn, but play continues.
              </p>

              <h3 className="text-xl font-semibold mt-4">Formations</h3>
              <p>The different formations from highest to lowest are:</p>
              <ul>
                <li>
                  <strong>Wedge:</strong> Three cards of the same color with
                  consecutive values. [R4][R5][R3]
                </li>
                <li>
                  <strong>Phalanx:</strong> Three cards of the same value.
                  [Y8][R8][G8]
                </li>
                <li>
                  <strong>Battalion Order:</strong> Three cards of the same
                  color. [B2][B7][B4]
                </li>
                <li>
                  <strong>Skirmish Line:</strong> Three cards with consecutive
                  values. [Y4][R6][G5]
                </li>
                <li>
                  <strong>Host:</strong> Any other formation. [Y5][B5][G3]
                </li>
              </ul>
              <p>
                When comparing two formations in the same category, the
                formation with the higher sum of all three card values is higher
                than the opposing formation.
              </p>

              <h3 className="text-xl font-semibold mt-4">Tactics Cards</h3>
              <p>
                There are ten Tactics cards. Tactics cards are played instead of
                Troop cards to influence the formations. Each Tactics card has a
                special function.
              </p>

              <h4 className="text-lg font-medium mt-2">1. Morale Tactics</h4>
              <ul>
                <li>
                  <strong>Leader (Alexander, Darius):</strong> Wild cards. Play
                  a Leader like any Troop card, but define the color and value
                  when the Flag is resolved.
                </li>
                <li>
                  <strong>Companion Cavalry:</strong> Play this card like any
                  Troop card of value 8, but define its color when the Flag is
                  resolved.
                </li>
                <li>
                  <strong>Shield Bearers:</strong> Play this card like any Troop
                  card, but define its color and its value not larger than 3
                  when the Flag is resolved.
                </li>
              </ul>

              <h4 className="text-lg font-medium mt-2">
                2. Environment Tactics
              </h4>
              <ul>
                <li>
                  <strong>Fog:</strong> The fog card disables all formations,
                  and the Flag is merely decided on the basis of the total value
                  of cards on each side.
                </li>
                <li>
                  <strong>Mud:</strong> The claim for this Flag is now based on
                  four cards on either side, so the formations need to be
                  expanded.
                </li>
              </ul>

              <h4 className="text-lg font-medium mt-2">3. Guile Tactics</h4>
              <ul>
                <li>
                  <strong>Scout:</strong> The player draws a total of three
                  cards the normal deck. Then he chooses to return any two cards
                  from his hand.
                </li>
                <li>
                  <strong>Redeploy:</strong> The player chooses anyone Troop or
                  Tactics card from his side next to an unclaimed Flag, and
                  places it into another available slot, or discards it.
                </li>
                <li>
                  <strong>Deserter:</strong> The player may choose any one Troop
                  or Tactics card from the opponent's side next to an unclaimed
                  Flag, and discards it.
                </li>
                <li>
                  <strong>Traitor:</strong> The player may choose anyone Troop
                  card (but not a Tactics card) from the opponent's side next to
                  an unclaimed Flag, and places it into an empty slot on his own
                  side.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">Game End</h3>
              <p>
                When one player has successfully claimed three adjacent Flags or
                any five Flags, the game ends immediately with this player
                winning. Play halts; no other Flags may be claimed after that.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingGuideButton;
