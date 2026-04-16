# Backend - ClientFlow CRM

Express + Prisma backend API for ClientFlow CRM.

## Highlights

- JWT auth with bcrypt password hashing
- Forced registration role = `USER` (role not accepted from client payload)
- RBAC middleware for admin-only routes
- Consistent API responses:
  - Success: `{ success: true, data }`
  - Error: `{ success: false, message }`
- Production security middleware:
  - `helmet`
  - auth rate limiting for `/api/users/login` and `/api/users/register`
  - configurable CORS allowlist

## Required Environment Variables

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN` (comma-separated if multiple origins)
- `AUTH_RATE_LIMIT_MAX`
- `AUTH_RATE_LIMIT_WINDOW_MS`

Use `.env.example` as the template.

## Scripts

- `npm run dev` - Start with nodemon
- `npm run start` - Start server
- `npm run lint` - Syntax/lint check
- `npm run build` - Placeholder build
- `npm run prisma:migrate` - Prisma dev migration
- `npm run prisma:migrate:deploy` - Prisma production migration deploy
- `npm run prisma:reset` - Reset database (development)
- `npm run seed` - Seed development/test data (blocked in production)

## API Base

All API routes are under `/api`:

- `/api/health`
- `/api/users/*`
- `/api/clients/*`
- `/api/tasks/*`
