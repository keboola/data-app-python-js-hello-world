#!/bin/bash
set -euo pipefail

# The image builder runs this script during the build and writes its build
# marker only afterwards, so the marker is absent during the build and present
# at every boot of the resulting image. entrypoint.sh runs setup.sh either way
# and exports nothing to say which is which -- without this check every start
# rebuilds a frontend that is already in the image layer.
#
# The marker's path comes from the build contract rather than being hardcoded,
# so a base image that moves it does not silently turn this check off.
KBC_BUILD_MARKER=$(jq -r '.buildMarker // empty' \
  /usr/local/keboola/build-contract.json 2>/dev/null || true)
if [ -n "${KBC_BUILD_MARKER}" ] && [ -f "${KBC_BUILD_MARKER}" ]; then
  echo "=== Prebuilt image: dependencies installed and frontend built at build time, skipping ==="
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
