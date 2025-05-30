// src/pages/login.tsx
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../context/AppContext";
import { loginUser } from "../utils/api";

// Definición de la respuesta del endpoint de login.
interface LoginUserResponse {
  id: string; // Se obtiene como string desde el backend
  username: string;
  score: number;
  avatar?: string;
  trainingRoute?: string; // Puede venir undefined
}

export default function Login() {
  // Se obtiene el método para actualizar el usuario desde el contexto
  const { setUser } = useAppContext();
  
  // Estados locales para los inputs, error y para gestionar la redirección
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const router = useRouter();

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el refresh de la página
    try {
      // Realiza la llamada al endpoint de login mediante la función loginUser.
      // El resultado se fuerza a ser del tipo LoginUserResponse.
      const userResponse = (await loginUser({ username, password })) as LoginUserResponse;
      
      // Se construye el objeto de usuario a partir de la respuesta.
      // Se convierte el id de string a number (según lo que requiere el contexto)
      // y se asegura que trainingRoute tenga un valor (si es undefined, se asigna una cadena vacía).
      const userData = {
        ...userResponse,
        id: Number(userResponse.id),
        trainingRoute: userResponse.trainingRoute || ""
      };
      
      // Se guarda el usuario en el contexto global.
      setUser(userData);
      // Se redirige a la página principal ("/") una vez autenticado.
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-purple-600 flex flex-col font-sans">
      <Navbar />
      <div className="container mx-auto p-8 flex flex-col items-center justify-center">
        <h2 className="text-white text-3xl font-extrabold mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-300 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-purple-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-purple-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-purple-600 font-bold text-xl py-3 px-8 rounded-full transition transform hover:scale-105 duration-300 hover:bg-gray-200"
          >
            INICIAR SESIÓN
          </button>
        </form>
      </div>
    </div>
  );
}
