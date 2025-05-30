// src/components/Navbar.tsx
import Link from 'next/link';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  // Extraemos del contexto global el usuario logueado y la función logout.
  // En el proceso de login (a través del backend) se actualiza este estado.
  const { user, logout } = useAppContext();

  // Función de logout. Aquí podrás, si lo deseas, llamar a un endpoint del backend
  // que invalide la sesión en el servidor; en este ejemplo se simplifica: se limpia el contexto.
  const handleLogout = () => {
    // Si cuentas con un endpoint para logout, podrías hacer:
    // await axios.post(`${API_BASE_URL}/api/auth/logout`);
    logout(); // Limpia el estado global del usuario.
  };

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
            {/* Al loguearse, los datos del usuario se obtienen del backend y se almacenan en el contexto */}
            <Link href="/account">
              <img
                // Se utiliza el avatar del usuario (o una imagen default)
                src={user.avatar || '/images/avatar/default-avatar.png'}
                alt="Perfil"
                className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
              />
            </Link>
            <span
              onClick={handleLogout}
              className="cursor-pointer text-white font-semibold hover:underline transition"
            >
              Cerrar Sesión
            </span>
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
