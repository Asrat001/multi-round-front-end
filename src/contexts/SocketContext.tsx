import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  currentPlayerId: string | null;
  telegramUser: TelegramUser | null;
  connect: (playerName: string) => void;
  disconnect: () => void;
  error: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  currentPlayerId: null,
  telegramUser: null,
  connect: () => {},
  disconnect: () => {},
  error: null,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = (playerName: string) => {
    const newSocket = io('https://multi-round-point-backend.onrender.com/', {
      query: { playerName },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      withCredentials: false,
      autoConnect: true,
      forceNew: true,
      path: '/socket.io/',
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      if (newSocket.id) {
        setCurrentPlayerId(newSocket.id);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setCurrentPlayerId(null);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to the game server. Please try again later.');
    });

    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setTelegramUser(null);
      setCurrentPlayerId(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      currentPlayerId,
      telegramUser,
      connect,
      disconnect,
      error
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext); 
