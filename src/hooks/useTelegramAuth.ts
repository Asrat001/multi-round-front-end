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
    console.log("🔍 useTelegramAuth: Starting authentication check");
    console.log("🔍 useTelegramAuth: window.Telegram exists:", !!window.Telegram?.WebApp);

    const checkTelegramAuth = () => {
      try {
        // Check if running in Telegram Mini App
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          console.log("🔍 useTelegramAuth: Telegram WebApp found");
          console.log("🔍 useTelegramAuth: initDataUnsafe exists:", !!tg.initDataUnsafe);
          console.log("🔍 useTelegramAuth: user data:", tg.initDataUnsafe?.user?.username);

          // Check if we have user data
          if (tg.initDataUnsafe?.user) {
            console.log("✅ useTelegramAuth: User found, setting authenticated");
            setUser(tg.initDataUnsafe.user as TelegramUser);
            setIsAuthenticated(true);
          } else {
            console.log("❌ useTelegramAuth: No user data in Telegram");
            setError('No Telegram user data available. Please open this app through Telegram.');
          }
        } else {
          console.log("❌ useTelegramAuth: Not in Telegram Mini App");
          // Check if we're in development or direct browser access
          const urlParams = new URLSearchParams(window.location.search);
          const isDevMode = urlParams.get('dev') === 'true';
          console.log("🔍 useTelegramAuth: Dev mode check:", isDevMode);

          if (isDevMode) {
            console.log("✅ useTelegramAuth: Dev mode, creating mock user");
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
            console.log("❌ useTelegramAuth: Not Telegram and not dev mode");
            setError('This app must be opened through Telegram. Please use the Telegram bot to access this game.');
          }
        }

        setIsReady(true);
        console.log("✅ useTelegramAuth: Authentication check complete");
      } catch (err) {
        console.error('❌ useTelegramAuth: Error during auth:', err);
        setError('Failed to initialize Telegram authentication');
        setIsReady(true);
      }
    };

    // Initial check
    checkTelegramAuth();

    // Retry after delays in case Telegram WebApp loads slowly
    setTimeout(checkTelegramAuth, 500);
    setTimeout(checkTelegramAuth, 1000);
    setTimeout(checkTelegramAuth, 2000);
  }, []);

  return {
    user,
    isReady,
    isAuthenticated,
    error,
  };
};
