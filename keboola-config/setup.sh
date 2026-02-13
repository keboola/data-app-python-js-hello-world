#!/bin/bash
set -e

# Ensure /usr/local/bin is in PATH (for npm, node)
export PATH="/usr/local/bin:$PATH"

echo "Installing backend dependencies..."
cd /app/backend
uv sync

echo "Installing frontend dependencies and building..."
cd /app/frontend
yarn install
yarn build

echo "Setup complete!"
