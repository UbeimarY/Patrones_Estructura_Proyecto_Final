// src/pages/index.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppContext';
import GameCard, { Game } from '../components/GameCard';

const games: Game[] = [
  {
    id: 'sliding-puzzle',
    title: 'Rompecabezas Deslizante',
    description:
      'Desafía tu mente resolviendo este clásico rompecabezas que estimula el razonamiento lógico.',
    image: '/games/sliding-puzzle-banner.jpg',
    category: 'Puzzle',
    technologies: ['Lógica', 'Cognitivo'],
    link: '/games/sliding-puzzle',
  },
  {
    id: 'memory-game',
    title: 'Juego de Memoria',
    description:
      'Pon a prueba tu memoria emparejando cartas de manera rápida y precisa.',
    image: '/games/memory-game-banner.jpg',
    category: 'Memoria',
    technologies: ['Concentración', 'Cognitivo'],
    link: '/games/memory-game',
  },
  {
    id: 'reaction-time',
    title: 'Tiempo de Reacción',
    description:
      'Mide y mejora tu velocidad de respuesta en un entorno dinámico y desafiante.',
    image: '/games/reaction-time-banner.jpg',
    category: 'Reacción',
    technologies: ['Velocidad', 'Atención', 'Cognitivo'],
    link: '/games/reaction-time',
  },
  {
    id: 'chess',
    title: 'Ajedrez',
    description: 'Desafía tu estrategia en partidas de ajedrez.',
    image: '/games/chess-banner.jpg',
    category: 'Puzzle',
    technologies: ['Estrategia', 'Planificación'],
    link: '/games/chess',
  },
  {
    id: 'trivia',
    title: 'Trivia',
    description: 'Pon a prueba tus conocimientos en preguntas desafiantes.',
    image: '/games/trivia-banner.jpg',
    category: 'Memoria',
    technologies: ['Conocimiento', 'Rapidez'],
    link: '/games/trivia',
  },
  {
    id: 'card-game',
    title: 'Juego de Cartas',
    description: 'Mejora tu agilidad mental con este divertido juego de cartas.',
    image: '/games/card-game-banner.jpg',
    category: 'Reacción',
    technologies: ['Rapidez', 'Atención'],
    link: '/games/card-game',
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const filteredGames =
    selectedCategory && selectedCategory !== 'All'
      ? games.filter((game) => game.category === selectedCategory)
      : games;
  const categories = ['All', 'Puzzle', 'Memoria', 'Reacción'];

  const { user } = useAppContext();
  const router = useRouter();

  const handlePlay = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (!user) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-purple-600 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-5xl font-bold mb-4">
          Bienvenido a Cognitive Training
        </h1>
        <p className="text-white text-xl mb-6">
          Entrena tu mente y mejora tus habilidades cognitivas.
        </p>

        <section className="w-full max-w-6xl mt-8">
          <h2 className="text-white text-3xl font-bold mb-4">Mis Juegos</h2>
          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white'
                } hover:bg-purple-700 transition`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </main>

      <footer className="py-4 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
