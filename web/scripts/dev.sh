#!/usr/bin/env bash
set -euo pipefail

# Local dev loop:
#   1. boot the Auth + Firestore emulators (data wiped on every run)
#   2. seed fresh test data via the Admin SDK
#   3. start Vite pointed at the emulators
# Ctrl+C tears the whole thing down (emulators:exec cleans up when the
# inner command exits).

cd "$(dirname "$0")/.."

npx firebase emulators:exec \
  --project demo-firebase-seed \
  "npm run seed && VITE_APP_ENV=dev npm run vite"
