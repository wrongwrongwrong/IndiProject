#!/bin/bash

# GameServer Pro - Local Development Startup Script

echo "🚀 Starting GameServer Pro Local Development Server"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Run: brew install node"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd backend && npm install
    cd ..
fi

# Start the local server
echo "🌟 Starting local development server..."
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "💰 Wallet:   http://localhost:3000/wallet"
echo "📊 Dashboard: http://localhost:3000/dashboard"
echo "🔧 API Health: http://localhost:3000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd backend && node local-server.js
