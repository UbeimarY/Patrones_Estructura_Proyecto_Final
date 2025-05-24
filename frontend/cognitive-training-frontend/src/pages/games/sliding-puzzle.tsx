// src/pages/games/sliding-puzzle.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

const gridSize = 3;

const generateSolvablePuzzle = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let inversions = 0;
  do {
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
  } while (inversions % 2 !== 0);
  return numbers;
};

export default function SlidingPuzzle() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();
  const [board, setBoard] = useState<number[]>([]);

  useEffect(() => {
    setBoard(generateSolvablePuzzle());
  }, []);

  useEffect(() => {
    if (authLoaded && !user) {
      router.push("/login");
    }
  }, [user, authLoaded, router]);

  const isLoading = !authLoaded || board.length === 0;

  const getPosition = (index: number) => ({
    row: Math.floor(index / gridSize),
    col: index % gridSize,
  });

  const handleTileClick = (index: number) => {
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
    }
  };

  const renderTile = (tile: number, idx: number) =>
    tile === 0 ? (
      <div key={idx} className="flex items-center justify-center w-24 h-24 bg-gray-200 border border-gray-300" />
    ) : (
      <div
        key={idx}
        onClick={() => handleTileClick(idx)}
        className="flex items-center justify-center w-24 h-24 bg-purple-300 text-white text-2xl font-bold border border-gray-300 cursor-pointer hover:bg-purple-400 transition"
      >
        {tile}
      </div>
    );

  return isLoading ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-700 font-sans">
      <p className="text-white text-xl">Cargando...</p>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
      <BackButton />
      <Navbar />
      <header className="p-4">
        <h1 className="text-white text-3xl font-bold text-center">Rompecabezas Deslizante</h1>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-3 gap-2">
          {board.map((tile, idx) => renderTile(tile, idx))}
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
