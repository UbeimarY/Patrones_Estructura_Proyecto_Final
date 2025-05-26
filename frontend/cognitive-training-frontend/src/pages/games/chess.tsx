import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const initialBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

const pieceValues: Record<string, number> = {
  "♟": 1, "♞": 3, "♝": 3, "♜": 5, "♛": 9, "♚": 0,
  "♙": -1, "♘": -3, "♗": -3, "♖": -5, "♕": -9, "♔": 0
};

export default function Chess() {
  const { user } = useAppContext();
  const router = useRouter();

  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameOver, setGameOver] = useState<string | null>(null);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const isWhitePiece = (piece: string) => /♙|♖|♘|♗|♕|♔/.test(piece);
  const isBlackPiece = (piece: string) => /♟|♜|♞|♝|♛|♚/.test(piece);

  const resetGame = (newLevel: 'easy' | 'medium' | 'hard') => {
    setBoard(initialBoard);
    setSelected(null);
    setTurn('white');
    setScore(0);
    setGameOver(null);
    setLevel(newLevel);
  };

  const getValidMoves = (row: number, col: number) => {
    const directions = [
      [1, 0], [1, 1], [1, -1], [0, 1], [0, -1],
      [-1, 0], [-1, 1], [-1, -1]
    ];

    const moves: [number, number][] = [];

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const target = board[newRow][newCol];
        if (target === "" || isWhitePiece(target)) {
          moves.push([newRow, newCol]);
        }
      }
    });

    return moves;
  };

  const getBlackMove = () => {
    const allMoves: {
      from: [number, number],
      to: [number, number],
      value: number
    }[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isBlackPiece(board[row][col])) {
          const moves = getValidMoves(row, col);
          moves.forEach(([toRow, toCol]) => {
            const target = board[toRow][toCol];
            allMoves.push({
              from: [row, col],
              to: [toRow, toCol],
              value: pieceValues[target] || 0
            });
          });
        }
      }
    }

    if (level === 'easy') {
      return allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    if (level === 'medium') {
      const captureMoves = allMoves.filter(m => m.value > 0);
      return captureMoves.length > 0
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    // hard
    return allMoves.sort((a, b) => b.value - a.value)[0];
  };

  const checkGameOver = (boardState: string[][]) => {
    const flat = boardState.flat();
    const hasWhiteKing = flat.includes("♔");
    const hasBlackKing = flat.includes("♚");

    if (!hasWhiteKing) {
      setGameOver("¡Has perdido! El rival capturó tu rey.");
      return true;
    }
    if (!hasBlackKing) {
      setGameOver("¡Has ganado! Capturaste al rey enemigo.");
      return true;
    }
    return false;
  };

  const makeMove = (
    boardState: string[][],
    from: [number, number],
    to: [number, number]
  ) => {
    const newBoard = boardState.map(row => [...row]);
    const movingPiece = newBoard[from[0]][from[1]];
    const targetPiece = newBoard[to[0]][to[1]];

    if (targetPiece) {
      setScore(prev => prev + (pieceValues[targetPiece] || 0));
    }

    newBoard[to[0]][to[1]] = movingPiece;
    newBoard[from[0]][from[1]] = "";

    const gameEnded = checkGameOver(newBoard);
    return gameEnded ? boardState : newBoard;
  };

  const handleCellClick = (row: number, col: number) => {
    if (turn !== 'white' || gameOver) return;

    const clickedPiece = board[row][col];

    if (!selected) {
      if (isWhitePiece(clickedPiece)) setSelected([row, col]);
      return;
    }

    const [fromRow, fromCol] = selected;
    if (isWhitePiece(clickedPiece)) {
      setSelected([row, col]);
      return;
    }

    const updatedBoard = makeMove(board, [fromRow, fromCol], [row, col]);
    setBoard(updatedBoard);
    setSelected(null);
    setTurn('black');

    setTimeout(() => {
      const move = getBlackMove();
      if (move) {
        const responseBoard = makeMove(updatedBoard, move.from, move.to);
        setBoard(responseBoard);
      }
      setTurn('white');
    }, 800);
  };

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
        <p className="text-white">Turno actual: {turn === 'white' ? 'Blancas ♙' : 'Negras ♟'}</p>
        <p className="text-white">Puntaje: {score}</p>

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

        {gameOver && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded border border-red-400 mt-2">
            {gameOver}
          </div>
        )}

        <div className="grid grid-cols-8 grid-rows-8 border border-white">
          {board.flat().map((piece, idx) => {
            const row = Math.floor(idx / 8);
            const col = idx % 8;
            const isDark = (row + col) % 2 === 1;
            const isSelected = selected?.[0] === row && selected?.[1] === col;

            return (
              <div
                key={idx}
                onClick={() => handleCellClick(row, col)}
                className={`w-16 h-16 flex items-center justify-center cursor-pointer border 
                  ${isDark ? 'bg-gray-600' : 'bg-gray-300'} 
                  ${isSelected ? 'ring-4 ring-yellow-400' : ''}`}
              >
                <span className="text-2xl">{piece}</span>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="p-4 text-center text-white text-sm">
        © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
      </footer>
    </div>
  );
}
