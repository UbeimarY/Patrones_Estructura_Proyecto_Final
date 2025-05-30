// src/pages/games/sliding-puzzle.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

type GameMode = '3x3' | '4x4' | '5x5';
type Level = 1 | 2 | 3 | 4 | 5 | 'Sin Fin';
type GameType = 'normal' | 'endless';

const modeConfig = {
  '3x3': { size: 3, movesMultiplier: 10 },
  '4x4': { size: 4, movesMultiplier: 15 },
  '5x5': { size: 5, movesMultiplier: 20 }
};

const generateSolvablePuzzle = (gridSize: number) => {
  const totalTiles = gridSize * gridSize;
  const numbers = Array.from({ length: totalTiles }, (_, i) => i === totalTiles - 1 ? 0 : i + 1);
  let inversions = 0;
  let blankRow = 0;
  
  do {
    // Fisher-Yates shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    inversions = 0;
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[i] > numbers[j] && numbers[i] !== 0 && numbers[j] !== 0) {
          inversions++;
        }
      }
    }
    
    blankRow = gridSize - Math.floor(numbers.indexOf(0) / gridSize);
  } while (
    (gridSize % 2 === 1 && inversions % 2 !== 0) ||
    (gridSize % 2 === 0 && (inversions + blankRow) % 2 !== 1)
  );
  
  return numbers;
};

