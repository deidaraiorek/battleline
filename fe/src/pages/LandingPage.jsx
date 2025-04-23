import { useState, useEffect } from "react";
import { Shield, Swords } from "lucide-react";
import { CreateRoomButton } from "../components/CreateRoomButton";
import { JoinRoomForm } from "../components/JoinRoomForm";

function LandingPage() {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/game\/([A-Z0-9]{6})/);
    if (match) {
      setRoomCode(match[1]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Swords className="h-10 w-10 text-indigo-600" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900">
            BATTLE<span className="text-indigo-600">LINE</span>
          </h1>
          <Shield className="h-10 w-10 text-indigo-600" />
        </div>

        {/* Hero section */}
        <div className="w-full max-w-4xl mx-auto text-center mb-16">
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Challenge your friends in the ultimate strategic battle game
          </p>
        </div>

        {/* Game options */}
        <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Create room card */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all shadow-lg hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Swords className="h-6 w-6 text-indigo-600" />
              Create Room
            </h2>
            <p className="text-gray-600 mb-6">
              Start a new battle and invite your friends to join using a unique
              room code.
            </p>
            <CreateRoomButton />
          </div>

          {/* Join room card */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all shadow-lg hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Shield className="h-6 w-6 text-indigo-600" />
              Join Room
            </h2>
            <p className="text-gray-600 mb-6">
              Enter a 6-character room code to join an existing battle.
            </p>
            <JoinRoomForm />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Battleline Game. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
