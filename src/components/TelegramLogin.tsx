import { useEffect } from 'react';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import { useSocket } from '../contexts/SocketContext';
import toast from 'react-hot-toast';

export const TelegramLogin = () => {
  const { user, isReady, isAuthenticated, error: authError } = useTelegramAuth();
  const { connect, isConnected, error: socketError } = useSocket();

  useEffect(() => {
    if (isReady && isAuthenticated && user && !isConnected) {
      // Auto-connect when Telegram auth is ready and user is authenticated
      connect(user);
      toast.success(`Welcome, ${user.first_name}!`);
    }
  }, [isReady, isAuthenticated, user, isConnected, connect]);

  if (!isReady) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Initializing Telegram...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Authentication Error</p>
          <p className="text-sm mt-1">{authError}</p>
        </div>
        <p className="text-gray-600 text-sm">
          Please make sure you're opening this app through Telegram.
        </p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {user.first_name}!
          </h2>
          {user.username && (
            <p className="text-gray-600 text-sm">@{user.username}</p>
          )}
        </div>

        {!isConnected && !socketError && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
        )}

        {socketError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            <p className="font-semibold">Connection Error</p>
            <p className="text-sm">{socketError}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};
