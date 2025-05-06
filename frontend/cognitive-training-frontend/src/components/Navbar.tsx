// frontend/cognitive-training-frontend/src/components/Navbar.tsx
import Link from 'next/link';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useAppContext();

  return (
    <header className="flex justify-between items-center p-4 bg-purple-600">
      <div className="flex items-center gap-2">
        {/* Asegúrate de tener un logo en public/logo.png */}
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        <span className="text-white text-2xl font-bold">Cognitive Training</span>
      </div>
      <div className="flex gap-4">
        <Link href="/" className="text-white font-semibold hover:underline">
          Inicio
        </Link>
        {!user ? (
          <>
            <Link href="/login" className="text-white font-semibold hover:underline">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="text-white font-semibold hover:underline">
              Registrarse
            </Link>
          </>
        ) : (
          <>
            <Link href="/account" className="text-white font-semibold hover:underline">
              Mi Cuenta
            </Link>
            <button
              onClick={logout}
              className="border border-white text-white font-semibold px-3 py-1 rounded hover:bg-white hover:text-purple-600"
            >
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
}
