# Phase 2 Implementation Guide - CRUD Operations & Database Schema

## 🎯 Overview

Phase 2 implements a complete backend API with:
- Full Prisma ORM database schema
- JWT authentication and authorization
- Complete CRUD operations for Users, Clients, and Tasks
- Role-based access control (RBAC)
- Production-ready error handling

---

## 📁 New Files Created

```
backend/
├── src/
│   ├── middleware/
│   │   └── auth.js                    # JWT & role authorization
│   ├── controllers/
│   │   ├── userController.js          # User CRUD operations
│   │   ├── clientController.js        # Client CRUD operations
│   │   └── taskController.js          # Task CRUD operations
│   ├── routes/
│   │   ├── users.js                   # User endpoints
│   │   ├── clients.js                 # Client endpoints
│   │   └── tasks.js                   # Task endpoints
│   ├── utils/
│   │   └── auth.js                    # Password hashing & JWT helpers
│   ├── models/
│   │   └── index.js                   # Updated with Prisma setup
│   └── server.js                      # Updated with new routes
├── prisma/
│   ├── schema.prisma                  # Database schema (already exists)
│   └── seed.js                        # Seed sample data
└── package.json                       # Updated with seed script
```

Root:
- `PHASE_2_CHECKPOINT.md`              # Phase 2 completion checklist
- `API_DOCUMENTATION.md`               # Complete API reference

---

## 🗄️ Database Schema

The Prisma schema includes three main models:

### User Model
```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String   (hashed with bcryptjs)
  role      Role     @default(USER)    # ADMIN or USER
  clients   Client[]                   # User's clients
  tasks     Task[]                     # User's tasks
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Client Model
```prisma
model Client {
  id        String   @id @default(uuid())
  name      String
  email     String?
  phone     String?
  company   String?
  status    String   @default("active")
  assignedTo String
  user      User     @relation(fields: [assignedTo], references: [id])
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Task Model
```prisma
model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      String   @default("pending")
  priority    String   @default("medium")
  userId      String
  clientId    String?
  user        User     @relation(fields: [userId], references: [id])
  client      Client?  @relation(fields: [clientId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🔐 Authentication Flow

### 1. Register New User
```bash
POST /api/users/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123",
  "role": "USER"
}
```

Returns JWT token and user data.

### 2. Login
```bash
POST /api/users/login
Body: {
  "email": "john@example.com",
  "password": "secure123"
}
```

Returns JWT token.

### 3. Use Token in Requests
```bash
GET /api/clients
Header: Authorization: Bearer <token>
```

---

## 🛠️ Setup Instructions

### Step 1: Install Dependencies (if not done)
```bash
cd backend
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/clientflow_crm
```

### Step 3: Create Database and Run Migrations
```bash
# Create and migrate database
npx prisma migrate dev --name init

# Or reset database (destructive)
npx prisma migrate reset
```

### Step 4: Seed Sample Data (Optional)
```bash
npm run seed
```

This creates:
- 1 admin user (admin@clientflow.com)
- 2 regular users
- 3 test clients
- 5 test tasks

### Step 5: Start Backend
```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## 📊 API Endpoints Summary

### User Management
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /api/users/register | No | Public |
| POST | /api/users/login | No | Public |
| GET | /api/users/me | Yes | User |
| GET | /api/users | Yes | Admin |
| GET | /api/users/:id | Yes | User |
| PUT | /api/users/:id | Yes | User/Admin |
| DELETE | /api/users/:id | Yes | Admin |

### Client Management
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /api/clients | Yes | User |
| GET | /api/clients | Yes | User |
| GET | /api/clients/:id | Yes | User |
| PUT | /api/clients/:id | Yes | User |
| DELETE | /api/clients/:id | Yes | User |

### Task Management
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /api/tasks | Yes | User |
| GET | /api/tasks | Yes | User |
| GET | /api/tasks/:id | Yes | User |
| PUT | /api/tasks/:id | Yes | User |
| DELETE | /api/tasks/:id | Yes | User |

---

## 🧪 Quick Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "role": "USER"
  }'
```

### Login (Get Token)
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Create Client (Replace TOKEN)
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Test Company",
    "email": "company@test.com",
    "phone": "+1-555-0000",
    "company": "Test Corp"
  }'
```

### List Clients
```bash
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔒 Security Features

✅ **Password Hashing**: bcryptjs with 10 salt rounds  
✅ **JWT Tokens**: 7-day expiration (configurable)  
✅ **Role-Based Access**: ADMIN and USER roles  
✅ **Authorization Checks**: Users can only access own data  
✅ **Cascading Deletes**: Clients/Tasks cleaned up on user delete  
✅ **Input Validation**: Email format, required fields  
✅ **CORS Protected**: Configurable allowed origins  

---

## 📝 Authentication Credentials (After Seed)

| Email | Password | Role |
|-------|----------|------|
| admin@clientflow.com | admin123 | ADMIN |
| john.sales@clientflow.com | password123 | USER |
| sarah.manager@clientflow.com | password123 | USER |

---

## 🐛 Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists or migrations create it

### JWT Errors
- Verify JWT_SECRET is set in .env
- Check token hasn't expired (7 days default)
- Ensure "Bearer " prefix in Authorization header

### Migration Issues
```bash
# Reset and restart
npx prisma migrate reset
npm run seed
```

### Port Already in Use
```bash
# Change PORT in .env or kill process using port 5000
```

---

## 📚 Additional Documentation

- [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) - Complete API reference
- [PHASE_2_CHECKPOINT.md](../PHASE_2_CHECKPOINT.md) - Completion checklist
- [Prisma Docs](https://www.prisma.io/docs/) - ORM documentation
- [JWT Handbook](https://auth0.com/resources/whitepapers/jwt-handbook) - JWT concepts

---

**Last Updated**: April 13, 2026  
**Phase 2 Status**: ✅ Complete - Ready for Phase 3 (Frontend Integration)
