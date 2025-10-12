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
    console.log('[useTelegramAuth] Initializing Telegram authentication');

    const initializeAuth = () => {
      console.log('[useTelegramAuth] Checking Telegram WebApp:', {
        telegramWebAppAvailable: !!window.Telegram?.WebApp,
        initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe,
        userData: window.Telegram?.WebApp?.initDataUnsafe?.user,
        timestamp: new Date().toISOString(),
      });

      // Check for Telegram user
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const tg = window.Telegram.WebApp;
        const tgUser = tg.initDataUnsafe.user;

        if (tgUser) {
          console.log('[useTelegramAuth] Telegram user found:', {
            id: tgUser.id,
            username: tgUser.username,
            first_name: tgUser.first_name,
            timestamp: new Date().toISOString(),
          });

          setUser(tgUser as TelegramUser);
          setIsAuthenticated(true);
          setError(null);
        }
      } else {
        console.log('[useTelegramAuth] No Telegram user data found');

        // Check if in development mode
        const urlParams = new URLSearchParams(window.location.search);
        const isDevMode = urlParams.get('dev') === 'true';

        if (isDevMode) {
          console.log('[useTelegramAuth] Development mode - creating mock user');
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
          console.log('[useTelegramAuth] Not in Telegram and not dev mode');
          setError('This app must be opened through Telegram. Please use the Telegram bot to access this game.');
        }
      }

      setIsReady(true);
      console.log('[useTelegramAuth] Authentication check complete');
    };

    // Use the same timing as the working codebase - 5 second delay for Telegram
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      console.log('[useTelegramAuth] Telegram detected, waiting 5 seconds before auth check');
      const timer = setTimeout(initializeAuth, 5000);
      return () => clearTimeout(timer);
    } else {
      console.log('[useTelegramAuth] No Telegram detected, checking immediately');
      initializeAuth();
    }
  }, []);

  return {
    user,
    isReady,
    isAuthenticated,
    error,
  };
};
