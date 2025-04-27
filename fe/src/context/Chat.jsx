import React, { useState } from "react";
import chat_icon from "../chat-icon.png";
import { useWebSocket } from "./WebsocketContext";

const Chat = () => {
  const { chatMessages, sendChatMessage } = useWebSocket();
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      sendChatMessage(input);
      setInput("");
    }
  };

  const closeModal = () => setShowChat(false);

  return (
    <>
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed top-14 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-end justify-end"
        aria-label="Game Chat"
      >
        <img
          src={chat_icon}
          alt="Chat Icon"
          className="w-6 h-6"
        />
      </button>

      {showChat && (
        <div className="fixed bottom-16 right-4 z-50 w-80 bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Game Chat</h2>
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
          <div className="space-y-4 overflow-y-auto max-h-48 mb-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className="p-3 bg-gray-200 rounded-md text-gray-800">
                <span className="font-bold">{msg.playerId}: </span>
                {msg.message}
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mr-2"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat; 