// src/components/ScoreBoard.tsx
import React from 'react';

interface ScoreBoardProps {
  score: number;
}

export default function ScoreBoard({ score }: ScoreBoardProps) {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="font-bold">Score</h3>
      <p className="text-lg">{score}</p>
    </div>
  );
}
