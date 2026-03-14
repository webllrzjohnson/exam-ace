#!/bin/bash
# Helper script to check production logs on Hostinger VPS
# Usage: Run this on your VPS after SSH

echo "=== PM2 App Status ==="
pm2 show examlbl

echo ""
echo "=== Last 50 Lines of PM2 Logs ==="
pm2 logs examlbl --lines 50 --nostream

echo ""
echo "=== PM2 Error Logs Only ==="
pm2 logs examlbl --err --lines 30 --nostream

echo ""
echo "=== Nginx Error Logs (last 20 lines) ==="
sudo tail -n 20 /var/log/nginx/error.log

echo ""
echo "=== Check Environment Variables ==="
pm2 env examlbl | grep -E "DATABASE_URL|NEXTAUTH|RESEND|APP_URL"
