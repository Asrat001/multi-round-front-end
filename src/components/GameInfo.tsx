import type { GameState } from '../types/game';

interface GameInfoProps {
  gameState: GameState;
}

export const GameInfo = ({ gameState }: GameInfoProps) => {
  const getStatusMessage = () => {
    switch (gameState.gameStatus) {
      case 'waiting':
        return 'Waiting for players...';
      case 'starting':
        return 'Game starting...';
      case 'in_progress':
        if (gameState.currentTurn) {
          return `Round ${gameState.currentRound}: ${gameState.currentTurn}'s turn to spin!`;
        }
        return `Round ${gameState.currentRound}: All players spinning!`;
      case 'finished':
        if (gameState.gameWinner) {
          return `Game Over! Winner${gameState.gameWinner.length > 1 ? 's' : ''}: ${gameState.gameWinner.join(', ')}`;
        }
        return 'Game Over!';
      default:
        return '';
    }
  };

  return (
    <div className="game-info">
      <div className="round-info">
        Round {gameState.currentRound} / {gameState.totalRounds}
      </div>
      <div className="status-message">{getStatusMessage()}</div>
      {gameState.roundWinner && (
        <div className="round-winner">
          Round Winner: {gameState.roundWinner}
        </div>
      )}
    </div>
  );
}; 