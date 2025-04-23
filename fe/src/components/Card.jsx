import React from "react";

// Card component that displays a playing card
const Card = ({ card, onClick, isSelectable = false }) => {
  if (!card) return null;

  // Map color values to actual colors
  const colorMap = {
    Red: "bg-red-500", // Red
    Blue: "bg-blue-500", // Blue
    Green: "bg-green-500", // Green
    Yellow: "bg-yellow-500", // Yellow
    Purple: "bg-purple-500", // Purple
    Orange: "bg-orange-500",
  };

  // Map value to display text
  const valueMap = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
  };

  // Icon mapping based on card color
  const iconMap = {
    1: "🐷",
    2: "🦄",
    3: "🦁",
    4: "🐗",
    5: "🦏",
    6: "🦖",
    7: "🐘",
    8: "🐼",
    9: "🐲",
    10: "🐵",
  };

  // Get the corresponding color class and icon
  const isSpecial = card.IsSpecial;
  const colorClass = isSpecial
    ? "bg-gradient-to-r from-cyan-500 to-cyan-800"
    : colorMap[card.Color] || "bg-gray-300";
  const displayValue = card.Value || "?";
  const icon = iconMap[card.Value] || "🗣";

  return (
    <div
      className={`
        relative w-20 h-28 rounded-lg shadow-md 
        ${colorClass} border-2 border-white 
        ${
          isSelectable
            ? "cursor-pointer hover:scale-105 transition-transform"
            : ""
        }
      `}
      onClick={() => isSelectable && onClick && onClick(card)}
    >
      {/* Display different content based on whether the card is special or not */}
      {isSpecial ? (
        <>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            {icon}
          </div>

          {/* Card name at the bottom - using smaller font and allowing wrapping */}
          <div
            className="absolute bottom-1 inset-x-0 text-center text-gray-800 font-medium text-xs px-1 leading-tight"
            style={{ fontSize: "0.65rem" }}
          >
            {card.Name || "Special"}
          </div>

          {/* Special effect indicator */}
          <div className="absolute top-0 right-0 w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
            ✨
          </div>
        </>
      ) : (
        <>
          {/* Top left value */}
          <div className="absolute top-1 left-1 text-white font-bold">
            {displayValue}
          </div>

          {/* Bottom right value */}
          <div className="absolute bottom-1 right-1 text-white font-bold">
            {displayValue}
          </div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            {icon}
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
