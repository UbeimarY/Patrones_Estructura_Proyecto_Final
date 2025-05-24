import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Account() {
  const { user } = useAppContext();
  const router = useRouter();

  // Si no hay usuario, redirige a login
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Mientras no se recupere la información del usuario, no se renderiza la página
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <Navbar />

      {/* Contenedor principal */}
      <div className="container mx-auto p-4">
        {/* Tarjeta del perfil con portada y avatar */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative">
            {/* Imagen de portada */}
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: "url('/cover.jpg')" }}
            ></div>
            {/* Avatar superpuesto */}
            <div className="absolute inset-0 flex justify-center">
              <img
                src="/profile.png"
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg -mt-16"
              />
            </div>
          </div>
          {/* Información del usuario */}
          <div className="px-6 py-8 mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h2>
            <div className="mt-4 text-gray-700">
              <p>
                <span className="font-semibold">Usuario:</span> {user.username}
              </p>
              <p>
                <span className="font-semibold">Puntaje:</span> {user.score} puntos
              </p>
              <p>
                <span className="font-semibold">Ruta de entrenamiento:</span>{" "}
                {user.trainingRoute ? user.trainingRoute : "Aún no definido"}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de juegos jugados recientemente */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Juegos jugados recientemente</h3>
          {/* Aquí podrías mapear los juegos jugados; por ahora, mostramos un mensaje de placeholder */}
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-600">No hay juegos jugados recientemente.</p>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <footer className="py-4 text-center bg-gray-200 mt-8">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
