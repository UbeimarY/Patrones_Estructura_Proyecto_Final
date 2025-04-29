// src/components/GameCard.tsx
import React from 'react';

interface GameCardProps {
  name: string;
  description: string;
}

export default function GameCard({ name, description }: GameCardProps) {
  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="font-bold text-xl">{name}</h3>
      <p className="mt-2">{description}</p>
    </div>
  );
}
