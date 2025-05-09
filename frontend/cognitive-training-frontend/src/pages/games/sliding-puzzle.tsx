// frontend/cognitive-training-frontend/src/pages/games/sliding-puzzle.tsx
import { useState } from "react";

const gridSize = 3;

export default function SlidingPuzzle() {
  // Representamos el tablero como un arreglo de números; 0 representa la casilla en blanco.
  const [board, setBoard] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);

  // Dada la posición (índice) en el arreglo, calculamos la fila y columna del tablero.
  const getPosition = (index: number) => ({
    row: Math.floor(index / gridSize),
    col: index % gridSize,
  });

  // Función para manejar el clic sobre una ficha.
  const handleTileClick = (index: number) => {
    const blankIndex = board.indexOf(0);
    const { row: targetRow, col: targetCol } = getPosition(index);
    const { row: blankRow, col: blankCol } = getPosition(blankIndex);

    // Solo se permite mover si la ficha clickeada está adyacente (misma fila con diferencia 1 en columna o viceversa)
    if (
      (targetRow === blankRow && Math.abs(targetCol - blankCol) === 1) ||
      (targetCol === blankCol && Math.abs(targetRow - blankRow) === 1)
    ) {
      const newBoard = [...board];
      [newBoard[index], newBoard[blankIndex]] = [newBoard[blankIndex], newBoard[index]];
      setBoard(newBoard);
    }
  };

  // Renderizamos cada ficha; si el número es 0, mostramos una casilla en blanco.
  const renderTile = (tile: number, idx: number) => {
    if (tile === 0) {
      return (
        <div
          key={idx}
          className="flex items-center justify-center w-24 h-24 bg-gray-200 border border-gray-300"
        >
          {/* Casilla en blanco */}
        </div>
      );
    } else {
      return (
        <div
          key={idx}
          onClick={() => handleTileClick(idx)}
          className="flex items-center justify-center w-24 h-24 bg-purple-300 text-white text-2xl font-bold border border-gray-300 cursor-pointer hover:bg-purple-400 transition"
        >
          {tile}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
      {/* Header */}
      <header className="p-4">
        <h1 className="text-white text-3xl font-bold text-center">Rompecabezas Deslizante</h1>
      </header>
      {/* Contenido Principal */}
      <main className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-3 gap-2">
          {board.map((tile, idx) => renderTile(tile, idx))}
        </div>
      </main>
      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
