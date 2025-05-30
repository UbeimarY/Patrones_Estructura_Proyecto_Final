// src/components/GameLayout.tsx
import { ReactNode } from "react";
import Navbar from "./Navbar";
import BackButton from "./BackButton";

interface GameLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function GameLayout({ children, title = "Juego de Memoria" }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex flex-col">
      {/* Fondo animado */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <BackButton />
      <Navbar />
      <header className="p-6 text-center">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold drop-shadow-lg bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {title}
        </h1>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="p-6 text-center">
        <p className="text-white/60 text-sm">
          © {new Date().getFullYear()} Mi Proyecto. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
