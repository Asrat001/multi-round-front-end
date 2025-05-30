# Multi-Round Point Game

A real-time multiplayer game where players compete in multiple rounds to accumulate points. Built with React, TypeScript, and Socket.IO.

## Author
Asrat

## Project Overview
This is a multiplayer game where players join a room and compete in multiple rounds. The game features a spinning wheel that randomly selects winners for each round, with points being awarded to the winners. The game continues for a predetermined number of rounds, and the player with the most points at the end wins.

## Tech Stack
- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, Socket.IO
- Package Manager: pnpm

## Prerequisites
- Node.js (Latest LTS version recommended)
- pnpm (version 10.11.0 or later)
- Git

## Installation

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd multi-round-point
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Running the Application

### Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   pnpm start
   ```
   The server will start on port 3000 by default.

### Frontend Application
1. In a new terminal, navigate to the project root:
   ```bash
   cd multi-round-point
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`

## Configuration and Hardcoded Values

### Frontend
- Default backend URL: `https://multi-round-point-backend.onrender.com or https://multi-round-point-backend-production.up.railway.app`
- Socket.IO connection timeout: 20 seconds
- Reconnection attempts: Infinite (with exponential backoff)
- Wheel spin duration: 4000ms (4 seconds)

### Backend
- Port: 3000 (default)
- Minimum players to start: 4
- Maximum players: 8
- Number of rounds: 5
- Points per win: 1

## Project Structure
```
multi-round-point/
├── src/
│   ├── assets/        # Static assets
│   ├── components/    # React components
│   │   ├── Game.tsx           # Main game component
│   │   ├── JoinGame.tsx       # Player join screen
│   │   ├── PlayerList.tsx     # Player list display
│   │   └── SvgSpinnerWheel.tsx # Spinning wheel component
│   ├── contexts/      # React contexts
│   │   └── SocketContext.tsx  # Socket.IO connection management
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Public static files
└── index.html         # HTML entry point
```

## Design Decisions and Assumptions

1. **Real-time Communication**: Socket.IO was chosen for its reliability in handling real-time bidirectional communication and its built-in fallback mechanisms.

2. **TypeScript**: Used throughout the project for better type safety and developer experience.

3. **Component Structure**: 
   - Separated game logic into distinct components
   - Used React Context for socket management
   - Implemented a custom spinning wheel component using SVG

4. **State Management**:
   - Used React's built-in state management
   - Socket.IO for real-time game state synchronization

5. **UI/UX Decisions**:
   - Responsive design using Tailwind CSS
   - Toast notifications for game events
   - Confetti effects for celebrations
   - Smooth animations for the spinning wheel

## Known Limitations
- The game requires a minimum of 4 players to start
- Maximum of 8 players per game
- The backend server on Render's free tier may have some latency issues
- WebSocket connections might fall back to polling in some cases

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.
