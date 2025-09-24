#!/bin/bash

# Permit Office Finder - Development Startup Script
# This script starts both frontend and backend servers simultaneously

echo "🚀 Starting Permit Office Finder Development Environment..."
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected structure: permit-office-finder/"
    echo "   ├── frontend/"
    echo "   └── backend/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "   Please install npm (comes with Node.js)"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install frontend dependencies
echo "   Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install frontend dependencies"
        exit 1
    fi
fi
cd ..

# Install backend dependencies
echo "   Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install backend dependencies"
        exit 1
    fi
fi
cd ..

echo "✅ Dependencies installed successfully!"
echo ""

# Start backend server
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 5

echo ""
echo "🎉 Development servers started successfully!"
echo ""
echo "📱 Frontend: http://localhost:3000 (or next available port)"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "💡 Tips:"
echo "   - Press Ctrl+C to stop both servers"
echo "   - Check the terminal output for any errors"
echo "   - Frontend will automatically reload on file changes"
echo "   - Backend will automatically restart on file changes"
echo ""
echo "🔄 Waiting for servers to be ready..."

# Wait for servers to be ready
sleep 5

echo "✅ Servers are ready! Open your browser and start developing!"
echo ""

# Keep the script running and show logs
echo "📋 Server logs (Press Ctrl+C to stop):"
echo "=========================================="

# Wait for user to stop the servers
wait
