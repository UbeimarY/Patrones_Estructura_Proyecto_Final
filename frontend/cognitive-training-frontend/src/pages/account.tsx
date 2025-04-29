// src/pages/account.tsx
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
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <h2 className="text-2xl font-bold">Mi Cuenta</h2>
        <p className="mt-4">Usuario: {user.username}</p>
        <p>Puntaje: {user.score} puntos</p>
        <p>
          Ruta de entrenamiento: {user.trainingRoute ? user.trainingRoute : "Aún no definido"}
        </p>
      </div>
    </div>
  );
}
