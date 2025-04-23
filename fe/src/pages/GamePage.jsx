import React from "react";
import { useParams } from "react-router-dom";
import { WebSocketProvider } from "../context/WebsocketContext";
import GameBoard from "./GameBoard";

function GamePage() {
  const { roomId } = useParams();

  return (
    <WebSocketProvider roomId={roomId}>
      <GameBoard />
    </WebSocketProvider>
  );
}

export default GamePage;
