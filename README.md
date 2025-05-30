# Multi-Round Point Game

A modern web-based multiplayer game built with React, TypeScript, and Socket.IO, featuring real-time interactions and a beautiful UI powered by Tailwind CSS.

## 🚀 Features

- Real-time multiplayer gameplay
- Modern and responsive UI with Tailwind CSS
- Type-safe development with TypeScript
- Hot reloading for development
- Toast notifications for user feedback
- Confetti effects for celebrations

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- Socket.IO Client
- Tailwind CSS
- React Hot Toast
- React Confetti

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- pnpm (version 10.11.0 or later)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd multi-round-point
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```
   This will start the development server at `http://localhost:5173`

4. **Build for production**
   ```bash
   pnpm build
   ```

5. **Preview production build**
   ```bash
   pnpm preview
   ```

## 📁 Project Structure

```
multi-round-point/
├── src/
│   ├── assets/        # Static assets
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Public static files
├── index.html         # HTML entry point
└── vite.config.ts     # Vite configuration
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🔧 Configuration

The project uses several configuration files:
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.ts` - Vite build tool configuration
- `eslint.config.js` - ESLint configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing fast build tool
- Tailwind CSS team for the utility-first CSS framework
