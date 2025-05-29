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
      <div className="relative bg-amber-800 p-4 rounded-xl shadow-2xl border-8 border-amber-900">
        <div className="grid grid-cols-8 grid-rows-8 border-2 border-gray-800">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const square = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
              const isDark = (rowIndex + colIndex) % 2 === 1;
              const isSelected = selected === square;
              const kingPosition = game.board().flat().find(p => p?.type === 'k' && p.color === game.turn())?.square;
              const isCheck = kingPosition === square && game.isCheck();
              const isValidMove = game.moves({ square: square as Square }).length > 0;
              
              return (
                <div
                  key={square}
                  onClick={() => handleCellClick(square)}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer
                    ${isDark ? 'bg-amber-700' : 'bg-amber-100'}
                    ${isSelected ? 'ring-4 ring-yellow-400 z-10' : ''}
                    ${isCheck ? 'bg-red-500 animate-pulse' : ''}
                    ${isValidMove && !cell ? 'hover:bg-opacity-80' : ''}
                    transition-all duration-150 ease-in-out`}
                >
                  {/* Coordenadas de tablero */}
                  {colIndex === 0 && (
                    <div className="absolute top-1 left-1 text-xs font-bold text-gray-800">
                      {8 - rowIndex}
                    </div>
                  )}
                  {rowIndex === 7 && (
                    <div className="absolute bottom-1 right-1 text-xs font-bold text-gray-800">
                      {String.fromCharCode(97 + colIndex)}
                    </div>
                  )}
                  
                  {/* Indicador de movimiento válido */}
                  {!cell && isValidMove && (
                    <div className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 bg-opacity-60"></div>
                  )}
                  
                  {/* Pieza */}
                  {cell && (
                    <span 
                      className={`text-2xl sm:text-3xl drop-shadow-lg transition-transform duration-150 ${
                        cell.color === 'w' ? 'text-white' : 'text-gray-900'
                      }`}
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      {pieceUnicode[cell.color === 'w' ? cell.type.toUpperCase() : cell.type]}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderCaptured = (pieces: string[], color: 'white' | 'black') => (
    <div className={`flex flex-wrap gap-1 p-2 rounded-lg w-32 justify-center ${color === 'white' ? 'bg-black/20' : 'bg-white/20'}`}>
      {pieces.map((p, i) => (
        <span 
          key={i} 
          className={`text-xl sm:text-2xl transition-all duration-300 hover:scale-125 ${
            p === p.toUpperCase() ? 'text-white' : 'text-gray-900'
          }`}
        >
          {pieceUnicode[p]}
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 flex flex-col font-sans">
      <header className="p-4 flex justify-between items-center text-white bg-black/30">
        <div className="flex items-center gap-4">
          <a href="/" className="text-2xl hover:underline hover:text-blue-300 transition-colors">←</a>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Cognitive Training
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/" className="hover:underline hover:text-blue-300 transition-colors">Inicio</a>
          <button className="hover:underline hover:text-blue-300 transition-colors">Cerrar Sesión</button>
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40 transition-colors">
            <span>👤</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center gap-6 py-6 px-4">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-white text-2xl font-bold flex items-center gap-3">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Ajedrez</span>
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full ${turn === 'w' ? 'bg-amber-300' : 'bg-gray-800 border border-amber-300'}`}></span>
              <span className="text-base font-normal text-amber-100">
                {turn === 'w' ? 'Tu turno' : 'Turno de la IA'}
              </span>
            </div>
          </h2>

          {/* Indicador de dificultad */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {['easy', 'medium', 'hard'].map(diff => (
              <div key={diff} className={`w-3 h-3 rounded-full ${
                level === diff ? 'bg-green-400' : 'bg-gray-500'
              }`}></div>
            ))}
          </div>
        </div>

        {/* Panel de dificultad */}
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg border border-white/30 max-w-md w-full">
          <div className="text-center text-white mb-2 font-medium">Nivel de Dificultad</div>
          <div className="flex flex-wrap justify-center gap-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                className={`px-4 py-2 rounded-full transition-all ${
                  level === diff
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                onClick={() => resetGame(diff)}
              >
                {diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Medio' : 'Difícil'}
              </button>
            ))}
          </div>
        </div>

        {status && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl border-2 border-white/50 shadow-lg max-w-md w-full text-center animate-pulse">
            {status}
          </div>
        )}

        {/* Tablero y piezas capturadas */}
        <div className="flex flex-col lg:flex-row items-center gap-6 w-full max-w-4xl">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-white mb-2 font-medium">
              <span>👤</span>
              <span>Tú</span>
            </div>
            {renderCaptured(capturedBlack, 'black')}
          </div>
          
          <div className="relative">
            {renderBoard()}
            {/* Botones flotantes */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <button 
                onClick={() => resetGame(level)}
                className="p-3 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full hover:from-amber-600 hover:to-amber-800 transition shadow-lg flex items-center justify-center"
                title="Reiniciar partida"
              >
                <span className="text-white text-xl">🔄</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-white mb-2 font-medium">
              <span>🤖</span>
              <span>Rival</span>
            </div>
            {renderCaptured(capturedWhite, 'white')}
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-white text-sm bg-black/30">
        © {new Date().getFullYear()} Cognitive Training App. Todos los derechos reservados.
      </footer>
    </div>
  );
}