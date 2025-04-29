// src/pages/index.tsx
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">Bienvenido a la Plataforma de Entrenamiento</h1>
        <p className="mt-4">
          Aquí podrás entrenar tu mente y mejorar tus habilidades cognitivas. Regístrate o inicia sesión para ver tu progreso, puntaje y ruta de entrenamiento personalizada.
        </p>
      </div>
    </div>
  );
}
