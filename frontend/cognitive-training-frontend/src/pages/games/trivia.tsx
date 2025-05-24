// src/pages/games/trivia.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";

export default function Trivia() {
  const { user, authLoaded } = useAppContext();
  const router = useRouter();

  const [selected, setSelected] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (authLoaded && !user) router.push("/login");
  }, [user, authLoaded, router]);

  const isLoading = !authLoaded;

  const question = "¿Cuál es la capital de Francia?";
  const options = ["París", "Londres", "Berlín", "Madrid"];
  const correct = "París";

  const handleSubmit = () => {
    if (selected === "") return;
    setResult(selected === correct ? "¡Correcto!" : "Incorrecto. La respuesta correcta es París.");
  };

  return isLoading ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-blue-700 font-sans">
      <p className="text-white text-xl">Cargando...</p>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
      <BackButton />
      <Navbar />
      <header className="p-4">
        <h1 className="text-white text-3xl font-bold text-center">Trivia</h1>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg border border-white/20 shadow-lg text-center">
          <h2 className="text-white text-2xl mb-4">{question}</h2>
          <div className="flex flex-col gap-2 mb-4">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`w-full py-2 px-4 rounded transition ${
                  selected === option ? "bg-purple-600 text-white" : "bg-white/20 text-white"
                } hover:bg-purple-700`}
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
        </div>
      </main>
      <footer className="p-4 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
