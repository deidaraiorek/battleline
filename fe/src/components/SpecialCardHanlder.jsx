import React, { useState } from "react";
import toast from "react-hot-toast";
import Card from "./Card";

const SpecialCardHandler = ({
  card,
  playerId,
  sendMessage,
  closeHandler,
  gameState,
}) => {
  const [selectedReturnCards, setSelectedReturnCards] = useState([]);
  const [step, setStep] = useState(1);

  const [selectedFlag, setSelectedFlag] = useState(null);
  const [selectedTargetFlag, setSelectedTargetFlag] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleScout = () => {
    if (step === 1) {
      if (gameState.deckCount < 3) {
        toast.error(
          `Not enough cards in the normal deck (${gameState.deckCount} remaining)`
        );
        return;
      }

      sendMessage("playSpecial", {
        card: card,
        action: "scout_draw",
      });

      setStep(2);
    }
    // Step 2: Player is selecting which cards to return
    else if (step === 2) {
      if (selectedReturnCards.length !== 2) {
        toast.error("You must select exactly 2 cards to return");
        return;
      }

      // Send message to return cards
      sendMessage("playSpecial", {
        card: card,
        action: "scout_return",
        returnCards: selectedReturnCards,
      });

      // Close the modal
      closeHandler();
    }
  };

  // Handle Redeploy card functionality
  const handleRedeploy = () => {
    if (!selectedFlag) {
      toast.error("Please select a flag");
      return;
    }

    if (!selectedCard) {
      toast.error("Please select a card to redeploy");
      return;
    }

    if (step === 1) {
      // If we're just selecting a card to redeploy
      setStep(2); // Move to selecting a target flag
    } else {
      // We're selecting a target flag or discarding
      let action;

      if (selectedTargetFlag) {
        // Redeploy to another flag
        action = "redeploy_to_flag";
        sendMessage("playSpecial", {
          card: card,
          action: action,
          sourceFlag: parseInt(selectedFlag),
          targetFlag: parseInt(selectedTargetFlag),
          selectedCard: selectedCard,
        });
      } else {
        // Discard the card
        action = "redeploy_discard";
        sendMessage("playSpecial", {
          card: card,
          action: action,
          sourceFlag: parseInt(selectedFlag),
          selectedCard: parseInt(selectedCard),
        });
      }

      closeHandler();
    }
  };

  // Handle Deserter card functionality
  const handleDeserter = () => {
    if (!selectedFlag) {
      toast.error("Please select an opponent's flag");
      return;
    }

    if (!selectedCard) {
      toast.error("Please select a card to remove");
      return;
    }

    sendMessage("playSpecial", {
      card: card,
      action: "deserter",
      flag: parseInt(selectedFlag),
      selectedCard: selectedCard,
    });

    closeHandler();
  };

  // Handle Traitor card functionality
  const handleTraitor = () => {
    if (!selectedFlag) {
      toast.error("Please select an opponent's flag");
      return;
    }

    if (!selectedCard) {
      toast.error("Please select a card to take");
      return;
    }

    if (step === 1) {
      // We've selected a card to take
      setStep(2); // Move to selecting a target flag
    } else {
      // We're selecting a target flag
      if (!selectedTargetFlag) {
        toast.error("Please select a flag to place the card");
        return;
      }

      sendMessage("playSpecial", {
        card: card,
        action: "traitor",
        sourceFlag: parseInt(selectedFlag),
        targetFlag: parseInt(selectedTargetFlag),
        selectedCard: selectedCard,
      });

      closeHandler();
    }
  };

  // Handle primary action button click based on card type
  const handlePrimaryAction = () => {
    switch (card.Name) {
      case "Scout":
        handleScout();
        break;
      case "Redeploy":
        handleRedeploy();
        break;
      case "Deserter":
        handleDeserter();
        break;
      case "Traitor":
        handleTraitor();
        break;
      default:
        toast.error("Card action not implemented");
        closeHandler();
    }
  };

  // Handle selecting cards to return (for Scout)
  const toggleCardSelection = (card) => {
    // Make sure we have a valid card object with an id
    if (!card || !card.Id) {
      console.error("Invalid card object:", card);
      return;
    }

    // Use the functional form of setState to ensure we're working with the latest state
    setSelectedReturnCards((prevSelected) => {
      // Log current selection and the card being toggled for debugging
      console.log("Current selection:", prevSelected);
      console.log("Toggling card:", card);

      // Check if card is already selected by comparing IDs
      const isAlreadySelected = prevSelected.some((c) => c.Id === card.Id);
      console.log("Is already selected?", isAlreadySelected);

      if (isAlreadySelected) {
        // Remove the card if already selected
        const newSelection = prevSelected.filter((c) => c.Id !== card.Id);
        console.log("New selection after removal:", newSelection);
        return newSelection;
      } else if (prevSelected.length < 2) {
        // Add the card to selected cards
        const newSelection = [...prevSelected, card];
        console.log("New selection after addition:", newSelection);
        return newSelection;
      } else {
        toast.error("You can only select 2 cards to return");
        return prevSelected; // Return unchanged
      }
    });
  };
  // Handle selecting a flag and a card on that flag
  const handleFlagSelect = (flagId) => {
    // If this flag is already selected, unselect it
    if (selectedFlag === flagId) {
      setSelectedFlag(null);
      setSelectedCard(null);
      return;
    }

    // Otherwise, select this flag
    setSelectedFlag(flagId);
    setSelectedCard(null); // Reset selected card
  };

  // Handle selecting a target flag (for Redeploy and Traitor)
  const handleTargetFlagSelect = (flagId) => {
    // If this flag is already selected, unselect it
    if (selectedTargetFlag === flagId) {
      setSelectedTargetFlag(null);
      return;
    }

    // Otherwise, select this flag
    setSelectedTargetFlag(flagId);
  };

  // Handle selecting a card on a flag
  const handleFlagCardSelect = (card) => {
    setSelectedCard(card);
  };

  // Get available flags based on card type and step
  const getAvailableFlags = () => {
    const flags = gameState.flags.filter((flagObj) => {
      const flagId = Object.keys(flagObj)[0];
      const flag = flagObj[flagId];

      // For Redeploy step 1, only show flags with player's cards
      if (card.Name === "Redeploy" && step === 1) {
        return (
          flag.formationMap?.[playerId]?.hand?.length > 0 &&
          flag.claimed !== playerId
        );
      }

      // For Deserter and Traitor step 1, only show flags with opponent's cards
      if ((card.Name === "Deserter" || card.Name === "Traitor") && step === 1) {
        const opponentId = Object.keys(flag.formationMap || {}).find(
          (id) => id !== playerId
        );
        return (
          opponentId &&
          flag.formationMap[opponentId]?.hand?.length > 0 &&
          (flag.claimed === "" || flag.claimed === playerId)
        );
      }

      // For Redeploy and Traitor step 2, show available flags for player
      if ((card.Name === "Redeploy" || card.Name === "Traitor") && step === 2) {
        const playerFormation = flag.formationMap?.[playerId]?.hand || [];
        const limit = flag.limit;
        return playerFormation.length < limit;
      }

      return true;
    });

    return flags;
  };

  // Get cards on a selected flag
  const getCardsOnFlag = () => {
    if (!selectedFlag) return [];

    const flagObj = gameState.flags.find(
      (obj) => Object.keys(obj)[0] === selectedFlag
    );
    if (!flagObj) return [];

    const flag = flagObj[selectedFlag];

    // For Redeploy, get player's cards
    if (card.Name === "Redeploy") {
      return (flag.formationMap?.[playerId]?.hand || []).filter(
        (card) => !card.IsSpecial
      );
    }

    // For Deserter and Traitor, get opponent's cards
    if (card.Name === "Deserter" || card.Name === "Traitor") {
      const opponentId = Object.keys(flag.formationMap || {}).find(
        (id) => id !== playerId
      );
      return opponentId
        ? (flag.formationMap[opponentId]?.hand || []).filter(
            (card) => !card.IsSpecial
          )
        : [];
    }

    return [];
  };

  // Render appropriate content based on card type
  const renderCardContent = () => {
    switch (card.Name) {
      case "Scout":
        return renderScoutContent();
      case "Redeploy":
        return renderRedeployContent();
      case "Deserter":
        return renderDeserterContent();
      case "Traitor":
        return renderTraitorContent();
      default:
        return (
          <div className="p-4">
            Card "{card.Name}" functionality not implemented yet
          </div>
        );
    }
  };

  // Render Scout card content based on current step
  const renderScoutContent = () => {
    if (step === 1) {
      return (
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">Scout Card</h3>
          <p className="mb-4">You will draw 3 cards from the normal deck</p>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p>
              Normal deck cards remaining:{" "}
              <span className="font-bold">{gameState.deckCount}</span>
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            After drawing, you'll select 2 cards to return to the top of the
            deck.
          </p>
        </div>
      );
    } else if (step === 2) {
      return (
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">Scout Card: Return 2 Cards</h3>
          <p className="mb-4">
            Select 2 cards from your hand to return to the top of the deck
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {gameState.hand.map((card, index) => (
              <div
                key={`select-card-${index}`}
                className={`p-2 border-2 rounded cursor-pointer transition-all ${
                  selectedReturnCards.some((c) => c.Id === card.Id)
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => toggleCardSelection(card)}
              >
                <div
                  className={`p-2 rounded ${
                    card.IsSpecial
                      ? "bg-cyan-500"
                      : colorMap[card.Color] || "bg-gray-300"
                  }`}
                >
                  {card.IsSpecial ? card.Name : `${card.Color} ${card.Value}`}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="mb-2">Selected: {selectedReturnCards.length} / 2</p>
          </div>
        </div>
      );
    }
  };

  // Render Redeploy card content
  const renderRedeployContent = () => {
    const availableFlags = getAvailableFlags();
    const cardsOnFlag = getCardsOnFlag();

    return (
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4">Redeploy Card</h3>

        {step === 1 ? (
          <>
            <p className="mb-4">
              Select one of your cards to redeploy or discard
            </p>

            {/* Flag selection */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Select a flag:</h4>
              <div className="grid grid-cols-3 gap-2">
                {availableFlags.map((flagObj) => {
                  const flagId = Object.keys(flagObj)[0];
                  const flag = flagObj[flagId];

                  return (
                    <div
                      key={`flag-${flagId}`}
                      className={`p-2 border-2 rounded cursor-pointer transition-all text-center ${
                        selectedFlag === flagId
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleFlagSelect(flagId)}
                    >
                      <div className="flex justify-center items-center h-8">
                        <span className="text-xl">🏳️</span>
                        <span className="ml-2">Flag {flagId}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card selection, only if a flag is selected */}
            {selectedFlag && (
              <div>
                <h4 className="font-medium mb-2">Select a card:</h4>
                <div className="flex justify-center space-x-2">
                  {cardsOnFlag.map((card, index) => (
                    <div
                      key={`flag-card-${index}`}
                      className={`cursor-pointer transition-all transform ${
                        selectedCard && selectedCard.Id === card.Id
                          ? "scale-110 ring-2 ring-blue-500"
                          : "hover:scale-105"
                      }`}
                      onClick={() => handleFlagCardSelect(card)}
                    >
                      <Card card={card} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mb-4">
              Select a flag to move the card to, or discard it
            </p>

            {/* Target flag selection */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">
                Select a target flag (or skip to discard):
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {availableFlags.map((flagObj) => {
                  const flagId = Object.keys(flagObj)[0];
                  const flag = flagObj[flagId];

                  return (
                    <div
                      key={`target-flag-${flagId}`}
                      className={`p-2 border-2 rounded cursor-pointer transition-all text-center ${
                        selectedTargetFlag === flagId
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleTargetFlagSelect(flagId)}
                    >
                      <div className="flex justify-center items-center h-8">
                        <span className="text-xl">🏳️</span>
                        <span className="ml-2">Flag {flagId}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected card display */}
            <div className="mb-4 text-center">
              <h4 className="font-medium mb-2">Card to redeploy:</h4>
              <div className="flex justify-center">
                {selectedCard && <Card card={selectedCard} />}
              </div>
            </div>

            {/* Discard option */}
            <div className="text-center mb-4">
              <p>Or discard this card by clicking "Discard" below</p>
            </div>
          </>
        )}
      </div>
    );
  };

  // Render Deserter card content
  const renderDeserterContent = () => {
    const availableFlags = getAvailableFlags();
    const cardsOnFlag = getCardsOnFlag();

    return (
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4">Deserter Card</h3>
        <p className="mb-4">Choose an opponent's card to discard</p>

        {/* Flag selection */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Select an opponent's flag:</h4>
          <div className="grid grid-cols-3 gap-2">
            {availableFlags.map((flagObj) => {
              const flagId = Object.keys(flagObj)[0];
              const flag = flagObj[flagId];

              return (
                <div
                  key={`flag-${flagId}`}
                  className={`p-2 border-2 rounded cursor-pointer transition-all text-center ${
                    selectedFlag === flagId
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => handleFlagSelect(flagId)}
                >
                  <div className="flex justify-center items-center h-8">
                    <span className="text-xl">🏳️</span>
                    <span className="ml-2">Flag {flagId}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card selection, only if a flag is selected */}
        {selectedFlag && (
          <div>
            <h4 className="font-medium mb-2">Select a card to discard:</h4>
            <div className="flex justify-center space-x-2">
              {cardsOnFlag.map((card, index) => (
                <div
                  key={`flag-card-${index}`}
                  className={`cursor-pointer transition-all transform ${
                    selectedCard && selectedCard.Id === card.Id
                      ? "scale-110 ring-2 ring-blue-500"
                      : "hover:scale-105"
                  }`}
                  onClick={() => handleFlagCardSelect(card)}
                >
                  <Card card={card} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Traitor card content
  const renderTraitorContent = () => {
    const availableFlags = getAvailableFlags();
    const cardsOnFlag = getCardsOnFlag();

    return (
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4">Traitor Card</h3>

        {step === 1 ? (
          <>
            <p className="mb-4">Choose an opponent's troop card to take</p>

            {/* Flag selection */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Select an opponent's flag:</h4>
              <div className="grid grid-cols-3 gap-2">
                {availableFlags.map((flagObj) => {
                  const flagId = Object.keys(flagObj)[0];
                  const flag = flagObj[flagId];

                  return (
                    <div
                      key={`flag-${flagId}`}
                      className={`p-2 border-2 rounded cursor-pointer transition-all text-center ${
                        selectedFlag === flagId
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleFlagSelect(flagId)}
                    >
                      <div className="flex justify-center items-center h-8">
                        <span className="text-xl">🏳️</span>
                        <span className="ml-2">Flag {flagId}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card selection, only if a flag is selected */}
            {selectedFlag && (
              <div>
                <h4 className="font-medium mb-2">Select a card to take:</h4>
                <div className="flex justify-center space-x-2">
                  {cardsOnFlag
                    .filter((card) => !card.IsSpecial)
                    .map((card, index) => (
                      <div
                        key={`flag-card-${index}`}
                        className={`cursor-pointer transition-all transform ${
                          selectedCard && selectedCard.Id === card.Id
                            ? "scale-110 ring-2 ring-blue-500"
                            : "hover:scale-105"
                        }`}
                        onClick={() => handleFlagCardSelect(card)}
                      >
                        <Card card={card} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mb-4">Select one of your flags to place the card</p>

            {/* Target flag selection */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Select your flag:</h4>
              <div className="grid grid-cols-3 gap-2">
                {availableFlags.map((flagObj) => {
                  const flagId = Object.keys(flagObj)[0];
                  const flag = flagObj[flagId];

                  return (
                    <div
                      key={`target-flag-${flagId}`}
                      className={`p-2 border-2 rounded cursor-pointer transition-all text-center ${
                        selectedTargetFlag === flagId
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleTargetFlagSelect(flagId)}
                    >
                      <div className="flex justify-center items-center h-8">
                        <span className="text-xl">🏳️</span>
                        <span className="ml-2">Flag {flagId}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected card display */}
            <div className="mb-4 text-center">
              <h4 className="font-medium mb-2">Card to place:</h4>
              <div className="flex justify-center">
                {selectedCard && <Card card={selectedCard} />}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const colorMap = {
    Red: "bg-red-500",
    Blue: "bg-blue-500",
    Green: "bg-green-500",
    Yellow: "bg-yellow-500",
    Purple: "bg-purple-500",
    Orange: "bg-orange-500",
  };

  // Get the primary action button text based on card type and step
  const getPrimaryButtonText = () => {
    switch (card.Name) {
      case "Scout":
        return step === 1 ? "Draw Cards" : "Return Cards";
      case "Redeploy":
        if (step === 1) return "Continue";
        return selectedTargetFlag ? "Move Card" : "Discard Card";
      case "Deserter":
        return "Discard Card";
      case "Traitor":
        return step === 1 ? "Continue" : "Place Card";
      default:
        return "Continue";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {renderCardContent()}

        <div className="border-t p-4 flex justify-between">
          {!(card.Name === "Scout" && step === 2) && (
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={closeHandler}
            >
              Cancel
            </button>
          )}

          {card.Name === "Scout" && step === 2 && (
            <div className="invisible px-4 py-2">Cancel</div>
          )}
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={handlePrimaryAction}
          >
            {getPrimaryButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialCardHandler;
