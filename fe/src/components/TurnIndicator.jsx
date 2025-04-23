import React from "react";

const TurnIndicator = ({ currentTurn, playerId }) => {
  const isPlayerTurn = currentTurn === playerId;

  return (
    <div className="flex items-center justify-center bg-white rounded-lg shadow-md py-2 px-4 mx-auto my-2 max-w-xs">
      <div
        className={`h-4 w-4 rounded-full mr-2 ${
          isPlayerTurn ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="font-medium">
        {isPlayerTurn ? "Your turn" : "Opponent's turn"}
      </span>
    </div>
  );
};

export default TurnIndicator;
