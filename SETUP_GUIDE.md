# ClientFlow CRM - Full Stack Setup Guide

## 📋 Project Structure

```
ClientFlow-CRM/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components (Dashboard, Clients, etc)
│   │   ├── services/         # API communication layer
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   ├── context/          # React Context for state management
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── index.html            # HTML entry point
│   ├── vite.config.js        # Vite configuration
│   └── package.json
│
├── backend/                  # Express + Node.js application
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── models/           # Database models (Prisma)
│   │   ├── middleware/       # Express middleware
│   │   ├── config/           # Configuration files
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Express entry point
│   ├── prisma/
│   │   └── schema.prisma     # Prisma ORM schema
│   └── package.json
│
└── shared/                   # Shared utilities (if needed)
```

## 🚀 Quick Start

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run at `http://localhost:3000`

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

3. **⚠️ CRITICAL: Database Setup Required**
   See [Database Setup](#-database-setup---required-manual-step) section below

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Backend will run at `http://localhost:5000`

## 🗄️ Database Setup - REQUIRED MANUAL STEP

### Prerequisites
- PostgreSQL installed on your machine
- pgAdmin or terminal access to PostgreSQL

### Step 1: Create the Database

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Right-click on Database → Create → Database
3. Enter name: `clientflow_crm`
4. Click Save

**Option B: Using Terminal/Command Line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE clientflow_crm;

# Verify creation
\l

# Exit
\q
```

### Step 2: Configure Environment Variables

In `backend/.env` file, update database connection:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/clientflow_crm

# Other required fields
JWT_SECRET=change_this_to_a_strong_key_in_production
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Important:** Replace `your_password` with your actual PostgreSQL password

### Step 3: Verify Connection

To verify your database connection is working:

1. In the backend directory, ensure `node_modules` includes Prisma
2. Run: `npx prisma db push` (after schema is defined)

## ✅ Phase 1 Checkpoint Verification

### Frontend Checklist
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Browser console has no errors
- [ ] React Router navigation works (can navigate to Dashboard/Clients)
- [ ] "Check API Status" button is visible

### Backend Checklist
- [ ] `npm install` completed successfully
- [ ] `.env` file created and configured
- [ ] `npm run dev` starts on port 5000
- [ ] `http://localhost:5000/api/health` returns JSON response
- [ ] Server console shows: "✅ Server running on http://localhost:5000"

### Database Checklist
- [ ] PostgreSQL installed and running
- [ ] Database `clientflow_crm` created
- [ ] `.env` DATABASE_URL is correct
- [ ] Connection string format: `postgresql://user:password@localhost:5432/clientflow_crm`

## 🔗 API Connection Test

With both frontend and backend running:

1. Frontend at `http://localhost:3000`
2. Click "Check API Status" button
3. Should see: "Server is running"

## 📦 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18.2 |
| Frontend Build | Vite | 5.0 |
| Backend | Express | 4.18 |
| Database | PostgreSQL | Latest |
| ORM | Prisma | 5.7 |
| Auth | JWT | 9.1 |

## 🧪 Development Commands

### Frontend
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Backend
```bash
npm run dev       # Start with hot reload (nodemon)
npm run start     # Start production
```

## 🚨 Troubleshooting

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS_ORIGIN in backend .env matches frontend URL
- Check browser console for errors

### Backend won't start
- Check PORT 5000 is not in use: `lsof -i :5000` (macOS/Linux) or `netstat -ano | findstr :5000` (Windows)
- Verify all dependencies installed: `npm install`
- Check .env file exists and is readable

### Database connection error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env is correct
- Verify database `clientflow_crm` exists: `psql -U postgres -c "\\l"`
- Test connection: `psql -U postgres -d clientflow_crm -c "SELECT 1"`

## 📝 Next Steps (Phase 2)

After Phase 1 is complete and all checkpoints pass:

1. Define Prisma schema for Clients model
2. Create API endpoints for CRUD operations
3. Implement authentication (JWT)
4. Build frontend components for client management
5. Add data validation and error handling

## 📞 Support Notes

- Keep `.env` files secure - never commit to git
- .env files are in `.gitignore` to prevent credential exposure
- Always run `npm install` before starting development
- Use `npm run dev` for development (hot reload)
