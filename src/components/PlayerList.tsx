import React from 'react';

interface Player {
  id: string;
  name: string;
  score: number;
  isSpinning?: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string | null;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h2 className="text-xl font-semibold mb-4">Players</h2>
    <div className="space-y-2">
      {players.map(player => (
        <div
          key={player.id}
          className={`p-3 rounded-lg ${
            player.id === currentPlayerId
              ? 'bg-blue-100 border-2 border-blue-500'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {player.name}
              {player.id === currentPlayerId && ' (You)'}
            </span>
            <span className="text-lg font-bold">{player.score}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
); 