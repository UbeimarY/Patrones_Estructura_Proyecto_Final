import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import BackButton from '../../components/BackButton';

type GamePhase = 'idle' | 'waiting' | 'ready' | 'result';

const formatTime = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}min`;
};

const READY_COLORS = [
  'bg-green-600',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500'
];
const PING_COLORS = [
  'bg-green-400',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-pink-400',
  'bg-cyan-400'
];

const ReactionTimeGame = () => {
  const { user, logout } = useAppContext();
  const router = useRouter();

  // Estados principales del juego
  const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [stats, setStats] = useState({
    attempts: 0,
    bestTime: null as number | null,
    average: 0,
    history: [] as number[]
  });
  const [tooSoon, setTooSoon] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [level, setLevel] = useState(1);
  const [scores, setScores] = useState<number[]>([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    if (!user) router.push('/login');
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Inicia el juego: de 'idle' a 'waiting' y luego a 'ready' tras un delay
  const startGame = () => {
    setGamePhase('waiting');
    setReactionTime(null);
    setTooSoon(false);
    const maxWaitTime = 5000 - (level * 500);
    const minWaitTime = 2000 - (level * 200);
    const delay = Math.random() * (maxWaitTime - minWaitTime) + minWaitTime;
    timeoutRef.current = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * READY_COLORS.length);
      setCurrentColorIndex(randomIndex);
      setGamePhase('ready');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gamePhase === 'idle') {
      startGame();
    } else if (gamePhase === 'waiting') {
      setTooSoon(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(() => {
        setTooSoon(false);
        setGamePhase('idle');
      }, 1000);
    } else if (gamePhase === 'ready') {
      const reaction = Date.now() - startTimeRef.current;
      setReactionTime(reaction);
      setGamePhase('result');
      const newHistory = [...stats.history, reaction];
      const newStats = {
        attempts: stats.attempts + 1,
        bestTime: stats.bestTime ? Math.min(stats.bestTime, reaction) : reaction,
        average: Math.round(newHistory.reduce((a, b) => a + b, 0) / newHistory.length),
        history: newHistory
      };
      setStats(newStats);
      setScores(prev => [...prev, reaction].slice(-6));
    }
  };

  const resetAll = () => {
    setGamePhase('idle');
    setReactionTime(null);
    setTooSoon(false);
    setStats({ attempts: 0, bestTime: null, average: 0, history: [] });
    setScores([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const resetGame = () => {
    setGamePhase('idle');
    setReactionTime(null);
    setTooSoon(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const getMessage = () => {
    switch (gamePhase) {
      case 'idle': 
        return stats.attempts > 0 ? "¡Listo para intentar de nuevo!" : "Presiona 'Comenzar' para iniciar";
      case 'waiting': 
        return "Espera el cambio de color...";
      case 'ready': 
        return "¡AHORA! Haz clic rápido";
      case 'result': 
        return `Tu tiempo: ${formatTime(reactionTime!)}`;
      default: 
        return "";
    }
  };

  const getFeedback = () => {
    if (!reactionTime) return "";
    if (reactionTime < 200) return "¡Reflejos de gato!";
    if (reactionTime < 300) return "¡Excelente!";
    if (reactionTime < 400) return "¡Muy bien!";
    if (reactionTime < 500) return "Bien";
    return "Puedes mejorar";
  };

  const getLevelDescription = () => {
    if (level === 1) return "Fácil (espera más larga)";
    if (level === 2) return "Normal";
    if (level === 3) return "Difícil";
    return "Experto (espera muy corta)";
  };

  /* Banner de Resultados e Historial Mejorado */
  const ResultsBanner = () => (
    <div className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-2xl max-w-2xl w-full animate-fade-in">
      <h3 className="text-white text-2xl font-bold mb-4 text-center">Resultados de tu Juego</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Mejor Tiempo */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl shadow-md">
          <p className="text-white font-bold text-lg">Mejor Tiempo</p>
          <p className="text-4xl font-extrabold text-yellow-300">
            {stats.bestTime ? formatTime(stats.bestTime) : '-'}
          </p>
        </div>
        {/* Último Tiempo */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-md">
          <p className="text-white font-bold text-lg">Último Tiempo</p>
          <p className="text-4xl font-extrabold text-cyan-300">
            {scores.length > 0 ? formatTime(scores[scores.length - 1]) : '-'}
          </p>
        </div>
        {/* Tiempo Promedio */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl shadow-md">
          <p className="text-white font-bold text-lg">Tiempo Promedio</p>
          <p className="text-4xl font-extrabold text-white/80">
            {stats.average ? formatTime(stats.average) : '-'}
          </p>
        </div>
      </div>
      {stats.history.length > 0 && (
        <div className="mb-4">
          <h3 className="text-white text-xl font-bold mb-3 text-center">Historial de Intentos</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {stats.history.map((time, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg font-medium text-lg ${
                  time === stats.bestTime
                    ? 'bg-yellow-400 text-black'
                    : time < 300
                    ? 'bg-green-500 text-white'
                    : time < 400
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {formatTime(time)}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-center">
        <p className="text-white text-lg font-semibold">{getFeedback()}</p>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col font-sans transition-all duration-300"
      onClick={handleClick}
    >
      {/* Se utilizan los mismos Navbar y BackButton que en Memory Game
          para mantener la identidad visual */}
      <Navbar />
      <BackButton />
      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-8">
        <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-white/20 shadow-2xl text-center w-full max-w-2xl">
          <div className="mb-6">
            <div className="h-32 w-32 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-6 relative">
              {gamePhase === 'ready' && (
                <div className={`animate-ping absolute h-32 w-32 rounded-full ${PING_COLORS[currentColorIndex]} opacity-50`}></div>
              )}
              <span className="text-6xl text-white relative">
                {gamePhase === 'ready'
                  ? '👆'
                  : gamePhase === 'waiting'
                  ? '⏳'
                  : gamePhase === 'result'
                  ? '⏱️'
                  : '🏁'}
              </span>
            </div>
            <p className="text-white text-2xl font-bold mb-4">{getMessage()}</p>
            {gamePhase === 'idle' && (
              <div className="bg-purple-800/50 p-4 rounded-lg mb-6">
                <p className="text-white mb-2">Nivel actual: {getLevelDescription()}</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4].map(lvl => (
                    <button
                      key={lvl}
                      onClick={(e) => { e.stopPropagation(); setLevel(lvl); }}
                      className={`px-4 py-2 rounded-lg font-bold ${
                        level === lvl
                          ? 'bg-white text-purple-700'
                          : 'bg-purple-600 text-white hover:bg-purple-500'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              disabled={gamePhase === 'waiting'}
              className={`py-3 px-4 rounded-xl font-bold text-lg transition shadow-lg ${
                gamePhase === 'waiting'
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
              }`}
            >
              {gamePhase === 'result' ? 'Intentar de nuevo' : 'Comenzar'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); resetAll(); }}
              className="py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-800 transition shadow-lg"
            >
              Reiniciar Todo
            </button>
          </div>
        </div>
        {gamePhase === 'result' && <ResultsBanner />}
        {tooSoon && (
          <div className="fixed inset-0 bg-red-600 bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-white text-4xl md:text-5xl font-bold animate-bounce text-center p-4">
              ¡DEMASIADO PRONTO!<br />
              <span className="text-xl">Espera a que la pantalla cambie de color</span>
            </div>
          </div>
        )}
      </main>
      <footer className="p-4 text-center text-white/80 text-sm">
        <p>© {new Date().getFullYear()} Cognitive Training App. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default function ReactionTime() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <ReactionTimeGame />
    </div>
  );
}
