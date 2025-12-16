# AccessLens

A modern React application scaffold built with Vite, React Router, and Tailwind CSS.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Header.jsx
│   ├── Layout.jsx
│   └── Loading.jsx
├── screens/        # Page-level components
│   ├── Home.jsx
│   ├── About.jsx
│   └── NotFound.jsx
├── state/          # State management
│   └── AppContext.jsx
├── lib/            # Utility functions
│   ├── api.js      # API helpers
│   └── utils.js    # General utilities
├── hooks/          # Custom React hooks
│   ├── useDebounce.js
│   └── useLocalStorage.js
├── styles/         # Global styles
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

- ✅ React Router setup with nested routes
- ✅ Context API for global state management
- ✅ Reusable UI components (Button, Card, etc.)
- ✅ Custom hooks (useLocalStorage, useDebounce)
- ✅ API utility functions
- ✅ Tailwind CSS configuration
- ✅ Responsive layout components
- ✅ 404 error page

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=/api
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
