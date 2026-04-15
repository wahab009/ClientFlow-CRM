# Backend - ClientFlow CRM

Express + Node.js backend API for ClientFlow CRM.

## 📁 Folder Structure

```
src/
├── controllers/     # Request handlers for routes
├── routes/          # API route definitions
├── models/          # Database models (Prisma)
├── middleware/      # Express middleware
├── config/          # Configuration files
├── utils/           # Utility functions
└── server.js        # Express entry point
prisma/
└── schema.prisma    # Prisma ORM schema
```

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Create Environment File
```bash
cp .env.example .env
```

### Configure Database Connection
Edit `.env` file and update `DATABASE_URL`:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/clientflow_crm
```

⚠️ **Important**: You must create the database manually before running the server.
See [SETUP_GUIDE.md](../SETUP_GUIDE.md#-database-setup---required-manual-step)

### Start Development Server
```bash
npm run dev
```
Server will run at [http://localhost:5000](http://localhost:5000)

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload (nodemon) |
| `npm run start` | Start production server |
| `npm run build` | No build needed (Node.js) |

## 🔧 Configuration

### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `JWT_SECRET` | JWT signing key | `your_secret_key` |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `CORS_ORIGIN` | Allowed frontend URL | `http://localhost:3000` |

## 🔗 API Endpoints

### Health Check
```
GET /api/health
→ { status: "ok", message: "Server is running", timestamp: "..." }
```

### Future Endpoints (Phase 2)
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

## 🛡️ Middleware

| Middleware | Purpose |
|-----------|---------|
| CORS | Enable cross-origin requests |
| express.json() | Parse JSON bodies |
| express.urlencoded() | Parse form data |

## 🗄️ Database

### Setup Database
```bash
# Create database manually in PostgreSQL
psql -U postgres -c "CREATE DATABASE clientflow_crm;"
```

### Prisma Commands
```bash
# Apply schema changes
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name
```

## 📡 Error Handling

The API includes global error handling:

```javascript
// Errors automatically handled and returned as JSON
{
  error: "Error message",
  status: 400
}
```

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a managed PostgreSQL database
3. Set strong `JWT_SECRET`
4. Configure `CORS_ORIGIN` for production frontend URL
5. Use process manager (PM2, systemd) for process management

Example production variables:
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@prod-db:5432/clientflow_crm
JWT_SECRET=your_strong_production_secret_key
CORS_ORIGIN=https://yourdomain.com
```

## 🔐 Security Notes

- Store sensitive data in environment variables only
- Never commit `.env` to git (in `.gitignore`)
- Validate all user inputs in production
- Use HTTPS in production
- Rotate JWT secrets regularly

## 📝 Development Notes

- Server logs include startup information
- Nodemon auto-restarts on file changes
- CORS is configured for frontend communication
- Error middleware catches all thrown errors
- 404 handler for undefined routes

## 🧪 Testing (Phase 2)

Coming soon: Jest + Supertest for API testing
