#!/bin/bash
set -euo pipefail

echo "=== Installing backend dependencies ==="
cd /app/backend
uv sync

echo "=== Installing frontend dependencies ==="
cd /app/frontend
/usr/local/bin/yarn install

echo "=== Building frontend ==="
/usr/local/bin/yarn build

echo "=== Setup complete ==="
