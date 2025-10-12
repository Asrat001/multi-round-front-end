import { useEffect, useState } from 'react';
import { init, retrieveLaunchParams } from '@telegram-apps/sdk';

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
      // Initialize Telegram Mini App SDK
      init();

      // Retrieve launch parameters from Telegram
      const launchParams = retrieveLaunchParams();

      if (launchParams && launchParams.initData && (launchParams.initData as any).user) {
        setUser((launchParams.initData as any).user as TelegramUser);
        setIsAuthenticated(true);
      } else {
        setError('No Telegram user data available. Please open this app through Telegram.');
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
