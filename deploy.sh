#!/bin/bash
# Deploy script for Hostinger VPS
# Run from /var/www/examlbl after SSH: cd /var/www/examlbl && ./deploy.sh

set -e

echo "→ Pulling latest code..."
git pull origin main

echo "→ Installing dependencies..."
npm install --legacy-peer-deps

echo "→ Generating Prisma client..."
npx prisma generate

echo "→ Running database migrations..."
npx prisma migrate deploy

echo "→ Building..."
npm run build

echo "→ Restarting PM2..."
pm2 restart examlbl

echo "✓ Deploy complete"
pm2 logs examlbl --lines 10 --nostream
