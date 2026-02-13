#!/bin/bash
set -euo pipefail

echo "=== Installing backend dependencies ==="
cd /app/backend
uv sync

echo "=== Installing frontend dependencies ==="
cd /app/frontend

# Enable yarn via corepack (bundled with Node.js)
corepack enable
corepack prepare yarn@stable --activate

yarn install

echo "=== Building frontend ==="
yarn build

echo "=== Setup complete ==="
