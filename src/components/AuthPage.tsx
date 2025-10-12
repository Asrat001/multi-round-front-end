import { useEffect } from 'react';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import toast from 'react-hot-toast';

interface AuthPageProps {
  onAuthenticated: () => void;
}

export const AuthPage = ({ onAuthenticated }: AuthPageProps) => {
  const { user, isReady, isAuthenticated, error: authError } = useTelegramAuth();

  useEffect(() => {
    if (isReady && isAuthenticated && user) {
      // Authentication successful - notify parent to navigate to game
      toast.success(`Welcome, ${user.first_name}!`);
      onAuthenticated();
    }
  }, [isReady, isAuthenticated, user, onAuthenticated]);

  // Show error if authentication failed
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Authentication Error</p>
            <p className="text-sm mt-1">{authError}</p>
          </div>
          <p className="text-gray-600 text-sm">
            Please make sure you're opening this app through Telegram bot menu.
          </p>
        </div>
      </div>
    );
  }

  // Show authenticated user
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Connecting to game server...</p>
        </div>
      </div>
    );
  }

  // Show loading while initializing
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Telegram...</p>
        </div>
      </div>
    );
  }

  return null;
};
