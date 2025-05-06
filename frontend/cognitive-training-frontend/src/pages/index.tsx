// frontend/cognitive-training-frontend/src/pages/index.tsx
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-600 flex flex-col">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-5xl font-bold mb-4">Bienvenido a Cognitive Training</h1>
        <p className="text-white text-xl mb-6">
          Entrena tu mente y mejora tus habilidades cognitivas.
        </p>
      </main>
      <footer className="p-4 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
