// src/pages/games/reaction-time.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

export default function ReactionTime() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();

  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("Pulsa 'Start' para comenzar.");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (authLoaded && !user) router.push("/login");
  }, [user, authLoaded, router]);

  const isLoading = !authLoaded;

  const startGame = () => {
    setGameStarted(true);
    setReactionTime(null);
    setMessage("Espera...");
    setWaiting(true);
    const delay = Math.random() * 3000 + 2000;
    setTimeout(() => {
      setMessage("¡CLICK AHORA!");
      setStartTime(Date.now());
      setWaiting(false);
    }, delay);
  };

  const handleClick = () => {
    if (!gameStarted) return;
    if (waiting) {
      setMessage("Muy pronto! Inténtalo nuevamente.");
      setGameStarted(false);
      setWaiting(false);
    } else if (startTime) {
      const reaction = Date.now() - startTime;
      setReactionTime(reaction);
      setMessage(`Tu tiempo de reacción es: ${reaction} ms`);
      setGameStarted(false);
    }
  };

  return isLoading ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-700 font-sans">
      <p className="text-white text-xl">Cargando...</p>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans" onClick={handleClick}>
      <BackButton />
      <Navbar />
      <header className="p-4">
        <h1 className="text-white text-3xl font-bold text-center">Tiempo de Reacción</h1>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/20 shadow-lg text-center">
          <p className="text-white text-xl mb-4">{message}</p>
          {!gameStarted && (
            <button
              onClick={startGame}
              className="bg-white text-purple-600 font-bold py-2 px-4 rounded hover:bg-gray-200 transition"
            >
              Start
            </button>
          )}
          {reactionTime && <p className="text-white mt-4">¡Inténtalo de nuevo!</p>}
        </div>
      </main>
      <footer className="p-4 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
