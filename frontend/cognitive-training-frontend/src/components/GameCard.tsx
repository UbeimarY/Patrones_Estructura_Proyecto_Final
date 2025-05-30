// src/components/GameCard.tsx
import Link from 'next/link';

// Interfaz para mapear los datos que vendrán desde el backend (MongoDB)
// Nota: asegúrate de que los campos del backend se mapeen correctamente a estos nombres.
export interface Game {
  id: string;
  title: string;         // Podrías mapear "title" al atributo "name" del backend si así lo prefieres.
  description: string;
  image: string;
  category: string;      // Este valor puede corresponder al "type" o a una clasificación adicional.
  technologies: string[];
  link: string;          // URL a la que se dirigirá el jugador para iniciar la partida.
}

export interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg group overflow-hidden transition transform hover:scale-105">
      {/* Sección de imagen con overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="rounded-full bg-purple-600/80 backdrop-blur-sm px-2 py-1 text-xs text-white">
            {game.category}
          </span>
        </div>
      </div>
      {/* Sección de detalles debajo de la imagen */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-white">{game.title}</h3>
        <p className="mb-4 text-sm text-white">{game.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {game.technologies.map((tech, i) => (
            <span
              key={i}
              className="rounded-full bg-white/10 px-2 py-1 text-xs text-white"
            >
              {tech}
            </span>
          ))}
        </div>
        {/* El link para "Jugar" puede dirigir a una página que inicie la partida.
            Esa página, a su vez, debería consumir el endpoint del backend para registrar
            la partida, registrar movimientos, etc., utilizando las estructuras de datos (MyStack, MyLinkedList, etc.).
            Esto garantiza la integración real entre el frontend y el backend. */}
        <Link href={game.link} legacyBehavior>
          <a className="inline-block text-sm font-medium text-white hover:underline">
            Jugar →
          </a>
        </Link>
      </div>
    </div>
  );
}
