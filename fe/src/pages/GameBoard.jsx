import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebsocketContext";
import Card from "../components/Card";
import Flag from "../components/Flag";
import Deck from "../components/Deck";
import toast from "react-hot-toast";
import { Shield, Swords } from "lucide-react";
import SpecialCardHandler from "../components/SpecialCardHanlder";
import MoraleCardResolver from "../components/MoraleResolver";

function GameBoard() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { isConnected, playerId, gameState, error, sendMessage } =
    useWebSocket();
  const [selectedFlagId, setSelectedFlagId] = useState(null);
  const [activeSpecialCard, setActiveSpecialCard] = useState(null);
  const [resolvingMoraleCard, setResolvingMoraleCard] = useState(null);
  const { notification, clearNotification } = useWebSocket();

  useEffect(() => {
    console.log("Current gameState:", JSON.stringify(gameState, null, 4));
  }, [gameState]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <div className="text-red-500 text-center">
          <p className="text-xl">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!isConnected || !playerId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Connecting to game...</p>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div className="">
          <div className="mb-4 text-sm text-gray-500">
            Room: {roomId} • Player ID: {playerId}
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center w-full">
            <h2 className="text-2xl font-bold mb-4">Waiting for opponent...</h2>
            <p>Share your room code with a friend to start the game!</p>
            <div className="mt-4 text-3xl font-mono font-bold text-indigo-600">
              {roomId}
            </div>
          </div>
        </div>
      </div>
    );
  }
  //Remove later
  // console.log(gameState);
  // Add this after the !gameState condition and before the rest of the component

  const normalDeckCount = gameState.deckCount;
  const specialDeckCount = gameState.specialDeckCount;
  const isPlayerTurn = gameState.currentTurn === playerId;
  const isDrawing = gameState.isDrawing === true;

  // Handle playing a card on a flag
  const handleCardSelect = (card) => {
    if (!isPlayerTurn) {
      toast.error("Please wait for your opponent turn");
      return;
    }
    if (isDrawing) {
      toast.error("You already played your turn. Please draw!");
      return;
    }

    if (card.IsSpecial) {
      handleSpecialCard(card);
      return;
    }
    if (selectedFlagId && checkFlagAvailabilty(selectedFlagId, true)) {
      sendMessage("playCard", {
        card: card,
        flagId: parseInt(selectedFlagId),
      });
      setSelectedFlagId(null); // Reset selection
    }
  };

  const handleSpecialCard = (card) => {
    if (!isPlayerTurn) {
      toast.error("bruh, slow down");
      return;
    }
    switch (card.Name) {
      case "Scout":
      case "Redeploy":
      case "Deserter":
      case "Traitor":
        setActiveSpecialCard(card);
        break;
      case "Fog":
      case "Mud":
        if (selectedFlagId) {
          console.log(selectedFlagId, "lokkkkk");
          const flagObj = gameState.flags.find(
            (obj) => Object.keys(obj)[0] === selectedFlagId
          );

          if (!flagObj) return false;

          const flag = flagObj[selectedFlagId];

          if (flag.claimed !== "") {
            if (needToast) {
              toast.error("This flag is already claimed!");
            }
            return;
          }
          console.log("hi", parseInt(selectedFlagId));
          sendMessage("playSpecial", {
            card: card,
            action: card.Name === "Fog" ? "play_fog" : "play_mud",
            flag: parseInt(selectedFlagId),
          });
          setSelectedFlagId(null);
        } else {
          toast.info("Select a flag to play this card on");
        }
        break;
      case "Alexander":
      case "Darius":
      case "Cavalry":
      case "Shield Bearers":
        if (!selectedFlagId) {
          toast.error("Select a flag to play this card on");
          return;
        }

        const flagObj = gameState.flags.find(
          (obj) => Object.keys(obj)[0] === selectedFlagId
        );
        if (!flagObj) return;

        const flag = flagObj[selectedFlagId];
        const playerFormation = flag.formationMap?.[playerId]?.hand || [];
        const limit = flag.limit;

        if (playerFormation.length !== limit - 1) {
          toast.error("This card must be the final card in your formation");
          return;
        }

        setResolvingMoraleCard({
          card: card,
          flagId: selectedFlagId,
          flagData: flag,
        });
        break;
    }
  };

  // Handle selecting a flag to play on
  const handleFlagSelect = (flagId) => {
    setSelectedFlagId(flagId);
  };

  // Handle drawing a card
  const handleDrawCard = (deckType) => {
    if (!checkTurn(playerId)) {
      toast.error("Not your turn yet");
      return;
    }
    if (!gameState.isDrawing) {
      toast.error("bruh, you dont need that many cards");
      return;
    }
    var deckCount = deckType === "normal" ? normalDeckCount : specialDeckCount;
    if (deckCount === 0) {
      toast.error("bruh, please choose the other deck");
      return;
    }
    sendMessage("drawCard", { deckType });
  };

  const checkTurn = (playerId) => {
    return playerId == gameState.currentTurn;
  };

  const checkFlagAvailabilty = (flagId, needToast) => {
    const flagObj = gameState.flags.find(
      (obj) => Object.keys(obj)[0] === flagId
    );

    if (!flagObj) return false;

    const flag = flagObj[flagId];

    if (flag.claimed === playerId) {
      if (needToast) {
        toast.error("You can't play on a flag you claimed!");
      }
      return false;
    }

    const playerFormation = flag.formationMap?.[playerId]?.hand || [];
    const limit = flag?.limit || 3;

    if (playerFormation.length >= limit) {
      if (needToast) {
        toast.error("You have already placed max cards on this flag!");
      }
      return false;
    }

    return true;
  };

  const sortedFlags = [...gameState.flags].sort((a, b) => {
    const idA = Object.keys(a)[0];
    const idB = Object.keys(b)[0];
    return idA.localeCompare(idB);
  });

  const handleClaimFlag = (flagId) => {
    if (!isPlayerTurn) {
      toast.error("Not your turn");
      return;
    }
    var isFlagAvailable = checkFlagAvailabilty(flagId, false);
    if (isFlagAvailable) {
      toast.error("Bruh, you must play 3 cards to claim this flag");
      return;
    }
    sendMessage("claimFlag", {
      flagId: parseInt(flagId),
    });
  };
  const handleCloseSpecialCard = () => {
    setActiveSpecialCard(null);
  };

  const handleCloseMoraleResolver = () => {
    setResolvingMoraleCard(null);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-green-50 to-blue-50 flex flex-col overflow-hidden">
      {activeSpecialCard && (
        <SpecialCardHandler
          card={activeSpecialCard}
          playerId={playerId}
          sendMessage={sendMessage}
          closeHandler={handleCloseSpecialCard}
          gameState={gameState}
        />
      )}
      {resolvingMoraleCard && (
        <MoraleCardResolver
          card={resolvingMoraleCard.card}
          playerId={playerId}
          flagId={resolvingMoraleCard.flagId}
          flagData={resolvingMoraleCard.flagData}
          sendMessage={sendMessage}
          closeHandler={handleCloseMoraleResolver}
        />
      )}

      {notification && notification.type === "specialCard" && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <p>Opponent is playing {notification.cardName}</p>
            <p className="text-xs mt-1">{notification.cardDescription}</p>
          </div>
        </div>
      )}
      {/* Header with room info and turn indicator */}
      <div className="bg-white px-4 py-2 flex justify-between items-center border-b border-gray-200">
        <div className="text-sm text-gray-500">
          Room: {roomId} • Player ID: {playerId}
        </div>

        {/* Turn Indicator */}
        <div
          className={`px-3 py-1 rounded-lg font-medium flex items-center ${
            isPlayerTurn
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div
            className={`h-3 w-3 rounded-full mr-2 ${
              isPlayerTurn ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {isPlayerTurn
            ? isDrawing === true
              ? "Please draw one card from either decks"
              : "Your turn"
            : "Opponent turn"}
        </div>

        {selectedFlagId && (
          <div className="px-3 py-1 bg-yellow-100 rounded-lg text-yellow-800">
            Select a card to play
            <button
              className="ml-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setSelectedFlagId(null)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Game content with flex layout */}
      <div className="flex-1 flex flex-col p-2">
        {/* Opponent's hand - smaller height */}
        <div className="text-center mb-2">
          <div className="text-lg font-bold mb-1">Opponent's Hand</div>
          <div className="flex justify-center space-x-1">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`opponent-card-${i}`}
                  className="w-12 h-16 bg-indigo-600 rounded-md shadow-md border border-indigo-700"
                />
              ))}
          </div>
        </div>

        {/* Battlefield with flags - takes available space */}
        <div className="flex-1 flex flex-col">
          <div className="text-lg font-bold mb-2 text-center">Battlefield</div>
          <div className="flex-1 flex flex-wrap justify-center content-start w-full overflow-auto">
            {sortedFlags.map((flagObj) => {
              const flagId = Object.keys(flagObj)[0];
              const flagData = flagObj[flagId];

              return (
                <Flag
                  key={flagId}
                  flag={{ ...flagData, id: flagId }}
                  playerId={playerId}
                  onCardSelect={handleFlagSelect}
                  selectedFlagId={selectedFlagId}
                  isPlayerTurn={isPlayerTurn}
                  onClaimFlag={handleClaimFlag}
                />
              );
            })}
          </div>
        </div>

        {/* Player's hand and decks - fixed at bottom */}
        <div className="mt-auto pt-2">
          <div className="text-lg font-bold mb-2 text-center">Your Hand</div>
          <div className="flex justify-between items-end">
            {/* Normal Deck (left side) */}
            <div className="w-24">
              <Deck
                type="normal"
                cardsLeft={normalDeckCount}
                onDraw={() => handleDrawCard("normal")}
              />
            </div>

            {/* Player's hand (center) */}
            <div className="flex-1 mx-4">
              <div className="flex justify-center space-x-2 flex-wrap">
                {gameState.hand?.map((card, index) => (
                  <Card
                    key={`hand-${index}`}
                    card={card}
                    isSelectable={!!selectedFlagId || card.IsSpecial}
                    onClick={handleCardSelect}
                  />
                ))}
              </div>
            </div>

            {/* Special Deck (right side) */}
            <div className="w-24">
              <Deck
                type="special"
                cardsLeft={specialDeckCount}
                onDraw={() => handleDrawCard("special")}
              />
            </div>
          </div>
        </div>
      </div>
      {gameState.winby !== "" && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`text-center p-8 rounded-xl shadow-xl max-w-md ${
              gameState.winby === playerId
                ? "bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300"
                : "bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-300"
            }`}
          >
            {/* Battleline Logo */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Swords className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold tracking-tighter text-gray-900">
                BATTLE<span className="text-indigo-600">LINE</span>
              </h1>
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>

            <div
              className={`text-3xl font-bold mb-4 ${
                gameState.winby === playerId
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {gameState.winby === playerId ? "Victory!" : "Defeat"}
            </div>

            <p className="text-lg mb-6 text-gray-700">
              {gameState.winby === playerId
                ? "Congratulations on your win!"
                : "You can review the board to see what happened."}
            </p>

            <button
              className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition hover:shadow-lg ${
                gameState.winby === playerId
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }`}
              onClick={() => navigate("/")}
            >
              Return Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameBoard;
