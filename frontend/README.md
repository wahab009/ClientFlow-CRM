# Frontend - ClientFlow CRM

React + Vite frontend application for ClientFlow CRM.

## 📁 Folder Structure

```
src/
├── components/      # Reusable React components
├── pages/           # Page components (Dashboard, Clients, etc)
├── services/        # API communication layer
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── context/         # React Context for state management
├── App.jsx          # Main app component
├── main.jsx         # React entry point
└── index.css        # Global styles
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

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔧 Configuration

### Environment Variables
- `VITE_API_URL` - Backend API URL (default: `http://localhost:5000/api`)

### Vite Configuration
- Port: `3000`
- API Proxy: Routes `/api` requests to backend
- React Fast Refresh enabled

## 📡 API Integration

The frontend uses Axios for API communication:

```javascript
import apiClient from './services/api'

// Example usage
const health = await checkHealth()
```

All requests automatically include JWT token from localStorage if available.

## 🎯 Current Features

- ✅ Dashboard page with stats
- ✅ Clients page (ready for implementation)
- ✅ API health check
- ✅ React Router navigation
- ✅ Axios client with interceptors

## 📝 Development Notes

- Hot reload works automatically on file changes
- Environment variables must start with `VITE_` to be exposed to client
- All API calls go through the `apiClient` for consistent error handling
- Tokens stored in localStorage for persistence

## 🚀 Deployment

To build for production:
```bash
npm run build
npm run preview
```

Build output in `dist/` directory is ready for deployment to Vercel, Netlify, etc.
