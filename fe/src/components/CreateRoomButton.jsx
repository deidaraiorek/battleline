import { useState } from "react";
import { Loader2, Copy, Check } from "lucide-react";
import axios from "axios";

export function CreateRoomButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/room/create`);
      setRoomCode(data.id);
    } catch (error) {
      console.error("Failed to create room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
          isLoading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
        }`}
        onClick={handleCreateRoom}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Room"
        )}
      </button>

      {roomCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Room Created!
            </h2>
            <p className="text-gray-600 mb-6">
              Share this code with your friend to join the battle
            </p>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-4xl font-mono font-bold tracking-wider text-indigo-600 mb-6 bg-gray-50 px-8 py-4 rounded-lg">
                {roomCode}
              </div>

              <button
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <button
              className="w-full mt-4 text-gray-600 hover:text-gray-900 transition-colors duration-300"
              onClick={() => setRoomCode(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
