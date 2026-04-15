#!/bin/bash

# ClientFlow CRM - Phase 1 Verification Script
# Run this to verify all components are properly installed

echo "======================================"
echo "ClientFlow CRM - Phase 1 Verification"
echo "======================================"
echo ""

# Frontend Checks
echo "📦 Checking Frontend Setup..."
echo ""

if [ -d "frontend/node_modules" ]; then
  echo "✅ Frontend dependencies installed"
else
  echo "❌ Frontend dependencies NOT installed"
  echo "   Run: cd frontend && npm install"
fi

if [ -f "frontend/.env" ]; then
  echo "✅ Frontend .env file exists"
else
  echo "⚠️  Frontend .env file NOT found"
  echo "   Run: cp frontend/.env.example frontend/.env"
fi

if [ -f "frontend/vite.config.js" ]; then
  echo "✅ Frontend Vite config found"
else
  echo "❌ Frontend Vite config NOT found"
fi

echo ""

# Backend Checks
echo "🔧 Checking Backend Setup..."
echo ""

if [ -d "backend/node_modules" ]; then
  echo "✅ Backend dependencies installed"
else
  echo "❌ Backend dependencies NOT installed"
  echo "   Run: cd backend && npm install"
fi

if [ -f "backend/.env" ]; then
  echo "✅ Backend .env file exists"
else
  echo "⚠️  Backend .env file NOT found"
  echo "   Run: cp backend/.env.example backend/.env"
fi

if [ -f "backend/prisma/schema.prisma" ]; then
  echo "✅ Prisma schema file found"
else
  echo "❌ Prisma schema file NOT found"
fi

echo ""

# Database Check
echo "🗄️  Checking Database..."
echo ""

if command -v psql &> /dev/null; then
  echo "✅ PostgreSQL CLI found"
  
  # Try to connect and list databases
  if psql -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw clientflow_crm; then
    echo "✅ Database 'clientflow_crm' exists"
  else
    echo "⚠️  Database 'clientflow_crm' NOT found"
    echo "   You need to create it manually:"
    echo "   psql -U postgres -c 'CREATE DATABASE clientflow_crm;'"
  fi
else
  echo "⚠️  PostgreSQL CLI not found in PATH"
  echo "   Verify PostgreSQL is installed and accessible"
fi

echo ""
echo "======================================"
echo "Verification Complete!"
echo "======================================"
