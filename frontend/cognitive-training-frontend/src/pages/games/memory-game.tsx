// src/pages/games/memory-game.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";

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
  const { user } = useAppContext();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const [board, setBoard] = useState<number[]>(generateBoard());
  const [revealed, setRevealed] = useState<boolean[]>(Array(board.length).fill(false));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [matched, setMatched] = useState<boolean[]>(Array(board.length).fill(false));
  const [failures, setFailures] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bestRecord, setBestRecord] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const [first, second] = selectedIndices;
      if (board[first] === board[second]) {
        const newMatched = [...matched];
        newMatched[first] = true;
        newMatched[second] = true;
        setMatched(newMatched);
      } else {
        setFailures(failures + 1);
        setTimeout(() => {
          const newRevealed = [...revealed];
          newRevealed[first] = false;
          newRevealed[second] = false;
          setRevealed(newRevealed);
        }, 1000);
      }
      setSelectedIndices([]);
    }
    if (matched.every((m) => m)) {
      setFinished(true);
      if (bestRecord === null || failures < bestRecord) {
        setBestRecord(failures);
      }
    }
  }, [selectedIndices, board, matched, revealed, failures, bestRecord]);

  const handleCardClick = (index: number) => {
    if (revealed[index] || matched[index] || selectedIndices.length === 2) return;
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    setSelectedIndices([...selectedIndices, index]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
      {/* Manteniendo el encabezado sin cambios */}
      <header className="flex justify-between items-center p-4 bg-purple-700 text-white shadow-md">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-full bg-white text-purple-700 hover:bg-gray-200 hover:scale-110 transition flex items-center justify-center"
        >
          ⬅
        </button>
        <h1 className="text-xl font-bold text-center flex-1">Cognitive Training</h1>
        <nav className="flex space-x-4">
          <button onClick={() => router.push("/")} className="text-white hover:underline">Inicio</button>
          <button onClick={() => router.push("/logout")} className="text-white hover:underline">Cerrar Sesión</button>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/20 shadow-lg text-center">
          {!finished ? (
            <>
              <h2 className="text-white text-2xl mb-4">Encuentra los pares</h2>
              <p className="text-white mb-2">Intentos fallidos: {failures}</p>
              <div className="grid grid-cols-4 gap-2">
                {board.map((value, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCardClick(idx)}
                    className="w-20 h-20 flex items-center justify-center bg-purple-300 text-white text-2xl font-bold border border-gray-300 cursor-pointer hover:bg-purple-400 transition"
                  >
                    {revealed[idx] || matched[idx] ? value : "?"}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white text-2xl mb-4">Juego terminado</h2>
              <p className="text-white text-xl mb-2">Intentos fallidos: {failures}</p>
              <p className="text-white text-xl mb-2">Tu récord ha sido: {Math.max(100 - failures, 0)}</p>
              <p className="text-white text-lg">¡Se puede seguir mejorando el récord! Sigue practicando.</p>
            </>
          )}
        </div>
      </main>

      <footer className="p-4 text-center">
        <p className="text-white text-sm">© {new Date().getFullYear()} Cognitive Training App. All rights reserved.</p>
      </footer>
    </div>
  );
}

