import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Chess, Square, Move } from 'chess.js';

const pieceUnicode: Record<string, string> = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
  P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔",
};

export default function ChessGame() {
  const { user } = useAppContext();
  const router = useRouter();

  const [game, setGame] = useState(new Chess());
  const [selected, setSelected] = useState<Square | null>(null);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  useEffect(() => {
    if (turn === 'b' && !game.isGameOver()) {
      setTimeout(makeBotMove, 500);
    }
  }, [turn]);

  const resetGame = (newLevel: 'easy' | 'medium' | 'hard') => {
    const newGame = new Chess();
    setGame(newGame);
    setSelected(null);
    setTurn('w');
    setLevel(newLevel);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setStatus(null);
  };

  const makeBotMove = () => {
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return;

    let move: Move;

    if (level === 'easy') {
      move = moves[Math.floor(Math.random() * moves.length)];
    } else if (level === 'medium') {
      const captures = moves.filter(m => m.captured);
      move = captures.length > 0 ? captures[Math.floor(Math.random() * captures.length)] : moves[Math.floor(Math.random() * moves.length)];
    } else {
      const valueMap: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
      moves.sort((a, b) => {
        const aVal = a.captured ? valueMap[a.captured.toLowerCase()] : 0;
        const bVal = b.captured ? valueMap[b.captured.toLowerCase()] : 0;
        return bVal - aVal;
      });
      move = moves[0];
    }

    if (move?.captured) {
      setCapturedWhite(prev => [...prev, move.captured as string]);
    }

    game.move(move);
    setGame(new Chess(game.fen()));
    updateGameState();
  };

  const updateGameState = () => {
    if (game.isCheckmate()) {
      setStatus(game.turn() === 'w' ? '¡Has perdido! Jaque mate.' : '¡Has ganado! Jaque mate.');
    } else if (game.isDraw()) {
      setStatus('Empate. No hay más movimientos válidos.');
    }
    setTurn(game.turn());
  };

  const handleCellClick = (square: string) => {
    if (turn !== 'w' || game.isGameOver()) return;

    const piece = game.get(square as Square);
    if (selected && square !== selected) {
      const movingPiece = selected ? game.get(selected as Square) : null;
      let move: Move | null = null;

      try {
        if (movingPiece?.type === 'p' && (square[1] === '8' || square[1] === '1')) {
          move = game.move({ from: selected, to: square as Square, promotion: 'q' });
        } else {
          move = game.move({ from: selected, to: square as Square });
        }

        if (move && move.captured) {
          setCapturedBlack(prev => [...prev, move!.captured as string]);
        }

        if (move) {
          setGame(new Chess(game.fen()));
          setSelected(null);
          updateGameState();
        } else {
          setSelected(null);
        }
      } catch (err) {
        console.warn("Movimiento inválido:", err);
        setSelected(null);
      }

    } else {
      if (piece && piece.color === 'w') {
        setSelected(square as Square);
      }
    }
  };

  const renderBoard = () => {
    const board = game.board();
    return (
      <div className="grid grid-cols-8 grid-rows-8 border border-white" ref={boardRef}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const square = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selected === square;
            return (
              <div
                key={square}
                onClick={() => handleCellClick(square)}
                className={`w-16 h-16 flex items-center justify-center cursor-pointer border 
                ${isDark ? 'bg-gray-600' : 'bg-gray-300'}
                ${isSelected ? 'ring-4 ring-yellow-400' : ''}`}
              >
                <span className="text-2xl">
                  {cell ? pieceUnicode[cell.color === 'w' ? cell.type.toUpperCase() : cell.type] : ""}
                </span>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderCaptured = (pieces: string[]) => (
    <div className="flex flex-wrap gap-1 p-2 bg-white/10 border rounded w-32 justify-center">
      {pieces.map((p, i) => (
        <span key={i} className="text-xl animate-pulse">{pieceUnicode[p]}</span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
      <header className="p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <a href="/" className="text-2xl hover:underline">←</a>
          <h1 className="text-3xl font-bold">Cognitive Training</h1>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/" className="hover:underline">Inicio</a>
          <button className="hover:underline">Cerrar Sesión</button>
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
            <span>👤</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center gap-4 py-4">
        <h2 className="text-white text-2xl">Ajedrez</h2>

        <div className="mb-2">
          <label className="text-white mr-2">Dificultad:</label>
          <select
            className="rounded px-2 py-1"
            value={level}
            onChange={(e) => resetGame(e.target.value as 'easy' | 'medium' | 'hard')}
          >
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        {status && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded border border-red-400 mt-2">
            {status}
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <p className="text-white mb-1">Capturadas (por ti)</p>
            {renderCaptured(capturedBlack)}
          </div>
          {renderBoard()}
          <div className="flex flex-col items-center">
            <p className="text-white mb-1">Capturadas (por bot)</p>
            {renderCaptured(capturedWhite)}
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-white text-sm">
        © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
      </footer>
    </div>
  );
}
