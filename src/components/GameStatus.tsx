import React from 'react';

interface Player {
  id: string;
  name: string;
  score: number;
}

interface GameState {
  players: Player[];
  isGameActive: boolean;
  currentRound: number;
  totalRounds: number;
  winners: Player[];
  roundWinner: Player | null;
  gameStatus: 'waiting' | 'starting' | 'in_progress' | 'finished';
}

interface GameStatusProps {
  gameState: GameState;
  onStartGame: () => void;
  socket: any;
  error: string;
}

export const GameStatus: React.FC<GameStatusProps> = ({ gameState, onStartGame, socket, error }) => {
  const getStatusMessage = () => {
    switch (gameState.gameStatus) {
      case 'waiting':
        return `Waiting for players... (${gameState.players.length}/4)`;
      case 'starting':
        return 'Game starting...';
      case 'in_progress':
        return gameState.roundWinner
          ? `Round ${gameState.currentRound} Winner: ${gameState.roundWinner.name}!`
          : `Round ${gameState.currentRound}: Spinning...`;
      case 'finished':
        return 'Game Over!';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 font-rubik-mono">Game Status</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-center text-lg font-semibold text-blue-700">
          {getStatusMessage()}
        </p>
      </div>
      {gameState.isGameActive ? (
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            Round {gameState.currentRound} of {gameState.totalRounds}
          </div>
          {gameState.roundWinner && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="font-semibold text-green-700">
                Round Winner: {gameState.roundWinner.name}
              </p>
            </div>
          )}
        </div>
      ) : gameState.winners.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Winners</h3>
          <div className="space-y-2">
            {gameState.winners.map(winner => (
              <div key={winner.id} className="bg-green-100 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{winner.name}</span>
                  <span className="text-lg font-bold">{winner.score}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-6 px-6 py-3 rounded-lg text-lg font-bold uppercase border-4 border-yellow-700 bg-yellow-400 shadow-lg hover:bg-yellow-500 active:translate-y-1 transition-all duration-100 text-gray-900 w-full tracking-widest font-rubik-mono"
            onClick={() => socket && socket.emit('restart_game')}
          >
            Restart Game
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-gray-600 mb-4">
            Waiting for players to join...
          </div>
          <button
            onClick={onStartGame}
            disabled={gameState.players.length < 4}
            className={`px-6 py-3 rounded-lg text-lg font-bold uppercase border-4 border-blue-900 bg-blue-400 shadow-lg tracking-widest transition-all duration-100 text-white w-full font-rubik-mono ${
              gameState.players.length < 4
                ? 'bg-gray-300 border-gray-400 cursor-not-allowed text-gray-500'
                : 'hover:bg-blue-500 active:translate-y-1'
            }`}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}; 