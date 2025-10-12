import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { TelegramLogin } from './TelegramLogin';
import { SvgSpinnerWheel } from './SvgSpinnerWheel';
import toast, { Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { PlayerList } from './PlayerList';
import { GameStatus } from './GameStatus';

interface Player {
  id: string;
  name: string;
  score: number;
  isSpinning?: boolean;
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

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'];

export const Game = () => {
  const { socket, isConnected, currentPlayerId, telegramUser } = useSocket();
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    isGameActive: false,
    currentRound: 0,
    totalRounds: 0,
    winners: [],
    roundWinner: null,
    gameStatus: 'waiting',
  });
  const [gameError, setGameError] = useState<string>('');
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (!socket) return;

    socket.on('player_update', (data: { players: Player[] }) => {
      setGameState(prev => ({ ...prev, players: data.players }));
      setGameError('');
    });

    socket.on('player_left', (data: { name: string }) => {
      toast(`${data.name} has left the game.`, { icon: '👋', className: 'toast' });
    });

    socket.on('game_start', (data: { totalRounds: number }) => {
      setGameState(prev => ({
        ...prev,
        isGameActive: true,
        totalRounds: data.totalRounds,
        currentRound: 1,
        gameStatus: 'starting',
      }));
      setGameError('');
    });

    socket.on('new_round', (data: { round: number; totalRounds: number }) => {
      setGameState(prev => ({
        ...prev,
        currentRound: data.round,
        gameStatus: 'in_progress',
        players: prev.players.map(p => ({ ...p, isSpinning: true })),
        roundWinner: null,
      }));
      // Don't select winner locally - wait for server
      setSpinning(true);
    });

    socket.on('round_result', (data: { winner: Player; players: Player[] }) => {
      setGameState(prev => ({
        ...prev,
        players: data.players.map(p => ({ ...p, isSpinning: false })),
        roundWinner: data.winner,
      }));
      // Set winner index from server winner
      const winnerIdx = data.players.findIndex(p => p.id === data.winner.id);
      setWinnerIndex(winnerIdx);
      setSpinning(false);
    });

    socket.on('game_over', (data: { players: Player[]; winners: Player[] }) => {
      setGameState(prev => ({
        ...prev,
        isGameActive: false,
        players: data.players,
        winners: data.winners,
        gameStatus: 'finished',
      }));
    });

    socket.on('player_joined', (data: { name: string }) => {
      toast(`${data.name} joined the game!`, { icon: '🎉', className: 'toast toast-success' });
    });

    socket.on('connect_error', () => {
      setGameError('Failed to connect to the game server');
    });

    return () => {
      socket.off('player_update');
      socket.off('game_start');
      socket.off('new_round');
      socket.off('round_result');
      socket.off('game_over');
      socket.off('connect_error');
    };
  }, [socket, gameState.players.length]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartGame = () => {
    if (socket) {
      socket.emit('start_game', (response: { success: boolean; message?: string }) => {
        if (!response.success) {
          setGameError(response.message || 'Failed to start game');
        }
      });
    }
  };

  const handleSpinEnd = () => {
    setSpinning(false);
    setWinnerIndex(null);
    // Server already handles winner selection and emission
  };

  if (!isConnected) {
    return <TelegramLogin />;
  }

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

  // Prepare segments for the spinner
  const segments = gameState.players.map((p, i) => ({
    label: p.name,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <Toaster position="top-center" />
      {gameState.gameStatus === 'finished' &&
        gameState.winners.some(w => w.id === currentPlayerId) && (
        <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={400} recycle={false} />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Multi-Round Game</h1>
        <div className="text-sm text-gray-600">
          Players: {gameState.players.length}/4
          {telegramUser && (
            <span className="ml-2 text-blue-600">
              • You: {telegramUser.first_name}
            </span>
          )}
        </div>
      </div>
      
      {gameError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {gameError}
        </div>
      )}

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-center text-lg font-semibold text-blue-700">
          {getStatusMessage()}
        </p>
      </div>

      {gameState.isGameActive && (
        <div className="flex flex-col items-center mb-8">
          <SvgSpinnerWheel
            segments={segments}
            winnerIndex={winnerIndex}
            spinning={spinning}
            onSpinEnd={handleSpinEnd}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlayerList players={gameState.players} currentPlayerId={currentPlayerId || ''} />
        <GameStatus gameState={gameState} onStartGame={handleStartGame} socket={socket} error={gameError} />
      </div>
    </div>
  );
}; 