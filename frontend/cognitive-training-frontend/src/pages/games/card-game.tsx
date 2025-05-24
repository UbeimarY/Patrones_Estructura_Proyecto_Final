// src/pages/games/card-game.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

const deck = [
  "A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠",
  "9♠", "10♠", "J♠", "Q♠", "K♠",
  "A♥", "2♥", "3♥", "4♥", "5♥", "6♥", "7♥", "8♥",
  "9♥", "10♥", "J♥", "Q♥", "K♥"
];

export default function CardGame() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (authLoaded && !user) router.push("/login");
  }, [user, authLoaded, router]);

  const [currentCard, setCurrentCard] = useState<string | null>(null);
  const isLoading = !authLoaded;

  const drawCard = () => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    setCurrentCard(deck[randomIndex]);
  };

  return isLoading ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-700 font-sans">
      <p className="text-white text-xl">Cargando...</p>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
      <BackButton />
      <Navbar />
      <header className="p-4">
        <h1 className="text-white text-3xl font-bold text-center">Juego de Cartas</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/20 shadow-lg text-center">
          <p className="text-white text-xl mb-4">Pulsa el botón para sacar una carta.</p>
          <button
            onClick={drawCard}
            className="bg-white text-purple-600 font-bold py-2 px-4 rounded hover:bg-gray-200 transition"
          >
            Sacar Carta
          </button>
          {currentCard && (
            <div className="mt-4">
              <p className="text-white text-2xl">Carta: {currentCard}</p>
            </div>
          )}
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
