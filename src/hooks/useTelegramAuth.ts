import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramAuth {
  user: TelegramUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useTelegramAuth = (): TelegramAuth => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check if running in Telegram Mini App
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        // Check if we have user data
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user as TelegramUser);
          setIsAuthenticated(true);
        } else {
          setError('No Telegram user data available. Please open this app through Telegram.');
        }
      } else {
        // Check if we're in development or direct browser access
        const urlParams = new URLSearchParams(window.location.search);
        const isDevMode = urlParams.get('dev') === 'true';

        if (isDevMode) {
          // Development mode - create a mock user for testing
          setUser({
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'en',
            is_premium: false
          });
          setIsAuthenticated(true);
        } else {
          setError('This app must be opened through Telegram. Please use the Telegram bot to access this game.');
        }
      }

      setIsReady(true);
    } catch (err) {
      console.error('Telegram auth error:', err);
      setError('Failed to initialize Telegram authentication');
      setIsReady(true);
    }
  }, []);

  return {
    user,
    isReady,
    isAuthenticated,
    error,
  };
};
