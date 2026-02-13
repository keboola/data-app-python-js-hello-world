#!/bin/bash
set -euo pipefail

# Debug: show what's available
echo "=== Debug: checking available tools ==="
echo "PATH: $PATH"
ls -la /usr/local/bin/ | head -20 || true
ls -la /usr/local/lib/node_modules/ || echo "node_modules dir not found"
echo "Testing npm directly:"
/usr/local/bin/npm --version || echo "npm direct call failed"

echo "=== Installing Python dependencies ==="
cd /app
uv sync

echo "=== Installing frontend dependencies ==="
cd /app/frontend
/usr/local/bin/npm install

echo "=== Building frontend ==="
/usr/local/bin/npm run build

echo "=== Setup complete ==="
