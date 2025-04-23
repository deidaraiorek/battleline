import { useState } from "react";
import { Loader2 } from "lucide-react";

export function JoinRoomForm() {
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (roomCode.length !== 6) {
      setError("Room code must be 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      window.location.href = `/game/${roomCode}/`;
    } catch (error) {
      console.error("Failed to join room:", error);
      setError("Failed to join room. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Enter 6-character code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="w-full px-4 py-3 text-center text-lg tracking-wider bg-white border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors duration-300"
          maxLength={6}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <button
        type="submit"
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
          isLoading || roomCode.length !== 6
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
        }`}
        disabled={isLoading || roomCode.length !== 6}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Join Battle"
        )}
      </button>
    </form>
  );
}
