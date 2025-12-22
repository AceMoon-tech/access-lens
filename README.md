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

### Development

1. Create a `.env` file in the root directory:
   ```bash
   # Create .env file
   touch .env
   ```

2. Add environment variables to `.env`:
   ```env
   # API Configuration
   # Base URL for API requests (defaults to '/api' if not set)
   VITE_API_BASE_URL=/api
   
   # Note: OPENAI_API_KEY is server-side only
   # For local development with Vercel CLI, set it via:
   # vercel env add OPENAI_API_KEY
   ```

**Development Variables:**
- `VITE_API_BASE_URL` (optional) - API base URL, defaults to `/api` for relative paths
- `OPENAI_API_KEY` - Server-side only, set in your local serverless function environment

### Production (Vercel)

Configure environment variables in the Vercel dashboard or via CLI:

**Required:**
- `OPENAI_API_KEY` - OpenAI API key for audit service (used by serverless function in `/api`)

**Optional:**
- `VITE_API_BASE_URL` - API base URL (defaults to `/api` if not set)
  - Use `/api` for same-domain API routes (default)
  - Use full URL (e.g., `https://api.example.com`) if API is on different domain

**Environment Variable Notes:**
- Variables prefixed with `VITE_` are exposed to the client-side code
- `OPENAI_API_KEY` is server-side only (used in `/api/run-audit.js`)
- Never commit `.env` files with real API keys
- Use Vercel's environment variable settings for production secrets

## Deployment

### Vercel

This project is configured for Vercel deployment.

**Build Configuration:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite

**Serverless Functions:**
- API routes are located in `/api` directory
- `api/run-audit.js` - Handles audit requests via OpenAI

**Deployment Steps:**

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard:
   - `OPENAI_API_KEY` (required) - OpenAI API key for audit service
   - `VITE_API_BASE_URL` (optional) - API base URL, defaults to `/api` if not set
4. Deploy

Vercel will automatically detect the Vite framework and use the configuration from `vercel.json`.

**Configuration Details:**

- **Build Command:** `npm run build` (defined in `vercel.json`)
- **Output Directory:** `dist` (Vite's default output)
- **Framework:** Vite (auto-detected)
- **API Routes:** Serverless functions in `/api` directory are automatically deployed
- **SPA Routing:** All non-API routes are rewritten to `/index.html` for client-side routing

**Manual Deployment via CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

**API Routes:**

Serverless functions are located in the `/api` directory:
- `/api/run-audit.js` - Handles audit requests via OpenAI API

API routes are automatically deployed as Vercel serverless functions and accessible at `/api/*` endpoints.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
