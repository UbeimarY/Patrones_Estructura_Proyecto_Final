import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface RecentActivity {
  game: string;
  date: string;
  result: string;
}

interface ProgressData {
  gamesPlayed: number;
  bestScore: number;
  recentActivity: RecentActivity[];
}

export default function Account() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  useEffect(() => {
    if (authLoaded && !user) {
      router.push("/login");
    }
  }, [authLoaded, user, router]);

  // Simula la obtención de datos de progreso del usuario
  useEffect(() => {
    if (authLoaded && user) {
      setTimeout(() => {
        setProgressData({
          gamesPlayed: 15,
          bestScore: user.score,
          recentActivity: [
            { game: "Memory", date: "2023-09-21", result: "Victoria" },
            { game: "Blackjack", date: "2023-09-20", result: "Derrota" },
            { game: "Sliding Puzzle", date: "2023-09-19", result: "Victoria" },
          ],
        });
      }, 1000);
    }
  }, [authLoaded, user]);

  if (!authLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-700">
        <p className="text-white text-xl">Cargando...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Tarjeta de perfil */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
          {/* Portada con gradiente */}
          <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <img
                src={user.avatar || "/images/avatar/default-avatar.png"}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
              />
            </div>
          </div>

          {/* Información del usuario */}
          <div className="pt-20 pb-8 px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Perfil de Usuario</h2>
            
            <div className="space-y-3 text-lg text-white/90">
              <div className="flex justify-center items-center gap-2">
                <span className="font-semibold">👤 Usuario:</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">{user.username}</span>
              </div>
              
              <div className="flex justify-center items-center gap-2">
                <span className="font-semibold">🏆 Puntaje:</span>
                <span className="bg-yellow-400/90 text-purple-900 px-3 py-1 rounded-full">
                  {user.score} puntos
                </span>
              </div>
              
              <div className="flex justify-center items-center gap-2">
                <span className="font-semibold">🎯 Ruta de entrenamiento:</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  {user.trainingRoute || "Por definir"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de progreso */}
        <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Tu progreso</h3>
          <div className="grid grid-cols-2 gap-4 text-white">
            <div className="bg-purple-500/30 p-4 rounded-xl">
              <p className="text-xl font-semibold">🎮 Partidas jugadas</p>
              <p className="text-3xl mt-2">
                {progressData ? progressData.gamesPlayed : 0}
              </p>
            </div>
            <div className="bg-blue-500/30 p-4 rounded-xl">
              <p className="text-xl font-semibold">⭐ Mejor puntuación</p>
              <p className="text-3xl mt-2">
                {progressData ? progressData.bestScore : user.score}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de actividad reciente */}
        <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">📅 Actividad reciente</h3>
          <div className="space-y-3">
            {progressData && progressData.recentActivity.length > 0 ? (
              progressData.recentActivity.map((activity, idx) => (
                <div key={idx} className="bg-white/10 p-4 rounded-lg text-white">
                  <p className="font-semibold">{activity.game}</p>
                  <p className="text-sm text-white/70 mt-1">
                    {activity.date} - {activity.result}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white/10 p-4 rounded-lg text-white">
                <p className="italic">No hay actividad reciente</p>
                <p className="text-sm text-white/70 mt-1">
                  Tus partidas aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="py-4 text-center mt-8">
        <p className="text-white/80 text-sm">
          © {new Date().getFullYear()} Cognitive Training App. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
