// src/pages/games/trivia.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../../context/AppContext';

export default function Trivia() {
  const { user } = useAppContext();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  const question = "¿Cuál es la capital de Francia?";
  const options = ["París", "Londres", "Berlín", "Madrid"];
  const correct = "París";
  
  const [selected, setSelected] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  
  const handleSubmit = () => {
    if (selected === "") return;
    if (selected === correct) {
      setResult("¡Correcto!");
    } else {
      setResult("Incorrecto. La respuesta correcta es París.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 flex flex-col font-sans">
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
                className={`w-full py-2 px-4 rounded ${selected === option ? 'bg-purple-600 text-white' : 'bg-white/20 text-white'} hover:bg-purple-700 transition`}
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
        <p className="text-white text-sm">© {new Date().getFullYear()} Cognitive Training App. All rights reserved.</p>
      </footer>
    </div>
  );
}
