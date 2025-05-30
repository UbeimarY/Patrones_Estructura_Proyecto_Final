// src/pages/games/memory-game.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";
import { getGameByType, addMove, submitScore } from "../../utils/api";

type Difficulty = "4x4" | "6x6" | "8x8";

// Array completo de Emojis (puedes ajustar esta lista según lo requieras)
const emojis = [
  "🎯", "🌟", "💎", "🔥", "⚡", "🎪", "🎨", "🎭", "🌈", "🦄", "🔮", "💫",
  "🎊", "🎈", "🎀", "🎵", "🎸", "🎺", "🎲", "🎳", "🎮", "🌸", "🌺", "🌻",
  "🌷", "🌹", "🌼", "🌿", "🍄", "🎉", "🚀", "⭐",
];

// Configuración de dificultad: tamaño del grid, emoji representativo y descripción de la dificultad.
const difficultyConfig: Record<Difficulty, { size: number; emoji: string; description: string }> = {
  "4x4": { size: 4, emoji: emojis[0], description: "Principiante" },
  "6x6": { size: 6, emoji: emojis[1], description: "Intermedio" },
  "8x8": { size: 8, emoji: emojis[0], description: "Experto" },
};

// Función para generar el tablero de juego (mezcla de emojis por pares)
const generateBoard = (gridSize: number) => {
  const totalCards = gridSize * gridSize;
  const totalPairs = totalCards / 2;
  let selectedEmojis: string[] = [];
  if (gridSize === 4) {
    selectedEmojis = emojis.slice(0, 8);
  } else if (gridSize === 6) {
    selectedEmojis = emojis.slice(0, 18);
  } else {
    selectedEmojis = emojis.slice(0, 32);
  }
  const deck = Array.from({ length: totalPairs }, (_, i) => selectedEmojis[i % selectedEmojis.length])
    .flatMap((emoji) => [emoji, emoji]);
  // Mezcla el deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export default function MemoryGame() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();

  // Estados para gestionar dificultad, inicio de juego, tablero, movimientos y cronómetro...
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [matched, setMatched] = useState<boolean[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  // Estado para guardar el id de la sesión de juego (proporcionado por el backend)
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  // Si el usuario no está autenticado, redirige a login.
  useEffect(() => {
    if (authLoaded && !user) router.push("/login");
  }, [user, authLoaded, router]);

  // Control del cronómetro.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && gameStarted && !gameWon) {
      interval = setInterval(() => {
        setGameTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameStarted, gameWon]);

  // Inicia un nuevo juego y sincroniza la sesión con el backend.
  useEffect(() => {
    async function startGame() {
      if (selectedDifficulty && gameStarted) {
        const gridSize = difficultyConfig[selectedDifficulty].size;
        const newBoard = generateBoard(gridSize);
        setBoard(newBoard);
        setRevealed(Array(newBoard.length).fill(false));
        setMatched(Array(newBoard.length).fill(false));
        setMoves(0);
        setGameTime(0);
        setIsTimerRunning(true);
        setGameWon(false);
        // Llama al backend para crear o recuperar la sesión del juego de Memoria.
        try {
          // Aquí se castea la respuesta a un objeto que contiene al menos { id: string }
          const gameSession = (await getGameByType("memory")) as { id: string };
          setCurrentGameId(gameSession.id);
          console.log("Juego de memoria iniciado, session id:", gameSession.id);
        } catch (error) {
          console.error("Error creando la sesión de juego en el backend:", error);
        }
      }
    }
    startGame();
  }, [selectedDifficulty, gameStarted]);

  // Maneja el clic de una carta
  const handleCardClick = (index: number) => {
    if (!gameStarted || gameWon) return;
    if (revealed[index] || matched[index]) return;
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    // Obtiene los índices de cartas reveladas (que aún no se han emparejado)
    const revealedIndices = newRevealed
      .map((flag, i) => (flag && !matched[i] ? i : -1))
      .filter((i) => i !== -1);
    if (revealedIndices.length === 2) {
      setMoves((m) => m + 1);
      const [i1, i2] = revealedIndices;
      if (board[i1] === board[i2]) {
        const newMatched = [...matched];
        newMatched[i1] = true;
        newMatched[i2] = true;
        setMatched(newMatched);
        // Si se encuentra una pareja, registra el movimiento en el backend.
        if (currentGameId) {
          const moveInfo = JSON.stringify({ indices: [i1, i2], emoji: board[i1], type: "match" });
          addMove(currentGameId, moveInfo)
            .then(() => console.log("Movimiento registrado en backend"))
            .catch((err) => console.error("Error registrando movimiento:", err));
        }
        console.log("¡Pareja encontrada! 🎉");
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

  // Función para verificar si se han emparejado todas las cartas
  const checkVictory = () => board.length > 0 && matched.every((val) => val === true);

  // Al alcanzar la victoria, detiene el cronómetro y envía el puntaje al backend.
  useEffect(() => {
    async function verifyVictory() {
      if (checkVictory() && !gameWon) {
        setIsTimerRunning(false);
        setGameWon(true);
        console.log(`¡Victoria en ${moves} movimientos y ${formatTime(gameTime)}! 🏆`);
        if (currentGameId) {
          try {
            await submitScore(currentGameId, moves);
            console.log("Puntaje enviado al backend");
          } catch (err) {
            console.error("Error enviando puntaje:", err);
          }
        }
      }
    }
    verifyVictory();
  }, [matched, board, gameWon, moves, gameTime, currentGameId]);

  // Reinicia el juego
  const resetGame = () => {
    setGameStarted(false);
    setSelectedDifficulty(null);
    setIsTimerRunning(false);
    setGameWon(false);
    setCurrentGameId(null);
  };

  // Formatea el tiempo de juego (segundos) a formato MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress =
    board.length > 0 ? (matched.filter(Boolean).length / board.length) * 100 : 0;

  // Renderiza cada carta con el efecto flip
  const renderCard = (value: string, idx: number) => {
    const isRevealed = revealed[idx] || matched[idx];
    return (
      <div
        key={idx}
        onClick={() => handleCardClick(idx)}
        className="flip-card w-full aspect-square cursor-pointer"
      >
        <div
          className={`flip-card-inner transition-transform duration-700 ${
            isRevealed ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Carta frontal */}
          <div className="card-face card-front flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">🧠</span>
          </div>
          {/* Carta trasera */}
          <div className="card-face card-back flex items-center justify-center">
            <span className="text-2xl font-bold text-white animate-bounce">
              {value}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      <BackButton />
      <Navbar />
      <header className="p-6 text-center">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">🧠 Juego de Memoria</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {!gameStarted ? (
          // Pantalla de selección de dificultad
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 space-y-8 max-w-2xl w-full">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-white drop-shadow-md">
                ✨ Selecciona tu Desafío
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(["4x4", "6x6", "8x8"] as Difficulty[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedDifficulty(option)}
                    className={`h-24 text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedDifficulty === option
                        ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50"
                        : "bg-white/10 hover:bg-white/30 text-white border border-white/30 hover:border-white/50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">
                        {difficultyConfig[option].emoji}
                      </span>
                      <span className="text-xl">{option}</span>
                      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                        {difficultyConfig[option].description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {selectedDifficulty && (
              <button
                onClick={() => setGameStarted(true)}
                className="w-full bg-gradient-to-br from-green-400 to-cyan-500 text-white py-4 text-2xl rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                🎮 ¡Comenzar Juego!
              </button>
            )}
          </div>
        ) : (
          // Pantalla del juego
          <div className="space-y-8 w-full max-w-4xl mx-auto">
            {/* Panel de Estado */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 rounded-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <p className="text-lg font-bold text-white">
                    ⏱️ Tiempo:{" "}
                    <span className="text-cyan-300">{formatTime(gameTime)}</span>
                  </p>
                  <p className="text-lg font-bold text-white">
                    🎯 Movimientos:{" "}
                    <span className="text-cyan-300">{moves}</span>
                  </p>
                  <div className="text-center">
                    <span className="text-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl inline-block">
                      {difficultyConfig[selectedDifficulty!].emoji} {selectedDifficulty}
                    </span>
                  </div>
                </div>
                <div className="flex-grow max-w-md">
                  <p className="text-white/80 text-sm mb-2">Progreso</p>
                  <div className="h-3 rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-white/60 text-xs mt-1">
                    {Math.round(progress)}% completado
                  </p>
                </div>
              </div>
            </div>
            {/* Tablero de Juego */}
            <div className={`grid gap-3 p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20
              ${selectedDifficulty === "4x4"
                ? "grid-cols-4"
                : selectedDifficulty === "6x6"
                  ? "grid-cols-6"
                  : "grid-cols-8"
              }`}
            >
              {board.map((card, idx) => renderCard(card, idx))}
            </div>
            {/* Panel de Victoria */}
            {checkVictory() && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 shadow-2xl p-8 rounded-2xl space-y-6 animate-bounce">
                <div className="flex items-center justify-center gap-3">
                  <span className="w-12 h-12 text-yellow-400 animate-bounce">🏆</span>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    ¡VICTORIA!
                  </h2>
                  <span className="w-12 h-12 text-yellow-400 animate-bounce">🏆</span>
                </div>
                <p className="text-2xl text-white/90 text-center">
                  Completado en {moves} movimientos y {formatTime(gameTime)}.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    🔄 Nuevo Juego
                  </button>
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
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
      <style jsx global>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

// Función auxiliar para verificar si se ha logrado la victoria.
// En este ejemplo, se retorna false para efectos de desarrollo; se debe implementar la verificación real.
function checkVictory() {
  return false;
}
