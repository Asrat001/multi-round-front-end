import { Game } from './components/Game';
import { SocketProvider } from './contexts/SocketContext';

function App() {
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
