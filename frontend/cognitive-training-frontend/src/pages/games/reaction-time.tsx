import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../../context/AppContext';

type GamePhase = 'idle' | 'waiting' | 'ready' | 'result';

const ReactionTimeGame = () => {
  const { user, logout } = useAppContext(); // Añadida función logout
  const router = useRouter();
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

  useEffect(() => {
    if (!user) router.push('/login');
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user, router]);

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const startGame = () => {
    setGamePhase('waiting');
    setReactionTime(null);
    setTooSoon(false);
    
    const maxWaitTime = 5000 - (level * 500);
    const minWaitTime = 2000 - (level * 200);
    const delay = Math.random() * (maxWaitTime - minWaitTime) + minWaitTime;
    
    timeoutRef.current = setTimeout(() => {
      setGamePhase('ready');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gamePhase === 'idle') {
      startGame();
    } 
    else if (gamePhase === 'waiting') {
      setTooSoon(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(() => {
        setTooSoon(false);
        setGamePhase('idle');
      }, 1000);
    } 
    else if (gamePhase === 'ready') {
      const reaction = Date.now() - startTimeRef.current;
      setReactionTime(reaction);
      setGamePhase('result');
      
      // Actualizar estadísticas
      const newHistory = [...stats.history, reaction];
      const newStats = {
        attempts: stats.attempts + 1,
        bestTime: stats.bestTime ? Math.min(stats.bestTime, reaction) : reaction,
        average: Math.round(newHistory.reduce((a, b) => a + b, 0) / newHistory.length),
        history: newHistory
      };
      setStats(newStats);
      
      // Guardar puntuación para gráfico
      setScores(prev => [...prev, reaction].slice(-6));
    }
  };

  // Función para reiniciar completamente el juego
  const resetAll = () => {
    setGamePhase('idle');
    setReactionTime(null);
    setTooSoon(false);
    setStats({
      attempts: 0,
      bestTime: null,
      average: 0,
      history: []
    });
    setScores([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Función para reiniciar solo el juego actual
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
      case 'idle': return stats.attempts > 0 
        ? `¡Listo para intentar de nuevo!` 
        : "Presiona 'Comenzar' para iniciar";
      case 'waiting': return "Espera el cambio de color...";
      case 'ready': return "¡AHORA! Haz clic rápido";
      case 'result': return `Tu tiempo: ${reactionTime}ms`;
      default: return "";
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

  // Componente de Encabezado con navegación MODIFICADO
  const GameHeader = () => (
    <header className="p-4 flex items-center justify-between bg-black/30 backdrop-blur-sm border-b border-white/20">
      {/* Botón de Inicio (casa) */}
      <button 
        onClick={() => router.push('/')}
        className="text-white hover:text-purple-300 transition flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
      
      <h1 className="text-white text-xl md:text-2xl font-bold">Prueba de Tiempo de Reacción</h1>
      
      <div className="flex space-x-3">
        {/* Botón de Cerrar Sesión */}
        <button 
          onClick={handleLogout}
          className="text-white hover:text-red-300 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${
        gamePhase === 'ready' ? 'bg-green-600' : 
        gamePhase === 'result' ? 'bg-blue-700' : 
        tooSoon ? 'bg-red-700' : 'bg-gradient-to-b from-purple-900 to-blue-900'
      }`}
      onClick={handleClick}
    >
      <GameHeader />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-8">
        <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-white/20 shadow-2xl text-center w-full max-w-2xl">
          <div className="mb-6">
            <div className="h-32 w-32 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-6 relative">
              {gamePhase === 'ready' && (
                <div className="animate-ping absolute h-32 w-32 rounded-full bg-green-400 opacity-50"></div>
              )}
              <span className="text-6xl text-white relative">
                {gamePhase === 'ready' ? '👆' : 
                 gamePhase === 'waiting' ? '⏳' : 
                 gamePhase === 'result' ? '⏱️' : '🏁'}
              </span>
            </div>
            
            <p className="text-white text-2xl font-bold mb-4">{getMessage()}</p>
            
            {gamePhase === 'result' && (
              <div className="text-white mb-6">
                <p className="text-3xl font-bold mb-2">{getFeedback()}</p>
                <p className="text-xl">
                  Mejor: {stats.bestTime}ms | Promedio: {stats.average}ms
                </p>
              </div>
            )}
            
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
        
        {/* Gráfico de resultados */}
        {scores.length > 0 && (
          <div className="mt-8 bg-black/20 p-6 rounded-xl w-full max-w-2xl">
            <h3 className="text-white text-xl font-bold mb-4">Tus últimos tiempos:</h3>
            <div className="flex items-end justify-center h-32 gap-2">
              {scores.map((time, i) => {
                const maxScore = Math.max(...scores, 500);
                const height = Math.min(100, (time / maxScore) * 100);
                
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className={`w-10 rounded-t-lg ${
                        time < 250 ? 'bg-green-500' : 
                        time < 350 ? 'bg-yellow-500' : 
                        time < 450 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-white text-xs mt-2">{time}ms</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Estadísticas avanzadas */}
        {stats.history.length > 0 && (
          <div className="mt-6 bg-black/20 p-4 rounded-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white text-lg font-bold">Historial:</h3>
              <span className="text-white">Intentos: {stats.attempts}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {stats.history.map((time, i) => (
                <div 
                  key={i} 
                  className={`px-3 py-1 rounded-full font-medium ${
                    time === stats.bestTime 
                      ? 'bg-yellow-500 text-black' 
                      : time < 300
                      ? 'bg-green-500 text-white'
                      : time < 400
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {time}ms
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 text-center text-white/80 text-sm">
        <p>© {new Date().getFullYear()} Cognitive Training App. Todos los derechos reservados.</p>
      </footer>

      {/* Overlay para clic demasiado pronto */}
      {tooSoon && (
        <div className="fixed inset-0 bg-red-600 bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-white text-4xl md:text-5xl font-bold animate-bounce text-center p-4">
            ¡DEMASIADO PRONTO!<br />
            <span className="text-xl">Espera a que la pantalla se vuelva verde</span>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      {gamePhase === 'idle' && stats.attempts === 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-purple-900/80 text-white p-4 rounded-lg backdrop-blur-sm max-w-md mx-auto border border-purple-500">
          <h3 className="font-bold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Instrucciones:
          </h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Presiona "Comenzar"</li>
            <li>Espera a que la pantalla se vuelva VERDE</li>
            <li>Haz clic lo más rápido posible cuando veas el cambio</li>
            <li>¡No hagas clic demasiado pronto o fallarás!</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default function ReactionTime() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <ReactionTimeGame />
    </div>
  );
}