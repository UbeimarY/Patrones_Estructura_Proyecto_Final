// src/pages/games/trivia.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";

const questions = [
  { question: "¿Cuál es la capital de Japón?", options: ["Seúl", "Tokio", "Pekín", "Bangkok"], correct: "Tokio" },
  { question: "¿Quién escribió 'Cien años de soledad'?", options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Julio Cortázar", "Jorge Luis Borges"], correct: "Gabriel García Márquez" },
  { question: "¿Cuál es el metal más ligero?", options: ["Plata", "Oro", "Litio", "Hierro"], correct: "Litio" },
  { question: "¿En qué año llegó el hombre a la Luna?", options: ["1965", "1969", "1972", "1980"], correct: "1969" },
  { question: "¿Cuál es el océano más grande del mundo?", options: ["Atlántico", "Pacífico", "Índico", "Ártico"], correct: "Pacífico" },
  { question: "¿Qué gas es esencial para la respiración humana?", options: ["Nitrógeno", "Oxígeno", "Hidrógeno", "Dióxido de carbono"], correct: "Oxígeno" },
  { question: "¿Cuál es el planeta más grande del sistema solar?", options: ["Marte", "Júpiter", "Saturno", "Urano"], correct: "Júpiter" },
  { question: "¿Quién pintó 'La última cena'?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], correct: "Leonardo da Vinci" },
  { question: "¿Cuál es el país con mayor población del mundo?", options: ["Estados Unidos", "India", "China", "Brasil"], correct: "China" }
];

export default function Trivia() {
  const { user } = useAppContext();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected === "") return;
    if (selected === questions[currentQuestion].correct) {
      setScore(score + 1);
      setResult("¡Correcto!");
    } else {
      setResult(`Incorrecto. La respuesta correcta es ${questions[currentQuestion].correct}.`);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelected("");
        setResult(null);
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
      {/* Encabezado con botón animado de regreso a la izquierda y opciones alineadas a la derecha */}
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

      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/20 shadow-lg text-center">
          {!finished ? (
            <>
              <h2 className="text-white text-2xl mb-4">{questions[currentQuestion].question}</h2>
              <div className="flex flex-col gap-2 mb-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={`w-full py-2 px-4 rounded ${
                      selected === option ? "bg-purple-600 text-white" : "bg-white/20 text-white"
                    } hover:bg-purple-700 transition`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="bg-white text-purple-600 font-bold py-2 px-4 rounded hover:bg-gray-200 transition"
              >
                Comprobar
              </button>
              {result && <p className="mt-4 text-white">{result}</p>}
            </>
          ) : (
            <>
              <h2 className="text-white text-2xl mb-4">Juego terminado</h2>
              <p className="text-white text-xl mb-4">Puntuación: {score}/{questions.length}</p>
              <p className="text-white text-lg">
                {score >= 7
                  ? "¡Excelente trabajo! 🌟"
                  : score >= 5
                  ? "¡Bien hecho! Sigue practicando. 👍"
                  : "¡No te rindas! Puedes mejorar. 💪"}
              </p>
            </>
          )}
        </div>
      </main>

      <footer className="p-4 text-center">
        <p className="text-white text-sm">© {new Date().getFullYear()} Cognitive Training App. All rights reserved.</p>
      </footer>
    </div>
  );
}

