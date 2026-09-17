#!/bin/bash
set -euo pipefail

# The runtime image exports KBC_APP_BAKED=1 when an image builder has already run
# this script and committed the result. Everything below is install-and-build
# work with no per-boot half, so on a baked image there is nothing left to do.
# entrypoint.sh runs setup.sh either way -- the flag is advisory -- so without
# this guard every start rebuilds a frontend that is already in the image layer.
if [ "${KBC_APP_BAKED:-}" = "1" ]; then
  echo "=== Baked image: dependencies installed and frontend built at build time, skipping ==="
  exit 0
fi

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
