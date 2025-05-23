// src/pages/register.tsx
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../context/AppContext';

export default function Register() {
  const { setUser } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const user = await res.json();
        setUser(user);
        router.push('/account');
      } else {
        setError('Error al registrarse');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-purple-600 flex flex-col font-sans">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <h2 className="text-white text-5xl font-bold mb-4">Registrarse</h2>
        {error && <p className="text-red-300 mb-4">{error}</p>}
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
            REGISTRARSE
          </button>
        </form>
      </main>
      <footer className="p-4 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} Cognitive Training App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