export default function SlidingPuzzle() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();
  const [board, setBoard] = useState<number[]>([]);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [moveLimit, setMoveLimit] = useState<number | null>(null);
  const [victoryPoints, setVictoryPoints] = useState(0);

  // Efecto corregido: Manejo seguro de selectedLevel
  useEffect(() => {
    if (selectedMode && selectedGameType) {
      const gridSize = modeConfig[selectedMode].size;
      setBoard(generateSolvablePuzzle(gridSize));
      setMoves(0);
      
      if (selectedGameType === 'normal') {
        // Verificar que selectedLevel es un número
        if (selectedLevel !== null && typeof selectedLevel === 'number') {
          const limit = selectedLevel * modeConfig[selectedMode].movesMultiplier;
          setMoveLimit(limit);
          setVictoryPoints(selectedLevel * 100);
        } else {
          // Valor por defecto si selectedLevel es null o 'Sin Fin'
          const defaultLevel = 1;
          const limit = defaultLevel * modeConfig[selectedMode].movesMultiplier;
          setMoveLimit(limit);
          setVictoryPoints(defaultLevel * 100);
        }
      } else {
        // Modo sin fin
        setMoveLimit(null);
        setVictoryPoints(modeConfig[selectedMode].size * 50);
      }
    }
  }, [selectedMode, selectedLevel, selectedGameType]);

  useEffect(() => {
    if (authLoaded && !user) {
      router.push("/login");
    }
  }, [user, authLoaded, router]);

  const isLoading = !authLoaded || (authLoaded && !user);

  const getPosition = (index: number) => ({
    row: Math.floor(index / (selectedMode ? modeConfig[selectedMode].size : 3)),
    col: index % (selectedMode ? modeConfig[selectedMode].size : 3),
  });

  const handleTileClick = (index: number) => {
    if (!selectedMode || !gameStarted) return;
    
    const gridSize = modeConfig[selectedMode].size;
    const blankIndex = board.indexOf(0);
    const { row: targetRow, col: targetCol } = getPosition(index);
    const { row: blankRow, col: blankCol } = getPosition(blankIndex);

    if (
      (targetRow === blankRow && Math.abs(targetCol - blankCol) === 1) ||
      (targetCol === blankCol && Math.abs(targetRow - blankRow) === 1)
    ) {
      const newBoard = [...board];
      [newBoard[index], newBoard[blankIndex]] = [newBoard[blankIndex], newBoard[index]];
      setBoard(newBoard);
      setMoves(m => m + 1);
    }
  };

  const checkVictory = () => {
    if (!selectedMode) return false;
    const gridSize = modeConfig[selectedMode].size;
    const solution = Array.from({ length: gridSize * gridSize }, (_, i) => 
      i === gridSize * gridSize - 1 ? 0 : i + 1
    );
    return board.every((num, i) => num === solution[i]);
  };

  const renderTile = (tile: number, idx: number) => {
    const sizeClass = selectedMode ? 
      `w-24 h-24 text-3xl` : 
      `w-32 h-32 text-4xl`;

    return tile === 0 ? (
      <div 
        key={idx} 
        className={`${sizeClass} bg-gray-100/30 border-2 border-gray-300/50 rounded-xl shadow-lg backdrop-blur-sm`} 
      />
    ) : (
      <div
        key={idx}
        onClick={() => handleTileClick(idx)}
        className={`${sizeClass} bg-gradient-to-br from-purple-400 to-blue-400 text-white 
          font-bold border-2 border-white/20 rounded-xl shadow-xl cursor-pointer 
          hover:scale-105 transition-all duration-200 flex items-center justify-center
          hover:from-purple-500 hover:to-blue-500 active:scale-95`}
      >
        {tile}
      </div>
    );
  };

  const resetGame = () => {
    if (selectedMode && selectedGameType) {
      const gridSize = modeConfig[selectedMode].size;
      setBoard(generateSolvablePuzzle(gridSize));
      setMoves(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-800">
        <p className="text-white text-2xl">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-800 flex flex-col">
      <BackButton />
      <Navbar />
      
      <header className="p-6">
        <h1 className="text-white text-4xl font-bold text-center drop-shadow-lg">
          🧩 Rompecabezas Deslizante
        </h1>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl space-y-8 border-2 border-white/20 max-w-4xl w-full">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center text-white drop-shadow-md">
                ⚙️ Selecciona Tipo de Juego
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setSelectedGameType('normal')}
                  className={`px-8 py-6 rounded-xl text-2xl font-semibold transition-all
                    ${selectedGameType === 'normal' 
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white/20 hover:bg-white/30 text-white/80 hover:text-white'}`}
                >
                  Modo Normal
                  <p className="text-base mt-2 font-normal">Con límite de movimientos</p>
                </button>
                <button
                  onClick={() => setSelectedGameType('endless')}
                  className={`px-8 py-6 rounded-xl text-2xl font-semibold transition-all
                    ${selectedGameType === 'endless' 
                      ? 'bg-gradient-to-br from-green-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-white/20 hover:bg-white/30 text-white/80 hover:text-white'}`}
                >
                  Modo Sin Fin
                  <p className="text-base mt-2 font-normal">Sin límite de movimientos</p>
                </button>
              </div>
            </div>

            {selectedGameType && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-white drop-shadow-md">
                  🧩 Elige Tamaño del Tablero
                </h2>
                <div className="grid grid-cols-3 gap-6">
                  {(['3x3', '4x4', '5x5'] as GameMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`px-8 py-6 rounded-xl text-2xl font-semibold transition-all
                        ${selectedMode === mode 
                          ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg'
                          : 'bg-white/20 hover:bg-white/30 text-white/80 hover:text-white'}`}
                    >
                      {mode}
                      <p className="text-base mt-2 font-normal">
                        {mode === '3x3' ? 'Fácil' : mode === '4x4' ? 'Medio' : 'Difícil'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedGameType === 'normal' && selectedMode && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-white drop-shadow-md">
                  🚀 Elige Nivel
                </h2>
                <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level as Level)}
                      className={`aspect-square flex items-center justify-center text-2xl 
                        rounded-xl transition-all ${selectedLevel === level 
                          ? 'bg-gradient-to-br from-green-400 to-cyan-400 text-white shadow-lg'
                          : 'bg-white/20 hover:bg-white/30 text-white/80 hover:text-white'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedGameType === 'endless' && selectedMode && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-white drop-shadow-md">
                  🌟 Modo Sin Fin
                </h2>
                <div className="bg-blue-500/20 p-4 rounded-xl text-center">
                  <p className="text-xl text-white">
                    ¡Sin límite de movimientos! Tómate tu tiempo para resolver el puzzle.
                  </p>
                  <p className="text-lg text-cyan-200 mt-2">
                    Puntos por victoria: {victoryPoints}
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedLevel('Sin Fin')}
                    className={`px-8 py-4 rounded-xl text-xl font-semibold transition-all
                      ${selectedLevel === 'Sin Fin' 
                        ? 'bg-gradient-to-br from-green-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-white/20 hover:bg-white/30 text-white/80 hover:text-white'}`}
                  >
                    Seleccionar Modo Sin Fin
                  </button>
                </div>
              </div>
            )}

            {selectedMode && selectedGameType && (selectedGameType === 'endless' || selectedLevel) && (
              <button
                onClick={() => setGameStarted(true)}
                className="w-full bg-gradient-to-br from-green-400 to-cyan-500 text-white 
                  py-4 text-2xl rounded-xl hover:scale-105 transition-all 
                  shadow-lg hover:shadow-xl active:scale-95"
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
                {moveLimit !== null && `/${moveLimit}`}
              </p>
              <p className="text-xl text-white/80">
                {selectedGameType === 'endless' ? 'Modo Sin Fin' : `Nivel: ${selectedLevel}`} - Tamaño: {selectedMode}
              </p>
              {selectedGameType === 'endless' && (
                <p className="text-lg text-green-300">
                  Puntos por victoria: {victoryPoints}
                </p>
              )}
            </div>
            
            <div className="flex justify-center">
              <div className={`grid gap-3 ${selectedMode === '3x3' ? 'grid-cols-3' :
                selectedMode === '4x4' ? 'grid-cols-4' : 'grid-cols-5'} 
                p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-white/20`}>
                {board.map((tile, idx) => renderTile(tile, idx))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="bg-gradient-to-br from-purple-500 to-blue-500 text-white 
                  px-8 py-3 text-xl rounded-xl hover:scale-105 transition-all 
                  shadow-lg flex items-center gap-2"
              >
                🔄 Reiniciar Tablero
              </button>
              <button
                onClick={() => {
                  setGameStarted(false);
                  setSelectedMode(null);
                  setSelectedLevel(null);
                  setSelectedGameType(null);
                }}
                className="bg-gradient-to-br from-gray-500 to-gray-700 text-white 
                  px-8 py-3 text-xl rounded-xl hover:scale-105 transition-all 
                  shadow-lg flex items-center gap-2"
              >
                🏠 Menú Principal
              </button>
            </div>

            {(checkVictory() || (moveLimit !== null && moves >= moveLimit)) && (
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center 
                border-2 border-white/20 shadow-2xl space-y-6 mt-6">
                <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
                  {checkVictory() ? (
                    <>
                      🏆 ¡Victoria! <span className="text-green-400">+{victoryPoints} Puntos</span>
                    </>
                  ) : (
                    <>
                      💥 ¡Inténtalo de nuevo! <span className="text-red-400">-0 Puntos</span>
                    </>
                  )}
                </h2>
                <p className="text-2xl text-white/90">
                  {checkVictory() 
                    ? `Completado en ${moves} movimientos`
                    : `Superaste el límite de ${moveLimit} movimientos`}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setGameStarted(false);
                      setSelectedLevel(null);
                    }}
                    className="bg-gradient-to-br from-purple-500 to-blue-500 text-white 
                      px-8 py-3 text-xl rounded-xl hover:scale-105 transition-all 
                      shadow-lg flex items-center gap-2"
                  >
                    🔄 Jugar Otra Vez
                  </button>
                  <button
                    onClick={() => {
                      setGameStarted(false);
                      setSelectedMode(null);
                      setSelectedLevel(null);
                      setSelectedGameType(null);
                    }}
                    className="bg-gradient-to-br from-gray-500 to-gray-700 text-white 
                      px-8 py-3 text-xl rounded-xl hover:scale-105 transition-all 
                      shadow-lg flex items-center gap-2"
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