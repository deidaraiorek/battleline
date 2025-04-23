import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";
import FloatingGuideButton from "./components/FloatingGuideButton"; // Import the guide button
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-mid" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game/:roomId" element={<GamePage />} />
      </Routes>
      <FloatingGuideButton />
    </BrowserRouter>
  );
}

export default App;
