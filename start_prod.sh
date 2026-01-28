#!/bin/bash

echo "🛑 Stopping existing servers..."
kill $(lsof -t -i:8000) 2>/dev/null || true
kill $(lsof -t -i:3000) 2>/dev/null || true
sleep 2

echo "🚀 Starting AxiomeraAI (Production Mode)..."

# Start Backend
echo "Starting Backend on port 8000..."
(cd backend && python -m uvicorn main:app --port 8000 > /dev/null 2>&1) &
BACKEND_PID=$!

sleep 2

# Start Frontend
echo "Starting Frontend on port 3000..."
# Ensure build exists
if [ ! -d "frontend/.next" ]; then
    echo "Building Frontend..."
    (cd frontend && npm run build)
fi

(cd frontend && npm start -- -p 3000 -H 0.0.0.0 > /dev/null 2>&1) &
FRONTEND_PID=$!

echo "---------------------------------------------------"
echo "Backend running (PID: $BACKEND_PID)"
echo "Frontend running (PID: $FRONTEND_PID)"
echo "---------------------------------------------------"
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT
wait
