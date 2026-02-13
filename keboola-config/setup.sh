#!/bin/bash
set -euo pipefail

# Debug: show what's available
echo "=== Debug: checking available tools ==="
echo "PATH: $PATH"
which node || echo "node not found in PATH"
which npm || echo "npm not found in PATH"
which yarn || echo "yarn not found in PATH"
ls -la /usr/local/bin/ | head -20 || true

echo "=== Installing Python dependencies ==="
cd /app
uv sync

echo "=== Installing frontend dependencies ==="
cd /app/frontend
npm install

echo "=== Building frontend ==="
npm run build

echo "=== Setup complete ==="
