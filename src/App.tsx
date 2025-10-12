import { useEffect } from 'react';
import { Game } from './components/Game';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  // Set Telegram Mini App theme and viewport
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Set theme colors
      tg.setHeaderColor('#ffffff');
      tg.setBackgroundColor('#f9fafb');
      // Expand the app to full height
      tg.expand();
      // Show back button if needed
      tg.BackButton.hide();
      // Handle theme changes
      tg.onEvent('themeChanged', () => {
        // Theme changed, you can update your app colors here if needed
      });
    }
  }, []);

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-rubik-mono">
        <div className="container py-8">
          <Game />
        </div>
      </div>
    </SocketProvider>
  );
}

export default App;
