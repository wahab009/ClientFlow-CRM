# Frontend - ClientFlow CRM

React + Vite frontend for ClientFlow CRM.

## Highlights

- Auth flow with login + self-registration
- Protected routes (`/dashboard`, `/clients`, `/tasks`)
- Centralized API layer in `src/api/*` with token interceptor
- Theme system (dark/light mode with localStorage persistence)
- SaaS dashboard UI with responsive layout
- Clients and Tasks full CRUD integration

## Structure

```text
src/
├── api/
├── components/
├── context/
├── pages/
├── utils/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required variable:

- `VITE_API_URL` (example: `http://localhost:5000/api`)

`VITE_API_URL` is required in production builds/runtime and has no localhost fallback in app code.

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run lint` - Run ESLint
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build

## SPA Routing for Deployment

This repo includes:

- `vercel.json` rewrite for Vercel
- `public/_redirects` for Netlify/static SPA hosting
