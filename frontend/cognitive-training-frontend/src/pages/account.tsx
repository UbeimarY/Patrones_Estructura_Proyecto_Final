import { useAppContext } from '../context/AppContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function Account() {
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-purple-600 flex flex-col font-sans">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-center text-3xl font-bold text-purple-600 mb-6">Mi Cuenta</h2>
          <div className="mb-4">
            <span className="block text-gray-700 font-semibold">Usuario:</span>
            <p className="text-xl text-gray-900">{user.username}</p>
          </div>
          <div className="mb-4">
            <span className="block text-gray-700 font-semibold">Puntaje:</span>
            <p className="text-xl text-gray-900">{user.score} puntos</p>
          </div>
          <div>
            <span className="block text-gray-700 font-semibold">Ruta de entrenamiento:</span>
            <p className="text-xl text-gray-900">
              {user.trainingRoute ? user.trainingRoute : "Aún no definido"}
            </p>
          </div>
        </div>
      </main>
      <footer className="py-4 text-center">
        <p className="text-white text-sm">© {new Date().getFullYear()} Cognitive Training App. All rights reserved.</p>
      </footer>
    </div>
  );
}
