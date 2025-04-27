import React from "react";
import { useParams } from "react-router-dom";
import { WebSocketProvider } from "../context/WebsocketContext";
import GameBoard from "./GameBoard";
import Chat from "../context/Chat";
import FloatingGuideButton from "../components/FloatingGuideButton";

function GamePage() {
  const { roomId } = useParams();

  return (
    <WebSocketProvider roomId={roomId}>
      <GameBoard />
      <Chat />
      <FloatingGuideButton />
    </WebSocketProvider>
  );
}

export default GamePage;
