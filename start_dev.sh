#!/bin/bash

echo "🛑 Stopping existing servers..."
# Kill any existing processes on ports 8000 and 3000
kill $(lsof -t -i:8000) 2>/dev/null || true
kill $(lsof -t -i:3000) 2>/dev/null || true

# Wait for ports to clear
sleep 2

echo "🚀 Setting up AxiomeraAI..."

# Install Backend Dependencies (Quietly)
if [ ! -d "backend/venv" ]; then
    echo "Installing Backend Dependencies..."
    cd backend
    pip install -r requirements.txt > /dev/null 2>&1
    cd ..
fi

# Install Frontend Dependencies (Quietly)
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing Frontend Dependencies..."
    cd frontend
    npm install > /dev/null 2>&1
    cd ..
fi

echo "✅ Setup Complete. Starting Servers..."

# Start Backend
echo "Starting Backend on port 8000..."
cd backend
python -m uvicorn main:app --reload --port 8000 > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to initialize
sleep 3

# Start Frontend (Dev Mode)
echo "Starting Frontend on port 3000..."
cd frontend
npm run dev -- -p 3000 -H 0.0.0.0 > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

echo "---------------------------------------------------"
echo "Backend running (PID: $BACKEND_PID)"
echo "Frontend running (PID: $FRONTEND_PID)"
echo "---------------------------------------------------"
echo "Press Ctrl+C to stop both servers."

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# Keep script running
wait
