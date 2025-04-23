import React, { useState } from "react";
import toast from "react-hot-toast";
import Card from "./Card";

// This component is displayed when playing morale tactics cards
const MoraleCardResolver = ({
  card,
  playerId,
  flagId,
  flagData,
  sendMessage,
  closeHandler,
}) => {
  // Initialize values based on card type
  const [cardValues, setCardValues] = useState({
    color: "",
    value: card?.Name === "Cavalry" ? 8 : "",
  });

  // Available colors and values
  const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Check if form is valid
  const isFormValid = () => {
    if (card.Name === "Alexander" || card.Name === "Darius") {
      return cardValues.color && cardValues.value;
    }
    if (card.Name === "Cavalry") {
      return !!cardValues.color;
    }
    if (card.Name === "Shield Bearers") {
      return cardValues.color && cardValues.value && cardValues.value <= 3;
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid()) {
      toast.error(
        "Please fill in all required fields or input the field correctly"
      );
      return;
    }

    // Create a transformed card with the selected values
    const transformedCard = {
      ...card,
      Color: cardValues.color,
      Value: card.Name === "Cavalry" ? 8 : parseInt(cardValues.value),
      // Keep track of original card details for frontend display
      originalCard: {
        Name: card.Name,
        IsSpecial: true,
      },
    };

    // Play the transformed card as a regular troop card
    sendMessage("playCard", {
      card: transformedCard,
      flagId: parseInt(flagId),
    });

    closeHandler();
  };

  // Update card values
  const updateCardValue = (field, value) => {
    setCardValues({
      ...cardValues,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">{card.Name}</h3>

          <div className="mb-4">
            <div className="flex justify-center mb-4">
              <Card card={card} />
            </div>

            <p className="text-gray-600 text-sm mb-4">
              {card.Name === "Leader" &&
                "Define color and value for this Leader card."}
              {card.Name === "Cavalry" &&
                "Define color for this Cavalry card (value is fixed at 8)."}
              {card.Name === "Shield Bearers" &&
                "Define color and value (max 3) for this Shield Bearers card."}
            </p>
          </div>

          {/* Color selection for all morale cards */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color:
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={cardValues.color}
              onChange={(e) => updateCardValue("color", e.target.value)}
            >
              <option value="">Select a color</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          {/* Value selection for Leader and Shield Bearers */}
          {card.Name !== "Cavalry" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value: {card.Name === "Shield Bearers" && "(max 3)"}
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={cardValues.value}
                onChange={(e) =>
                  updateCardValue("value", parseInt(e.target.value))
                }
              >
                <option value="">Select a value</option>
                {values
                  .filter((val) => card.Name !== "Shield Bearers" || val <= 3)
                  .map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Fixed value display for Companion Cavalry */}
          {card.Name === "Cavalry" && (
            <div className="mb-4 p-3 bg-gray-100 rounded-md">
              <p className="text-gray-700">
                Fixed value: <span className="font-bold">8</span>
              </p>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={closeHandler}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Play Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoraleCardResolver;
