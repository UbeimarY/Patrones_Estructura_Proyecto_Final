// src/components/ScoreBoard.tsx
import React, { useEffect, useState } from 'react';
import { getUsers } from '../utils/api';

interface UserScore {
  id: string;
  username: string;
  score: number;
  trainingRoute?: string;
}

export default function ScoreBoard() {
  const [users, setUsers] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Se indica que data es del tipo UserScore[]
        const data = (await getUsers()) as UserScore[];
        // Ordenamos los usuarios de mayor a menor puntaje.
        const sortedUsers = data.sort(
          (a: UserScore, b: UserScore) => b.score - a.score
        );
        setUsers(sortedUsers);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los puntajes");
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div className="p-4">Cargando puntajes...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="font-bold mb-2">Tabla de Líderes</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex justify-between border-b pb-1">
            <span>{user.username}</span>
            <span>{user.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
