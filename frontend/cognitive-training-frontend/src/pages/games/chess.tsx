// src/pages/games/chess.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

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

export default function Chess() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (authLoaded && !user) router.push("/login");
  }, [user, authLoaded, router]);

  const isLoading = !authLoaded;

  return isLoading ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-700 font-sans">
      <p className="text-white text-xl">Cargando...</p>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
      <BackButton />
      <Navbar />
      <header className="p-4">
        <h1 className="text-white text-3xl font-bold text-center">Ajedrez</h1>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-8 grid-rows-8">
          {initialBoard.flat().map((piece, idx) => {
            const row = Math.floor(idx / 8);
            const col = idx % 8;
            const isDark = (row + col) % 2 === 1;
            return (
              <div
                key={idx}
                className={`w-16 h-16 flex items-center justify-center ${isDark ? "bg-gray-600" : "bg-gray-300"} border`}
              >
                <span className="text-2xl">{piece}</span>
              </div>
            );
          })}
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
