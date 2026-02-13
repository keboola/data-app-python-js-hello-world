#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd /app/backend
uv sync

echo "Installing frontend dependencies and building..."
cd /app/frontend
npm install
npm run build

echo "Setup complete!"
