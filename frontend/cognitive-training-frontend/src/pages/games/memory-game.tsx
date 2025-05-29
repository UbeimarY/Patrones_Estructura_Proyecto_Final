import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

type Difficulty = "4x4" | "6x6" | "8x8";

const difficultyConfig: Record<Difficulty, { size: number }> = {
  "4x4": { size: 4 },
  "6x6": { size: 6 },
  "8x8": { size: 8 }
};

const generateBoard = (gridSize: number) => {
  const totalCards = gridSize * gridSize;
  const totalPairs = totalCards / 2;
  const deck = Array.from({ length: totalPairs }, (_, i) => i + 1)
                .flatMap(num => [num, num]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export default function MemoryGame() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [matched, setMatched] = useState<boolean[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (authLoaded && !user) router.push("/login");
  }, [user, authLoaded, router]);

  useEffect(() => {
    if (selectedDifficulty && gameStarted) {
      const gridSize = difficultyConfig[selectedDifficulty].size;
      const newBoard = generateBoard(gridSize);
      setBoard(newBoard);
      setRevealed(Array(newBoard.length).fill(false));
      setMatched(Array(newBoard.length).fill(false));
      setMoves(0);
    }
  }, [selectedDifficulty, gameStarted]);

  const isLoading = !authLoaded;

  const handleCardClick = (index: number) => {
    if (!gameStarted) return;
    if (revealed[index] || matched[index]) return;
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    const revealedIndices = newRevealed
      .map((flag, i) => (flag && !matched[i] ? i : -1))
      .filter(i => i !== -1);

    if (revealedIndices.length === 2) {
      setMoves(m => m + 1);
      const [i1, i2] = revealedIndices;
      if (board[i1] === board[i2]) {
        const newMatched = [...matched];
        newMatched[i1] = true;
        newMatched[i2] = true;
        setMatched(newMatched);
      } else {
        setTimeout(() => {
          const tempRevealed = [...revealed];
          tempRevealed[i1] = false;
          tempRevealed[i2] = false;
          setRevealed(tempRevealed);
        }, 1000);
      }
    }
  };

  const checkVictory = () => {
    return board.length > 0 && matched.every(val => val === true);
  };

  // Renderiza cada carta con animación de flip.
  const renderCard = (value: number, idx: number, gridSize: number) => {
    return (
      <div
        key={idx}
        onClick={() => handleCardClick(idx)}
        className="flip-card w-20 h-20 md:w-24 md:h-24"
      >
        <div className={`flip-card-inner ${revealed[idx] || matched[idx] ? "flipped" : ""}`}>
          <div className="flip-card-front flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">?</span>
          </div>
          <div className="flip-card-back flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{value}</span>
          </div>
        </div>
        <style jsx>{`
          .flip-card {
            perspective: 1000px;
            cursor: pointer;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          .flipped {
            transform: rotateY(180deg);
          }
          .flip-card-front,
          .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .flip-card-front {
            background-color: #f3f4f6;
          }
          .flip-card-back {
            background-color: #a78bfa;
            transform: rotateY(180deg);
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-blue-800 flex flex-col">
      <BackButton />
      <Navbar />
      <header className="p-6">
        <h1 className="text-white text-4xl font-bold text-center drop-shadow-lg">
          🧠 Juego de Memoria
        </h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl space-y-8 border-2 border-white/20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center text-white drop-shadow-md">
                ✨ Selecciona Dificultad
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {(["4x4", "6x6", "8x8"] as Difficulty[]).map(option => (
                  <button
                    key={option}
                    onClick={() => setSelectedDifficulty(option)}
                    className={`px-8 py-6 rounded-xl text-2xl font-semibold transition-all
                      ${selectedDifficulty === option
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white/20 hover:bg-white/30 text-white/80 hover:text-white'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {selectedDifficulty && (
              <button
                onClick={() => setGameStarted(true)}
                className="w-full bg-gradient-to-br from-green-400 to-cyan-500 text-white py-4 text-2xl rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                🎮 Comenzar Juego
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8 w-full max-w-4xl">
            <div className="text-center text-white space-y-2">
              <p className="text-2xl font-semibold drop-shadow-md">
                Movimientos: <span className="text-cyan-300">{moves}</span>
              </p>
              <p className="text-xl text-white/80">
                Dificultad: {selectedDifficulty}
              </p>
            </div>
            <div
              className={`grid gap-3 ${
                selectedDifficulty === "4x4" ? "grid-cols-4" :
                selectedDifficulty === "6x6" ? "grid-cols-6" : "grid-cols-8"
              } p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-white/20`}
            >
              {board.map((card, idx) =>
                renderCard(card, idx, difficultyConfig[selectedDifficulty!].size)
              )}
            </div>
            {checkVictory() && (
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center border-2 border-white/20 shadow-2xl space-y-6">
                <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
                  🏆 ¡Victoria! <span className="text-green-400">+100 Puntos</span>
                </h2>
                <p className="text-2xl text-white/90">
                  Completado en {moves} movimientos
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setGameStarted(false);
                      setSelectedDifficulty(null);
                    }}
                    className="bg-gradient-to-br from-purple-500 to-blue-500 text-white px-8 py-3 text-xl rounded-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                  >
                    🔄 Reiniciar
                  </button>
                  <button
                    onClick={() => {
                      setGameStarted(false);
                      setSelectedDifficulty(null);
                    }}
                    className="bg-gradient-to-br from-gray-500 to-gray-700 text-white px-8 py-3 text-xl rounded-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                  >
                    🏠 Menú Principal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="p-4 text-center text-white/80 text-sm">
        © {new Date().getFullYear()} Cognitive Training App. Todos los derechos reservados.
      </footer>
    </div>
  );
}
