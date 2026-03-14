#!/bin/bash
# Troubleshooting script for registration issues on production
# Run this on your VPS: cd /var/www/examlbl && ./troubleshoot-register.sh

echo "=== 1. Check if PostgreSQL is running ==="
sudo systemctl status postgresql | grep Active

echo ""
echo "=== 2. Test database connection ==="
npx prisma db push --skip-generate

echo ""
echo "=== 3. Check if .env file exists and has required vars ==="
if [ -f .env ]; then
  echo "✓ .env file exists"
  echo "Checking required variables..."
  grep -E "^(DATABASE_URL|NEXTAUTH_SECRET|APP_URL|RESEND_API_KEY)=" .env | sed 's/=.*/=***/'
else
  echo "✗ .env file NOT FOUND!"
fi

echo ""
echo "=== 4. Check Prisma Client ==="
if [ -d "node_modules/@prisma/client" ]; then
  echo "✓ Prisma client exists"
else
  echo "✗ Prisma client NOT FOUND - run: npx prisma generate"
fi

echo ""
echo "=== 5. Check PM2 status ==="
pm2 show examlbl | grep -E "status|restarts|uptime"

echo ""
echo "=== 6. Recent PM2 error logs ==="
pm2 logs examlbl --err --lines 20 --nostream

echo ""
echo "=== 7. Test user creation manually ==="
echo "Run this to test database manually:"
echo "npx prisma studio"
echo "Or test with psql:"
echo "psql -U examlbl_user -d cad_exam -h localhost -c 'SELECT COUNT(*) FROM \"User\";'"
