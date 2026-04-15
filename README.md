# ClientFlow CRM

A production-grade Client Management Dashboard built with React, Node.js, Express, PostgreSQL, and Prisma ORM.

## 🎯 Project Overview

**ClientFlow CRM** is a full-stack SaaS application designed to manage clients, projects, and relationships with modern scalable architecture. It supports JWT auth, role-based access, client & task management, file uploads, search, and dashboard analytics.

### Key Features (Planned)
- 👥 Client Management Dashboard
- 📊 Sales Pipeline & Project Tracking
- 💼 Team Collaboration
- 📈 Analytics & Reporting
- 🔐 JWT-based Authentication
- 🚀 Production-ready Architecture

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | React | 18.2+ |
| Build Tool | Vite | 5.0+ |
| Backend API | Express | 4.18+ |
| Database | PostgreSQL | 12+ |
| ORM | Prisma | 5.7+ |
| Authentication | JWT | 9.1+ |

## 📦 Project Structure

- **frontend/** - React + Vite application with clean component architecture
- **backend/** - Express API with Prisma ORM and scalable folder structure
- **shared/** - Shared utilities and configurations (when needed)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Installation & Setup

Follow the comprehensive setup guide:

**[See SETUP_GUIDE.md for detailed instructions](./SETUP_GUIDE.md)**

#### TL;DR:
```bash
# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev

# Backend (in new terminal)
cd backend
npm install
cp .env.example .env
# ⚠️ Set DATABASE_URL in .env (see SETUP_GUIDE.md)
npm run dev
```

## 📝 Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev          # Start with hot reload at http://localhost:5000
npm run start        # Start production server
```

## ✅ Phase 1 Status: Setup & Architecture

- ✅ Frontend structure created (React + Vite)
- ✅ Backend structure created (Express + Node.js)
- ✅ Health check endpoint implemented
- ✅ API client setup with Axios
- ✅ Environment configuration prepared
- ✅ Prisma ORM initialized
- ✅ Database creation (manual step required - see SETUP_GUIDE.md)

## ✅ Phase 2 Status: Schema & CRUD Operations

- ✅ Complete database schema (User, Client, Task models)
- ✅ Authentication system (JWT + bcryptjs)
- ✅ User management APIs (register, login, profile)
- ✅ Client management APIs (CRUD operations)
- ✅ Task management APIs (CRUD operations)
- ✅ Role-based access control (RBAC)
- ✅ Authorization middleware
- ✅ Production-ready error handling

## ⏳ Phase 3: Frontend Integration & Dashboard (Coming Soon)

- Client/Dashboard pages implementation
- Frontend API integration
- Real-time updates with WebSocket
- Advanced filtering and search

## 📚 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Comprehensive setup and verification guide

## 🔐 Security Notes

- `.env` files contain sensitive credentials and are in `.gitignore`
- Never commit `.env` files to version control
- Change JWT_SECRET in production
- Keep dependencies updated: `npm audit` & `npm update`

## 🐛 Troubleshooting

See [SETUP_GUIDE.md - Troubleshooting](./SETUP_GUIDE.md#-troubleshooting) section for common issues and solutions.

## 🎓 Architecture Decisions

### Frontend
- **Vite**: Fast build tool with HMR for optimal DX
- **React Router**: Industry-standard client-side routing
- **Axios**: HTTP client with interceptors for auth tokens
- **Context API**: For state management (can upgrade to Redux if needed)

### Backend
- **Express**: Lightweight, battle-tested framework
- **Prisma**: Type-safe ORM with automatic migrations
- **JWT**: Stateless authentication
- **CORS**: Secured cross-origin requests

## 📈 Scalability Considerations

✅ Implemented from the start:
- Modular folder structure for easy scaling
- Separation of concerns (controllers, routes, middleware)
- Environment-based configuration
- Error handling middleware
- Service layer pattern for API calls

## 🚀 Deployment Ready

This project is structured for easy deployment to:
- Heroku, Railway, or similar for backend
- Vercel, Netlify for frontend
- AWS RDS for managed PostgreSQL

---

**Status**: Phase 2 Complete - Ready for Frontend Integration with APIs

Last Updated: April 13, 2026
