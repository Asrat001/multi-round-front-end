export interface Player {
  id: string;
  username: string;
  score: number;
  isSpinning: boolean;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  totalRounds: number;
  gameStatus: 'waiting' | 'starting' | 'in_progress' | 'finished';
  currentTurn?: string;
  roundWinner?: string;
  gameWinner?: string[];
  currentPlayerId?: string;
}

export interface WebSocketMessage {
  type: 'new_round' | 'round_result' | 'game_over' | 'player_joined' | 'player_left' | 'error' | 'game_state' | 'get_game_state';
  data: any;
} 