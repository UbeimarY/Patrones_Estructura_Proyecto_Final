// src/pages/games/[type].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GameCard, { Game } from '../../components/GameCard';
import { getGameByType } from '../../utils/api';

export default function GamesByType() {
  const router = useRouter();
  const { type } = router.query;
  
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadGames() {
      if (type && typeof type === 'string') {
        try {
          setLoading(true);
          // Se castea el valor devuelto a Game[]
          const fetchedGames = (await getGameByType(type)) as Game[];
          setGames(fetchedGames);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching games by type:", err);
          setError("No se pudieron cargar los juegos");
          setLoading(false);
        }
      }
    }
    loadGames();
  }, [type]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Juegos para: {type}</h1>
      {loading && <p>Cargando juegos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
