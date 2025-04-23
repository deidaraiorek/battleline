import React from "react";

const Deck = ({ type, cardsLeft, onDraw }) => {
  // Deck styling based on type
  const isSpecial = type === "special";

  // Icons and colors based on deck type
  const deckStyle = isSpecial
    ? {
        bgColor: "bg-purple-800",
        borderColor: "border-purple-900",
        icon: "✨",
        name: "Special Deck",
      }
    : {
        bgColor: "bg-blue-800",
        borderColor: "border-blue-900",
        icon: "🃏",
        name: "Normal Deck",
      };

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm font-medium mb-1 text-gray-700">
        {deckStyle.name}
      </div>
      <div
        className={`relative cursor-pointer hover:scale-105 transition-transform ${deckStyle.bgColor} ${deckStyle.borderColor} border-2 rounded-lg w-20 h-28 shadow-md flex items-center justify-center`}
        onClick={onDraw}
      >
        {/* Stack effect with multiple cards */}
        <div
          className={`absolute ${deckStyle.bgColor} ${deckStyle.borderColor} border-2 rounded-lg w-20 h-28 -right-1 -bottom-1`}
        ></div>
        <div
          className={`absolute ${deckStyle.bgColor} ${deckStyle.borderColor} border-2 rounded-lg w-20 h-28 -right-2 -bottom-2`}
        ></div>

        {/* Main deck card with icon */}
        <div className="text-3xl text-white">{deckStyle.icon}</div>

        {/* Cards left counter */}
        {cardsLeft !== undefined && (
          <div className="absolute -top-2 -right-2 bg-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-gray-300">
            {cardsLeft}
          </div>
        )}
      </div>
    </div>
  );
};

export default Deck;
