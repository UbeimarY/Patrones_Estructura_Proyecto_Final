// src/pages/games/trivia.tsx
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";

type GameMode = "clásico" | "contraReloj" | "supervivencia" | "sinFin";

// 40 preguntas en total (20 originales + 20 nuevas)
const allQuestions = [
  // Preguntas originales
  { question: "¿Cuál es la capital de Japón?", options: ["Seúl", "Tokio", "Pekín", "Bangkok"], correct: "Tokio" },
  { question: "¿Quién escribió 'Cien años de soledad'?", options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Julio Cortázar", "Jorge Luis Borges"], correct: "Gabriel García Márquez" },
  { question: "¿Cuál es el metal más ligero?", options: ["Plata", "Oro", "Litio", "Hierro"], correct: "Litio" },
  { question: "¿En qué año llegó el hombre a la Luna?", options: ["1965", "1969", "1972", "1980"], correct: "1969" },
  { question: "¿Cuál es el océano más grande del mundo?", options: ["Atlántico", "Pacífico", "Índico", "Ártico"], correct: "Pacífico" },
  { question: "¿Qué gas es esencial para la respiración humana?", options: ["Nitrógeno", "Oxígeno", "Hidrógeno", "Dióxido de carbono"], correct: "Oxígeno" },
  { question: "¿Cuál es el planeta más grande del sistema solar?", options: ["Marte", "Júpiter", "Saturno", "Urano"], correct: "Júpiter" },
  { question: "¿Quién pintó 'La última cena'?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], correct: "Leonardo da Vinci" },
  { question: "¿Cuál es el país con mayor población del mundo?", options: ["Estados Unidos", "India", "China", "Brasil"], correct: "China" },
  { question: "¿Qué elemento químico tiene símbolo 'Au'?", options: ["Plata", "Oro", "Aluminio", "Argón"], correct: "Oro" },
  { question: "¿En qué continente está Egipto?", options: ["Asia", "África", "Europa", "América"], correct: "África" },
  { question: "¿Cuántos huesos tiene el cuerpo humano adulto?", options: ["156", "206", "250", "300"], correct: "206" },
  { question: "¿Qué planeta es conocido como 'el planeta rojo'?", options: ["Venus", "Marte", "Júpiter", "Saturno"], correct: "Marte" },
  { question: "¿Qué artista pintó 'La noche estrellada'?", options: ["Pablo Picasso", "Vincent van Gogh", "Salvador Dalí", "Claude Monet"], correct: "Vincent van Gogh" },
  { question: "¿Cuál es el río más largo del mundo?", options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"], correct: "Amazonas" },
  { question: "¿Qué país tiene forma de bota?", options: ["Francia", "Italia", "España", "Portugal"], correct: "Italia" },
  { question: "¿Cuál es el hueso más largo del cuerpo humano?", options: ["Fémur", "Húmero", "Tibia", "Radio"], correct: "Fémur" },
  { question: "¿En qué año se fundó Google?", options: ["1996", "1998", "2000", "2002"], correct: "1998" },
  { question: "¿Qué vitamina produce la piel con exposición solar?", options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina K"], correct: "Vitamina D" },
  { question: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Canberra", "Perth"], correct: "Canberra" },
  
  // 20 nuevas preguntas
  { question: "¿Cuál es el animal más grande del mundo?", options: ["Elefante africano", "Ballena azul", "Tiburón ballena", "Jirafa"], correct: "Ballena azul" },
  { question: "¿Qué país ganó el primer Mundial de Fútbol en 1930?", options: ["Argentina", "Brasil", "Uruguay", "Italia"], correct: "Uruguay" },
  { question: "¿En qué año comenzó la Segunda Guerra Mundial?", options: ["1935", "1939", "1941", "1945"], correct: "1939" },
  { question: "¿Qué científico formuló la teoría de la relatividad?", options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Nikola Tesla"], correct: "Albert Einstein" },
  { question: "¿Cuál es el libro más vendido de la historia?", options: ["Don Quijote", "La Biblia", "Harry Potter", "El Señor de los Anillos"], correct: "La Biblia" },
  { question: "¿Qué elemento químico es el más abundante en el universo?", options: ["Oxígeno", "Carbono", "Hidrógeno", "Helio"], correct: "Hidrógeno" },
  { question: "¿Cuál es la montaña más alta del mundo?", options: ["K2", "Monte Everest", "Aconcagua", "Kilimanjaro"], correct: "Monte Everest" },
  { question: "¿Quién compuso 'La flauta mágica'?", options: ["Beethoven", "Bach", "Mozart", "Chopin"], correct: "Mozart" },
  { question: "¿Cuál es el país con más islas del mundo?", options: ["Filipinas", "Indonesia", "Suecia", "Japón"], correct: "Suecia" },
  { question: "¿Qué planeta tiene más lunas?", options: ["Júpiter", "Saturno", "Urano", "Neptuno"], correct: "Saturno" },
  { question: "¿Cuál es el metal líquido a temperatura ambiente?", options: ["Plomo", "Estaño", "Mercurio", "Cadmio"], correct: "Mercurio" },
  { question: "¿Quién escribió 'Romeo y Julieta'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correct: "William Shakespeare" },
  { question: "¿Qué órgano produce insulina?", options: ["Hígado", "Páncreas", "Riñón", "Estómago"], correct: "Páncreas" },
  { question: "¿Cuál es el desierto más grande del mundo?", options: ["Desierto del Sahara", "Desierto de Gobi", "Desierto de Arabia", "Antártida"], correct: "Antártida" },
  { question: "¿En qué país se encuentra la Torre Eiffel?", options: ["Italia", "Reino Unido", "España", "Francia"], correct: "Francia" },
  { question: "¿Qué artista es conocido como 'El Rey del Pop'?", options: ["Elvis Presley", "Michael Jackson", "Prince", "Madonna"], correct: "Michael Jackson" },
  { question: "¿Cuál es el hueso más pequeño del cuerpo humano?", options: ["Estribo", "Martillo", "Yunque", "Vértebra"], correct: "Estribo" },
  { question: "¿Qué gas liberan las plantas durante la fotosíntesis?", options: ["Dióxido de carbono", "Oxígeno", "Nitrógeno", "Metano"], correct: "Oxígeno" },
  { question: "¿Cuál es el idioma más hablado del mundo?", options: ["Inglés", "Español", "Mandarín", "Hindi"], correct: "Mandarín" },
  { question: "¿Qué deporte se juega en Wimbledon?", options: ["Fútbol", "Tenis", "Golf", "Críquet"], correct: "Tenis" }
];

export default function Trivia() {
  const { user } = useAppContext();
  const router = useRouter();
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [questionCount, setQuestionCount] = useState(10); // Cantidad predeterminada
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [lives, setLives] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0); // Racha actual para modo sin fin
  const [maxStreak, setMaxStreak] = useState(0); // Máxima racha para modo sin fin
  const [gameQuestions, setGameQuestions] = useState<typeof allQuestions>([]); // Preguntas seleccionadas para el juego

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    if (gameMode === "contraReloj" && isTimerActive && !finished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            handleAutoFail();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerActive, gameMode, finished]);

  const handleAutoFail = () => {
    setResult("¡Tiempo agotado!");
    setSelected("");
    setIncorrectAnswers(prev => prev + 1);
    
    if (gameMode === "sinFin") {
      setFinished(true);
      return;
    }
    
    setTimeout(() => advanceGame(), 1500);
  };

  // Función para mezclar preguntas aleatoriamente
  const shuffleQuestions = useCallback((count: number) => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, []);

  const startGame = (mode: GameMode) => {
    let questionsToUse = [];
    
    if (mode === "sinFin") {
      // Modo sin fin usa todas las preguntas en orden aleatorio
      questionsToUse = shuffleQuestions(allQuestions.length);
      setStreak(0);
      setMaxStreak(0);
    } else {
      // Otros modos usan la cantidad seleccionada
      questionsToUse = shuffleQuestions(questionCount);
    }
    
    setGameQuestions(questionsToUse);
    setGameMode(mode);
    setCurrentQuestion(0);
    setScore(0);
    setFinished(false);
    setLives(3);
    setResult(null);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    
    if (mode === "contraReloj") {
      setTimeLeft(10);
      setIsTimerActive(true);
    }
  };

  const handleSubmit = () => {
    if (selected === "") return;
    
    const isCorrect = selected === gameQuestions[currentQuestion].correct;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 1);
      
      // Manejar racha para modo sin fin
      if (gameMode === "sinFin") {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);
      }
    } else {
      setIncorrectAnswers(prev => prev + 1);
      
      if (gameMode === "supervivencia") {
        setLives(prev => prev - 1);
        if (lives - 1 === 0) {
          setFinished(true);
          setResult("¡Sin vidas! Juego terminado.");
          return;
        }
      }
      
      // En modo sin fin, un error termina el juego
      if (gameMode === "sinFin") {
        setFinished(true);
        return;
      }
    }

    setResult(isCorrect ? "¡Correcto!" : `Incorrecto. Respuesta: ${gameQuestions[currentQuestion].correct}`);
    advanceGame();
  };

  const advanceGame = () => {
    setTimeout(() => {
      if (gameMode === "sinFin" && !finished) {
        // Modo sin fin avanza a la siguiente pregunta automáticamente
        if (currentQuestion + 1 < gameQuestions.length) {
          setCurrentQuestion(prev => prev + 1);
          setSelected("");
          setResult(null);
        } else {
          // Si se acaban las preguntas, reiniciar con nuevas aleatorias
          const newQuestions = shuffleQuestions(allQuestions.length);
          setGameQuestions(newQuestions);
          setCurrentQuestion(0);
          setSelected("");
          setResult(null);
        }
      } else if (currentQuestion + 1 < gameQuestions.length && !(gameMode === "supervivencia" && lives === 0)) {
        setCurrentQuestion(prev => prev + 1);
        setSelected("");
        setResult(null);
        if (gameMode === "contraReloj") setTimeLeft(10);
      } else {
        setFinished(true);
        setIsTimerActive(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans items-center">
      <header className="w-full max-w-6xl px-4 mt-6">
        <div className="flex justify-between items-center p-4 bg-purple-700/90 text-white shadow-xl rounded-2xl">
          <button
            onClick={() => router.push("/")}
            className="p-3 rounded-full bg-white text-purple-700 hover:bg-gray-200 hover:scale-110 transition-all"
            aria-label="Volver al inicio"
          >
            ⬅
          </button>
          <h1 className="text-2xl font-bold text-center">Cognitive Training</h1>
          <nav className="flex space-x-4">
            <button onClick={() => router.push("/")} className="text-white hover:underline text-lg">
              Inicio
            </button>
            <button onClick={() => router.push("/logout")} className="text-white hover:underline text-lg">
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-6xl px-4 flex-grow flex items-start justify-center gap-8 py-8">
        {gameMode && !finished && (
          <div className="hidden md:block bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg w-72 sticky top-8">
            <h3 className="text-white text-xl font-bold mb-6">Estadísticas</h3>
            <div className="space-y-4 text-white text-lg">
              <div className="flex justify-between">
                <span>Modo:</span>
                <span className="font-semibold capitalize">{gameMode}</span>
              </div>
              <div className="flex justify-between">
                <span>Pregunta:</span>
                <span className="font-semibold">{currentQuestion + 1}/{gameQuestions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Correctas:</span>
                <span className="font-semibold text-green-400">{correctAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span>Incorrectas:</span>
                <span className="font-semibold text-red-400">{incorrectAnswers}</span>
              </div>
              {gameMode === "contraReloj" && (
                <div className="flex justify-between">
                  <span>Tiempo:</span>
                  <span className="font-semibold">{timeLeft}s</span>
                </div>
              )}
              {gameMode === "supervivencia" && (
                <div className="flex justify-between items-center">
                  <span>Vidas:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: lives }).map((_, index) => (
                      <span key={index} className="text-red-500 text-2xl">❤️</span>
                    ))}
                  </div>
                </div>
              )}
              {gameMode === "sinFin" && (
                <>
                  <div className="flex justify-between">
                    <span>Racha actual:</span>
                    <span className="font-semibold">{streak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Máxima racha:</span>
                    <span className="font-semibold">{maxStreak}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 max-w-4xl">
          {!gameMode ? (
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl text-center">
              <h2 className="text-white text-3xl mb-8 font-bold">Selecciona modo de juego</h2>
              
              {/* Selector de cantidad de preguntas */}
              <div className="mb-8">
                <label className="text-white text-xl mb-3 block">
                  Cantidad de preguntas:
                </label>
                <div className="flex flex-wrap justify-center gap-2">
                  {[5, 10, 15, 20, 25, 30].map(count => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`px-4 py-3 rounded-lg transition-all ${
                        questionCount === count 
                          ? "bg-purple-500 text-white" 
                          : "bg-white/30 text-white hover:bg-white/40"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-6">
                <button
                  onClick={() => startGame("clásico")}
                  className="bg-purple-500 text-white px-8 py-6 rounded-xl hover:bg-purple-600 transition-all transform hover:scale-105 text-xl"
                >
                  🕰️ Modo Clásico
                  <p className="text-base mt-3 opacity-90">Responde a tu ritmo</p>
                  <p className="text-sm mt-1 opacity-80">{questionCount} preguntas</p>
                </button>
                <button
                  onClick={() => startGame("contraReloj")}
                  className="bg-yellow-500 text-white px-8 py-6 rounded-xl hover:bg-yellow-600 transition-all transform hover:scale-105 text-xl"
                >
                  ⏳ Contra Reloj
                  <p className="text-base mt-3 opacity-90">10 segundos por pregunta</p>
                  <p className="text-sm mt-1 opacity-80">{questionCount} preguntas</p>
                </button>
                <button
                  onClick={() => startGame("supervivencia")}
                  className="bg-red-500 text-white px-8 py-6 rounded-xl hover:bg-red-600 transition-all transform hover:scale-105 text-xl"
                >
                  ❤️ Modo Supervivencia
                  <p className="text-base mt-3 opacity-90">3 vidas, 1 error = perder</p>
                  <p className="text-sm mt-1 opacity-80">{questionCount} preguntas</p>
                </button>
                <button
                  onClick={() => startGame("sinFin")}
                  className="bg-green-500 text-white px-8 py-6 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 text-xl"
                >
                  ∞ Modo Sin Fin
                  <p className="text-base mt-3 opacity-90">Juega hasta cometer un error</p>
                  <p className="text-sm mt-1 opacity-80">Preguntas infinitas</p>
                </button>
              </div>
            </div>
          ) : finished ? (
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl text-center">
              <h2 className="text-white text-3xl mb-6 font-bold">Juego Terminado</h2>
              <p className="text-white text-2xl mb-4">
                Puntuación: {score}/{gameMode === "sinFin" ? streak : gameQuestions.length}
              </p>
              
              {gameMode === "supervivencia" && (
                <p className="text-white text-xl mb-4">Vidas restantes: {lives}</p>
              )}
              
              {gameMode === "sinFin" && (
                <div className="mb-6">
                  <p className="text-white text-2xl mb-2">¡Racha máxima: {maxStreak}!</p>
                  <p className="text-yellow-300 text-xl">Respuestas correctas consecutivas: {streak}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-500/20 p-4 rounded-xl">
                  <p className="text-green-400 text-xl">Correctas: {correctAnswers}</p>
                </div>
                <div className="bg-red-500/20 p-4 rounded-xl">
                  <p className="text-red-400 text-xl">Incorrectas: {incorrectAnswers}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => startGame(gameMode)}
                  className="bg-white text-purple-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-all text-lg"
                >
                  Jugar de nuevo
                </button>
                <button
                  onClick={() => setGameMode(null)}
                  className="bg-purple-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-purple-600 transition-all text-lg"
                >
                  Cambiar modo
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl text-center w-full">
              {gameMode === "contraReloj" && (
                <div className="mb-8">
                  <div className="h-4 bg-gray-200 rounded-full mb-4">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                      style={{ width: `${(timeLeft / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-white font-bold text-2xl">{timeLeft}s restantes</p>
                </div>
              )}

              {gameMode === "supervivencia" && (
                <div className="mb-8 flex justify-center gap-3">
                  {Array.from({ length: lives }).map((_, index) => (
                    <span key={index} className="text-red-500 text-3xl">❤️</span>
                  ))}
                </div>
              )}
              
              {gameMode === "sinFin" && (
                <div className="mb-8 flex justify-center gap-4 items-center">
                  <div className="bg-green-500/30 px-6 py-2 rounded-full">
                    <span className="text-white font-bold text-xl">Racha: {streak}</span>
                  </div>
                  <div className="bg-purple-500/30 px-6 py-2 rounded-full">
                    <span className="text-white font-bold text-xl">Máxima: {maxStreak}</span>
                  </div>
                </div>
              )}

              <h2 className="text-white text-3xl mb-8 font-semibold leading-relaxed">
                {gameQuestions[currentQuestion]?.question}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {gameQuestions[currentQuestion]?.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={`p-5 rounded-xl transition-all text-xl ${
                      selected === option
                        ? "bg-purple-600 scale-105 shadow-lg"
                        : "bg-white/20 hover:bg-white/30"
                    } text-white font-medium hover:shadow-md`}
                    aria-pressed={selected === option}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={selected === ""}
                className={`px-10 py-5 rounded-xl font-bold text-xl transition-all ${
                  selected === ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-white text-purple-600 hover:bg-gray-200 hover:scale-105"
                } shadow-md`}
              >
                Comprobar Respuesta
              </button>

              {result && (
                <div className={`mt-8 p-4 rounded-xl text-xl ${
                  result.includes("Correcto") 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {result}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Panel de estadísticas para móviles */}
      {gameMode && !finished && (
        <div className="md:hidden w-full max-w-4xl px-4 mb-6 bg-white/20 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex flex-wrap justify-around gap-4 text-white">
            <div className="text-center">
              <span className="block text-sm opacity-80">Pregunta</span>
              <span className="font-bold">{currentQuestion + 1}/{gameQuestions.length}</span>
            </div>
            <div className="text-center">
              <span className="block text-sm opacity-80">Correctas</span>
              <span className="font-bold text-green-400">{correctAnswers}</span>
            </div>
            <div className="text-center">
              <span className="block text-sm opacity-80">Incorrectas</span>
              <span className="font-bold text-red-400">{incorrectAnswers}</span>
            </div>
            {gameMode === "contraReloj" && (
              <div className="text-center">
                <span className="block text-sm opacity-80">Tiempo</span>
                <span className="font-bold">{timeLeft}s</span>
              </div>
            )}
            {gameMode === "supervivencia" && (
              <div className="text-center">
                <span className="block text-sm opacity-80">Vidas</span>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: lives }).map((_, index) => (
                    <span key={index} className="text-red-500">❤️</span>
                  ))}
                </div>
              </div>
            )}
            {gameMode === "sinFin" && (
              <>
                <div className="text-center">
                  <span className="block text-sm opacity-80">Racha</span>
                  <span className="font-bold">{streak}</span>
                </div>
                <div className="text-center">
                  <span className="block text-sm opacity-80">Máxima</span>
                  <span className="font-bold">{maxStreak}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="w-full max-w-6xl px-4 pb-6">
        <div className="text-center p-4 bg-purple-700/30 rounded-xl">
          <p className="text-white text-sm">
            © {new Date().getFullYear()} Cognitive Training App. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}