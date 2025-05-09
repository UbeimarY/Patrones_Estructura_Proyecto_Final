import Link from 'next/link';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useAppContext();

  return (
    <header className="flex justify-between items-center p-4 bg-purple-600">
      <div className="flex items-center gap-2">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <span className="text-white text-2xl font-bold">Cognitive Training</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/">
          <span className="text-white font-semibold hover:underline">Inicio</span>
        </Link>
        {user ? (
          <>
            {/* La imagen de perfil (por defecto /profile.png, colócala en public/) actúa como enlace a la cuenta */}
            <Link href="/account">
              <img
                src="/profile.png"
                alt="Perfil"
                className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
              />
            </Link>
            <button
              onClick={logout}
              className="border border-white text-white font-semibold px-3 py-1 rounded hover:bg-white hover:text-purple-600"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <span className="text-white font-semibold hover:underline">Iniciar Sesión</span>
            </Link>
            <Link href="/register">
              <span className="text-white font-semibold hover:underline">Registrarse</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
