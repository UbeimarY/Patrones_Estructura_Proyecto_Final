// src/pages/games/[type].tsx
import React from 'react';
import { useRouter } from 'next/router';
import GameCard from '../../components/GameCard';
import { fetchGamesByType } from '../../utils/api';

export default function GamesByType() {
  const router = useRouter();
  const { type } = router.query;
  const [games, setGames] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (type) {
      fetchGamesByType(type as string).then(setGames);
    }
  }, [type]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Juegos para: {type}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
