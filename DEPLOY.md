# Deployment Guide (Hostinger VPS)

## Prerequisites

- Ubuntu VPS (Hostinger)
- Node.js 18+
- PostgreSQL
- Nginx
- PM2

## 1. Database Setup

```bash
sudo -u postgres createdb cad_exam
sudo -u postgres createuser -P examlbl_user  # set password when prompted
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cad_exam TO examlbl_user;"
```

## 2. Environment Variables

Create `.env` on the server:

```
DATABASE_URL="postgresql://examlbl_user:YOUR_PASSWORD@localhost:5432/cad_exam"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-secure-32-char-string"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-admin-password"
```

## 3. Deploy

```bash
git pull
npm install
npx prisma generate
npx prisma migrate deploy   # or: npx prisma db push
npm run db:seed             # creates admin user + seed data
npm run build
```

## 4. PM2

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

## 5. Nginx

Copy `nginx-example.conf` to `/etc/nginx/sites-available/examlbl`, edit `yourdomain.com`, then:

```bash
sudo ln -s /etc/nginx/sites-available/examlbl /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. SSL (optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Admin Login

- URL: `https://yourdomain.com/login`
- Default (after seed): `admin@example.com` / `admin123` (change via ADMIN_EMAIL/ADMIN_PASSWORD in seed)
- After first login, go to `/admin` to manage questions
