// frontend/cognitive-training-frontend/src/pages/index.tsx
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-600 flex flex-col font-sans">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-5xl font-bold mb-4">
          Bienvenido a Cognitive Training
        </h1>
        <p className="text-white text-xl mb-6">
          Entrena tu mente y mejora tus habilidades cognitivas.
        </p>
        
        {/* Card del juego integrado en home */}
        <Link href="/games/sliding-puzzle" passHref>
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 w-full max-w-md cursor-pointer hover:shadow-2xl transition transform hover:scale-105">
            <h2 className="text-purple-600 text-2xl font-bold mb-2">
              Rompecabezas Deslizante
            </h2>
            <p className="text-gray-800">
              Desafía tu mente con este clásico juego de fichas. ¡Haz clic para jugar!
            </p>
          </div>
        </Link>
      </main>
      <footer className="p-4 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
