# ClientFlow CRM

ClientFlow CRM is a full-stack SaaS CRM dashboard built with React + Vite (frontend) and Node.js + Express + Prisma + PostgreSQL (backend).

## Current Capabilities

- JWT authentication with login + self-serve registration
- Role-based access control (USER / ADMIN)
- Clients CRUD with search, filtering, and pagination
- Tasks CRUD with status filters and pagination
- Dashboard metrics powered by API data
- Consistent API responses:
  - Success: `{ success: true, data }`
  - Error: `{ success: false, message }`
- Theme system (dark/light mode persisted in localStorage)
- Modern responsive SaaS UI (navy + purple theme)
- Production hardening:
  - `helmet`
  - auth rate limiting on register/login
  - environment-driven CORS allowlist
  - production-safe seed protection
  - CI workflow (backend + frontend + smoke checks)

## Project Structure

- `frontend/` - React + Vite app
- `backend/` - Express API + Prisma
- `shared/` - shared utilities (if needed)

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# set DATABASE_URL and JWT_SECRET
npm run prisma:migrate
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL (example: http://localhost:5000/api)
npm run dev
```

## Deployment Notes

- Backend:
  - set `NODE_ENV=production`
  - use `npm run prisma:migrate:deploy`
  - do not run `npm run seed` in production
- Frontend:
  - set `VITE_API_URL` for your deployed API
  - SPA rewrites are included (`frontend/vercel.json`, `frontend/public/_redirects`)
