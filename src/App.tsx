import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './components/AuthPage';
import { GamePage } from './components/GamePage';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      tg.BackButton.show();

      // Handle theme changes
      tg.onEvent('themeChanged', () => {
        // Theme changed, you can update your app colors here if needed
      });
    }
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/game" replace />
                ) : (
                  <AuthPage onAuthenticated={handleAuthenticated} />
                )
              }
            />
            <Route
              path="/game"
              element={
                isAuthenticated ? (
                  <GamePage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
