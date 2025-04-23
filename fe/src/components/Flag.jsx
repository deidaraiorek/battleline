import React from "react";
import Card from "./Card";

const Flag = ({
  flag,
  playerId,
  onCardSelect,
  selectedFlagId,
  isPlayerTurn,
  onClaimFlag,
}) => {
  if (!flag) return null;

  // Get formations for this flag
  const playerFormation = flag.formationMap?.[playerId];

  // Find opponent's userId (first userId that isn't the player's)
  const opponentId = Object.keys(flag.formationMap || {}).find(
    (id) => id !== playerId
  );
  const opponentFormation = opponentId ? flag.formationMap[opponentId] : null;

  // Check if this flag is claimed by anyone
  const isClaimed = !!flag.claimed;
  const isClaimedByPlayer = flag.claimed === playerId;
  const isClaimedByOpponent = isClaimed && !isClaimedByPlayer;

  // Check if this flag is currently selected
  const isSelected = selectedFlagId === flag.id;

  // Get card limit from flag
  const cardLimit = flag.limit || 3;

  // Check if flag has environment effects
  const hasFog = flag.fogged === true;
  const hasMud = cardLimit === 4;

  // Icons for flag status
  const flagIcons = {
    unclaimed: "🏳️",
    player: "🚩",
    opponent: "⛳",
  };

  const flagIcon = isClaimedByPlayer
    ? flagIcons.player
    : isClaimedByOpponent
    ? flagIcons.opponent
    : flagIcons.unclaimed;

  return (
    <div
      className={`
      relative flex flex-col items-center
      p-3 m-2 rounded-lg
      w-36 h-40
      ${
        isSelected
          ? "bg-yellow-200 border-2 border-yellow-400"
          : isClaimed
          ? isClaimedByPlayer
            ? "bg-green-100"
            : "bg-red-100"
          : "bg-gray-100 hover:bg-gray-200"
      }
      ${
        !isClaimed ||
        (isClaimed &&
          !isClaimedByPlayer &&
          playerFormation?.hand?.length < cardLimit)
          ? "cursor-pointer"
          : ""
      }
      transition-colors duration-200
      `}
      onClick={() =>
        (!isClaimed ||
          (isClaimed &&
            !isClaimedByPlayer &&
            playerFormation?.hand?.length < cardLimit)) &&
        onCardSelect(flag.id)
      }
    >
      {/* Opponent's cards - with red border and repositioned */}
      <div className="mb-2 min-h-14 w-full">
        {opponentFormation ? (
          <div className="flex justify-center">
            {opponentFormation.hand?.map((card, index) => (
              <div
                key={`opponent-${flag.id}-${index}`}
                style={{
                  transform: "scale(0.50)",
                  marginLeft: "-16px",
                  marginRight: "-16px",
                  position: "relative",
                  top: "-40px",
                }}
              >
                <div className="border-2 border-red-500 rounded-md">
                  <Card card={card} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-10 flex items-center justify-center text-xs text-gray-400">
            No cards
          </div>
        )}
      </div>

      {/* Flag in the middle */}
      <div className="relative mb-2 flex-grow flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="text-3xl">{flagIcon}</div>
          {/* Environment effects next to flag icon */}
          <div className="flex space-x-1">
            {hasFog && (
              <div className="bg-gray-500 text-white px-1.5 py-0.5 rounded text-xs flex items-center">
                <span className="mr-0.5">🌫️</span>
              </div>
            )}
            {hasMud && (
              <div className="bg-amber-700 text-white px-1.5 py-0.5 rounded text-xs flex items-center">
                <span className="mr-0.5">💩</span>
              </div>
            )}
          </div>
          {isPlayerTurn &&
            !isClaimed &&
            playerFormation?.hand?.length === cardLimit && (
              <button
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-full shadow-md transition-all duration-200 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onClaimFlag(flag.id);
                }}
              >
                <span className="mr-1">🏁</span> Claim
              </button>
            )}
        </div>

        {/* Card limit indicator */}
        <div className="absolute -bottom-2 text-xs text-gray-500">
          {playerFormation?.hand?.length || 0}/{cardLimit}
        </div>
      </div>

      {/* Player's cards at bottom */}
      <div className="mt-2 min-h-14 w-full">
        {playerFormation ? (
          <div className="flex justify-center">
            {playerFormation.hand?.map((card, index) => (
              <div
                key={`player-${flag.id}-${index}`}
                style={{
                  transform: "scale(0.6)",
                  marginLeft: "-16px",
                  marginRight: "-16px",
                }}
              >
                <Card card={card} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`h-10 flex items-center justify-center text-xs 
              ${
                !isClaimed
                  ? "text-gray-400 hover:text-blue-500"
                  : "text-gray-300"
              }`}
          >
            {!isClaimed ? "Play here" : "Claimed"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flag;
