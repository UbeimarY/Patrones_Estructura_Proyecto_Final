// src/pages/training.tsx
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Training() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-white text-4xl font-bold text-center mb-8">
          Ruta de Entrenamiento
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/games/sliding-puzzle">
            <div className="bg-white rounded-lg shadow-xl p-6 cursor-pointer hover:shadow-2xl transition">
              <h2 className="text-purple-600 text-2xl font-bold mb-2">
                Rompecabezas Deslizante
              </h2>
              <p className="text-gray-800">
                Entrena tu coordinación y habilidades de resolución de problemas.
              </p>
            </div>
          </Link>
          {/* Se pueden agregar más tarjetas para otros juegos */}
        </div>
      </main>
      <footer className="p-4 text-center text-white">
        © {new Date().getFullYear()} Cognitive Training App. Todos los derechos reservados.
      </footer>
    </div>
  );
}
