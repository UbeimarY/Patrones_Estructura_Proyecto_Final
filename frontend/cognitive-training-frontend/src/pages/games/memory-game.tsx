// src/pages/games/memory-game.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

const generateBoard = () => {
  const pairs = [1, 2, 3, 4, 5, 6, 7, 8];
  const deck = [...pairs, ...pairs];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export default function MemoryGame() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();

  const [board, setBoard] = useState<number[]>(generateBoard());
  const [revealed, setRevealed] = useState<boolean[]>(Array(board.length).fill(false));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [matched, setMatched] = useState<boolean[]>(Array(board.length).fill(false));

  useEffect(() => {
    if (authLoaded && !user) router.push("/login");
  }, [user, authLoaded, router]);

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const [first, second] = selectedIndices;
      if (board[first] === board[second]) {
        const newMatched = [...matched];
        newMatched[first] = true;
        newMatched[second] = true;
        setMatched(newMatched);
        setSelectedIndices([]);
      } else {
        setTimeout(() => {
          const newRevealed = [...revealed];
          newRevealed[first] = false;
          newRevealed[second] = false;
          setRevealed(newRevealed);
          setSelectedIndices([]);
        }, 1000);
      }
    }
  }, [selectedIndices, board, matched, revealed]);

  const isLoading = !authLoaded;

  const handleCardClick = (index: number) => {
    if (revealed[index] || matched[index] || selectedIndices.length === 2) return;
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    setSelectedIndices([...selectedIndices, index]);
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
        <h1 className="text-white text-3xl font-bold text-center">Juego de Memoria</h1>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-4 gap-2">
          {board.map((value, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              className="w-20 h-20 flex items-center justify-center bg-purple-300 text-white text-2xl font-bold border border-gray-300 cursor-pointer hover:bg-purple-400 transition"
            >
              {(revealed[idx] || matched[idx]) ? value : "?"}
            </div>
          ))}
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
