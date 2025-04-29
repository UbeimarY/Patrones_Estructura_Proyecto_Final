// src/components/Navbar.tsx
import Link from 'next/link';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { user, logout } = useAppContext();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold hover:underline">
          Inicio
        </Link>
        { !user ? (
          <>
            <Link href="/login" className="hover:underline">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="hover:underline">
              Registrarse
            </Link>
          </>
        ) : (
          <Link href="/account" className="hover:underline">
            Mi Cuenta
          </Link>
        )}
      </div>
      { user && (
        <button
          onClick={logout}
          className="border border-white px-3 py-1 rounded hover:bg-white hover:text-blue-600"
        >
          Cerrar Sesión
        </button>
      )}
    </nav>
  );
}
