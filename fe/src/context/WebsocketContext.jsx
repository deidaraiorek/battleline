import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children, roomId }) {
  const [playerId, setPlayerId] = useState(() => {
    return localStorage.getItem(`player_${roomId}`) || null;
  });
  const [gameState, setGameState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const reconnectTimeoutRef = useRef(null);

  const socketRef = useRef(null);

  const sendMessage = (type, payload) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type,
          payload,
        })
      );
    } else {
      console.error("WebSocket is not connected");
    }
  };

  const connect = () => {
    if (!roomId) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/^http/, "ws");
    const connectionUrl = playerId
      ? `${backendUrl}/room/${roomId}?playerId=${playerId}`
      : `${backendUrl}/room/${roomId}`;
    if (socketRef.current) {
      socketRef.current.close();
    }
    const socket = new WebSocket(connectionUrl);
    socketRef.current = socket;

    socket.addEventListener("open", (event) => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
      setReconnectAttempts(0);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    });

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      console.log("Message from server:", message);

      switch (message.type) {
        case "connected":
          setPlayerId(message.payload.playerId);
          localStorage.setItem(`player_${roomId}`, message.payload.playerId);
          break;
        case "gamestate":
          setGameState(message.payload);
          break;
        case "error":
          setError(message.payload.message);
          break;
        case "notice":
          setNotification({
            type: "specialCard",
            cardName: message.payload.cardName,
            cardDescription: message.payload.cardDescription,
          });

        default:
      }
    });

    socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
      console.error("Error code:", event.code, "Reason:", event.reason);

      setError("Connection error occurred");
    });

    socket.addEventListener("close", (event) => {
      console.log("Connection closed:", event.code, event.reason);
      setIsConnected(false);

      if (event.code !== 1000 && event.code !== 1001) {
        if (reconnectAttempts < 5) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts), 3000);
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, timeout);
        } else {
          setError("Connection lost. Please refresh the page.");
        }
      }
    });

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  };

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [roomId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        playerId,
        gameState,
        error,
        sendMessage,
        notification,
        clearNotification: () => setNotification(null),
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === null) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
