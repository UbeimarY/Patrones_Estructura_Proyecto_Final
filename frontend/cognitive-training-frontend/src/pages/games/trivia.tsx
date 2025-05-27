// src/pages/games/trivia.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";

type GameMode = "clásico" | "contraReloj" | "supervivencia";

const questions = [
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
  { question: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Canberra", "Perth"], correct: "Canberra" }
];

export default function Trivia() {
  const { user } = useAppContext();
  const router = useRouter();
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
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
    setTimeout(() => advanceGame(), 1500);
  };

  const startGame = (mode: GameMode) => {
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
    
    const isCorrect = selected === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 1);
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
    }

    setResult(isCorrect ? "¡Correcto!" : `Incorrecto. Respuesta: ${questions[currentQuestion].correct}`);
    advanceGame();
  };

  const advanceGame = () => {
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length && !(gameMode === "supervivencia" && lives === 0)) {
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
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
      <header className="flex justify-between items-center p-4 bg-purple-700 text-white shadow-md">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-full bg-white text-purple-700 hover:bg-gray-200 hover:scale-110 transition flex items-center justify-center"
        >
          ⬅
        </button>
        <h1 className="text-xl font-bold text-center flex-1">Cognitive Training</h1>
        <nav className="flex space-x-4">
          <button onClick={() => router.push("/")} className="text-white hover:underline">
            Inicio
          </button>
          <button onClick={() => router.push("/logout")} className="text-white hover:underline">
            Cerrar Sesión
          </button>
        </nav>
      </header>

      <main className="flex-grow flex items-start justify-center p-4 gap-6">
        {/* Panel de estadísticas */}
        {gameMode && !finished && (
          <div className="hidden md:block bg-white/20 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-lg w-64 sticky top-4">
            <h3 className="text-white text-lg font-bold mb-4">Estadísticas</h3>
            <div className="space-y-3 text-white">
              <div className="flex justify-between">
                <span>Modo:</span>
                <span className="font-semibold capitalize">{gameMode}</span>
              </div>
              <div className="flex justify-between">
                <span>Pregunta:</span>
                <span className="font-semibold">{currentQuestion + 1}/{questions.length}</span>
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
                <div className="flex justify-between">
                  <span>Vidas:</span>
                  <span className="font-semibold">{lives} ❤️</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {!gameMode ? (
          <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/20 shadow-lg text-center">
            <h2 className="text-white text-2xl mb-6">Selecciona modo de juego</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => startGame("clásico")}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
              >
                🕰️ Modo Clásico
                <p className="text-sm mt-1">Responde a tu ritmo</p>
              </button>
              <button
                onClick={() => startGame("contraReloj")}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-transform transform hover:scale-105"
              >
                ⏳ Contra Reloj
                <p className="text-sm mt-1">10 segundos por pregunta</p>
              </button>
              <button
                onClick={() => startGame("supervivencia")}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105"
              >
                ❤️ Modo Supervivencia
                <p className="text-sm mt-1">3 vidas, 1 error = perder</p>
              </button>
            </div>
          </div>
        ) : finished ? (
          <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/20 shadow-lg text-center">
            <h2 className="text-white text-2xl mb-4">Juego Terminado</h2>
            <p className="text-white text-xl mb-2">
              Puntuación: {score}/{questions.length}
            </p>
            {gameMode === "supervivencia" && (
              <p className="text-white">Vidas restantes: {lives}</p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-green-500/20 p-3 rounded">
                <p className="text-green-400">Correctas: {correctAnswers}</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded">
                <p className="text-red-400">Incorrectas: {incorrectAnswers}</p>
              </div>
            </div>
            <button
              onClick={() => setGameMode(null)}
              className="mt-6 bg-white text-purple-600 font-bold py-2 px-6 rounded hover:bg-gray-200 transition"
            >
              Jugar de nuevo
            </button>
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/20 shadow-lg text-center w-full max-w-2xl">
            {gameMode === "contraReloj" && (
              <div className="mb-4">
                <div className="h-3 bg-gray-200 rounded-full mb-2">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                    style={{ width: `${(timeLeft / 10) * 100}%` }}
                  />
                </div>
                <p className="text-white font-bold text-lg">{timeLeft}s restantes</p>
              </div>
            )}

            {gameMode === "supervivencia" && (
              <div className="mb-4 flex justify-center gap-2">
                {Array.from({ length: lives }).map((_, index) => (
                  <span key={index} className="text-red-500 text-2xl">❤️</span>
                ))}
              </div>
            )}

            <h2 className="text-white text-2xl mb-6">{questions[currentQuestion].question}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelected(option)}
                  className={`p-4 rounded-lg transition-all ${
                    selected === option
                      ? "bg-purple-600 scale-105"
                      : "bg-white/20 hover:bg-white/30"
                  } text-white font-medium`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={selected === ""}
              className={`px-8 py-3 rounded-lg font-bold transition ${
                selected === ""
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-white text-purple-600 hover:bg-gray-200"
              }`}
            >
              Comprobar Respuesta
            </button>

            {result && (
              <div className={`mt-4 p-3 rounded-lg ${
                result.includes("Correcto") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {result}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="p-4 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Cognitive Training App. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}