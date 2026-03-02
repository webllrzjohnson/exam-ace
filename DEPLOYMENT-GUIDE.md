# Hostinger VPS Deployment Guide
## CAD Exam Prep App (examlbl)

**Version:** 1.0  
**Last Updated:** March 1, 2026  
**Tech Stack:** Next.js 14 + Prisma 5 + PostgreSQL + NextAuth v5

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part 1: Initial VPS Setup](#part-1-initial-vps-setup)
3. [Part 2: Install PostgreSQL Database](#part-2-install-postgresql-database)
4. [Part 3: Install Node.js 20+](#part-3-install-nodejs-20)
5. [Part 4: Install PM2 Process Manager](#part-4-install-pm2-process-manager)
6. [Part 5: Clone and Configure Project](#part-5-clone-and-configure-your-project)
7. [Part 6: Install Dependencies and Build](#part-6-install-dependencies-and-build)
8. [Part 7: Start App with PM2](#part-7-start-app-with-pm2)
9. [Part 8: Install and Configure Nginx](#part-8-install-and-configure-nginx)
10. [Part 9: Set Up SSL Certificate (HTTPS)](#part-9-set-up-ssl-certificate-https)
11. [Part 10: Verify Deployment](#part-10-verify-deployment)
12. [Part 11: Deployment Workflow](#part-11-deployment-workflow-future-updates)
13. [Part 12: Monitoring & Maintenance](#part-12-monitoring--maintenance)
14. [Part 13: Troubleshooting](#part-13-troubleshooting)
15. [Part 14: Performance Optimization](#part-14-performance-optimization)
16. [Part 15: Security Hardening](#part-15-security-hardening)
17. [Quick Reference](#quick-reference-commands)

---

## Prerequisites

Before starting, ensure you have:

- ✅ Active Hostinger VPS account (minimum: 2GB RAM, 2 CPU cores)
- ✅ Domain name pointed to your VPS IP address
- ✅ SSH access to your VPS
- ✅ GitHub repository: `https://github.com/YOUR_USERNAME/examlbl.git` (replace with your repo URL)

**Recommended VPS Specifications:**
- **CPU:** 2 cores
- **RAM:** 4GB
- **Storage:** 40GB SSD
- **OS:** Ubuntu 20.04 or 22.04 LTS

---

## Part 1: Initial VPS Setup

### 1.1 Connect to Your VPS

```bash
ssh root@your-vps-ip
```

- Replace `your-vps-ip` with your actual VPS IP address
- Enter your password when prompted

### 1.2 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

- Updates all system packages to latest versions
- `-y` automatically confirms all prompts
- Takes 2-5 minutes

### 1.3 Set Up Firewall

```bash
sudo ufw allow 22      # SSH access
sudo ufw allow 80      # HTTP traffic
sudo ufw allow 443     # HTTPS traffic
sudo ufw enable
```

- Configures firewall to only allow necessary ports
- Confirm with `y` when prompted

Verify firewall rules:

```bash
sudo ufw status
```

Expected output:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## Part 2: Install PostgreSQL Database

### 2.1 Install PostgreSQL 14+

```bash
sudo apt install postgresql postgresql-contrib -y
```

- Installs PostgreSQL database server and extensions
- Takes 2-3 minutes

### 2.2 Start PostgreSQL Service

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql
```

- Starts the database
- Enables auto-start on reboot
- Checks if it's running (should show "active (running)")
- Press `q` to exit status view

### 2.3 Create Database and User

Open PostgreSQL command line:

```bash
sudo -u postgres psql
```

Inside PostgreSQL, run these commands one by one:

```sql
CREATE DATABASE cad_exam;
```

Creates your application database.

```sql
CREATE USER examlbl_app WITH PASSWORD 'YourSecurePassword123!';
```

Creates a database user. **Important:** Replace `YourSecurePassword123!` with a strong password. Save this password securely.

```sql
GRANT ALL PRIVILEGES ON DATABASE cad_exam TO examlbl_app;
```

Gives your user full access to the database.

```sql
\c cad_exam
```

Connects to the database.

```sql
GRANT ALL ON SCHEMA public TO examlbl_app;
```

Grants schema permissions (required for Prisma).

```sql
\q
```

Exits PostgreSQL.

### 2.4 Test Database Connection

```bash
psql -U examlbl_app -d cad_exam -h localhost -W
```

- Tests if you can connect with the new user
- Enter the password you created
- If successful, you'll see `cad_exam=>` prompt
- Type `\q` to exit

---

## Part 3: Install Node.js 20+

> **Important:** Node.js 20+ recommended for production. Node.js 18+ works with Prisma 5.

### 3.1 Install Node.js 20 (Minimum)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**OR for Node.js 22 (Recommended):**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3.2 Verify Installation

```bash
node --version    # Should show v20.x.x or v22.x.x
npm --version     # Should show 10.x.x or higher
```

Expected output:
```
v22.1.0
10.5.0
```

---

## Part 4: Install PM2 Process Manager

### 4.1 Install PM2 Globally

```bash
sudo npm install -g pm2
```

- Installs PM2 process manager system-wide
- PM2 keeps your app running 24/7 and restarts it if it crashes
- Takes 1-2 minutes

### 4.2 Verify PM2 Installation

```bash
pm2 --version
```

Should show version number (e.g., `5.3.0`)

---

## Part 5: Clone and Configure Your Project

### 5.1 Create Project Directory

```bash
cd /var/www
sudo mkdir -p examlbl
sudo chown $USER:$USER examlbl
cd examlbl
```

- Creates directory at `/var/www/examlbl`
- Changes ownership so you can work without `sudo`
- Navigates into the directory

### 5.2 Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/examlbl.git .
```

- Clones your code from GitHub into current directory (replace with your repo URL)
- The `.` means "clone here" (not in a subdirectory)
- Takes 30-60 seconds

Verify files were cloned:

```bash
ls -la
```

You should see: `src/`, `prisma/`, `package.json`, `next.config.js`, etc.

### 5.3 Create Environment Variables

```bash
cp .env.example .env
nano .env
```

- Creates `.env` file from template
- Opens it in nano editor

**Delete all contents and replace with:**

```env
DATABASE_URL=postgresql://examlbl_app:YourSecurePassword123!@localhost:5432/cad_exam
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_HERE
AUTH_TRUST_HOST=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-admin-password
```

**Important replacements:**

1. **DATABASE_URL:** Replace `YourSecurePassword123!` with your database password from Part 2.3
2. **NEXTAUTH_URL:** Replace `yourdomain.com` with your production domain
3. **NEXTAUTH_SECRET:** Generate below
4. **AUTH_TRUST_HOST:** Required for NextAuth v5 behind reverse proxy (Nginx)
5. **ADMIN_EMAIL / ADMIN_PASSWORD:** Used by seed to create the initial admin user

### Generate NEXTAUTH_SECRET

Press `Ctrl+Z` to temporarily pause nano, then run:

```bash
openssl rand -base64 32
```

Output example: `Kx7vP9mQ2nR8sT3wU6yZ1aB4cD5eF7gH9iJ0kL2mN4oP=`

Copy this output.

Return to nano:

```bash
fg
```

Paste the generated secret after `NEXTAUTH_SECRET=`

**Your final `.env` should look like:**

```env
DATABASE_URL=postgresql://examlbl_app:MyStr0ngP@ssw0rd!@localhost:5432/cad_exam
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=Kx7vP9mQ2nR8sT3wU6yZ1aB4cD5eF7gH9iJ0kL2mN4oP=
AUTH_TRUST_HOST=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-admin-password
```

**Save and exit nano:**
- Press `Ctrl+O` (WriteOut)
- Press `Enter` (confirm filename)
- Press `Ctrl+X` (Exit)

### 5.4 Verify Environment File

```bash
cat .env
```

Double-check all values are correct. **Never commit this file to git!**

---

## Part 6: Install Dependencies and Build

### 6.1 Install Node Modules

```bash
npm install
```

- Downloads all dependencies from `package.json`
- Creates `node_modules/` folder (~300-500MB)
- Takes 2-5 minutes depending on VPS speed
- Warnings are normal; errors are not

### 6.2 Generate Prisma Client

```bash
npx prisma generate
```

- Generates Prisma client code based on your schema
- Creates TypeScript types for your database models
- Required before building Next.js
- Takes 30-60 seconds

Expected output:
```
✔ Generated Prisma Client
```

### 6.3 Push Database Schema

```bash
npm run db:push
```

- Creates all tables in PostgreSQL:
  - `User`
  - `Category`
  - `Quiz`
  - `Question`
- Sets up columns, relationships, indexes

Expected output:
```
Your database is now in sync with your Prisma schema.
```

### 6.4 Seed Database

```bash
npm run db:seed
```

- Populates database with initial data:
  - Admin user (from ADMIN_EMAIL / ADMIN_PASSWORD)
  - Categories (Canadian History, Rights & Responsibilities, etc.)
  - Quizzes and questions for CAD citizenship exam prep
- Takes 5-10 seconds

Expected output:
```
Seed completed.
```

**Admin Login:**

| Field | Value |
|-------|-------|
| Email | Value of `ADMIN_EMAIL` in `.env` |
| Password | Value of `ADMIN_PASSWORD` in `.env` |

### 6.5 Build for Production

```bash
npm run build
```

- Compiles TypeScript to JavaScript
- Optimizes React components
- Generates static pages where possible
- Creates `.next/` folder with production bundle
- **This must complete without errors**
- Takes 1-3 minutes

**Successful build output:**

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (15/15)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                   5.2 kB         95.3 kB
├ ○ /login                              2.1 kB         92.2 kB
...
```

**If build fails:**
- Read the error message carefully
- Common issues: TypeScript errors, missing environment variables
- Fix errors and run `npm run build` again

---

## Part 7: Start App with PM2

### 7.1 Start the Application

```bash
pm2 start npm --name "examlbl" -- start
```

- `pm2 start npm` = Run npm as a PM2 process
- `--name "examlbl"` = Name this process for easy reference
- `-- start` = The npm script to run (`next start` on port 3000)

Expected output:
```
[PM2] Starting npm in fork_mode (1 instance)
[PM2] Done.
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ mode    │ status  │ cpu      │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ examlbl          │ fork    │ online  │ 0%       │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

### 7.2 Verify It's Running

Check PM2 status:

```bash
pm2 status
```

Status should show "online" with uptime counter.

View logs:

```bash
pm2 logs examlbl --lines 50
```

Look for:
```
Ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

Press `Ctrl+C` to exit logs.

Test local response:

```bash
curl http://localhost:3000
```

Should return HTML (your homepage). If you see HTML tags, it's working!

### 7.3 Save PM2 Configuration

```bash
pm2 save
```

- Saves current process list to disk
- PM2 will remember to run this app

Expected output:
```
[PM2] Saving current process list...
[PM2] Successfully saved in ~/.pm2/dump.pm2
```

### 7.4 Enable PM2 Auto-Start on Reboot

```bash
pm2 startup
```

- Configures PM2 to start automatically on system reboot
- The output depends on whether you're running as root or non-root user

**If you're logged in as root** (which you should be):

Expected output:
```
[PM2] Init System found: systemd
[PM2] Writing init configuration in /etc/systemd/system/pm2-root.service
[PM2] [v] Command successfully executed.
Created symlink /etc/systemd/system/multi-user.target.wants/pm2-root.service
```

**No additional command to run** - PM2 automatically configured everything. ✓

---

**If you're logged in as a non-root user** (not recommended):

Expected output:
```
[PM2] You have to run this command as root. Execute the following command:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u youruser --hp /home/youruser
```

In this case, **copy and run the entire `sudo env...` command** that PM2 outputs.

---

This ensures your app starts automatically if VPS reboots.

---

## Part 8: Install and Configure Nginx

### 8.1 Install Nginx

```bash
sudo apt install nginx -y
```

- Installs Nginx web server
- Takes 1-2 minutes

Start and enable Nginx:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

Test that Nginx is accessible:

```bash
curl http://localhost
```

Should return the default Nginx welcome page HTML.

### 8.2 Create Nginx Configuration File

```bash
sudo nano /etc/nginx/sites-available/examlbl
```

**Paste this entire configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings for long requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Next.js static files
    location /_next/static {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js image optimization
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Client-side max upload size
    client_max_body_size 10M;
}

# Cache configuration
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;
```

**Domain configured:** Replace `yourdomain.com` with your production domain.

**Configuration Explained:**

- **Line 2-3:** Listen on port 80 (HTTP) for IPv4 and IPv6
- **Line 4:** Respond only to requests for your domain
- **Lines 7-9:** Security headers to prevent common attacks
- **Lines 12-24:** Proxy all requests to Next.js on port 3000
- **Lines 27-30:** Cache static assets for 1 year (Next.js assets are versioned)
- **Lines 33-39:** Handle Next.js image optimization
- **Line 42:** Allow uploads up to 10MB
- **Line 46:** Set up Nginx cache storage

**Save and exit:**
- `Ctrl+O` → `Enter` → `Ctrl+X`

### 8.3 Enable the Site

Create symbolic link:

```bash
sudo ln -s /etc/nginx/sites-available/examlbl /etc/nginx/sites-enabled/
```

- Nginx only loads configs from `sites-enabled/`
- This creates a link from `sites-available` to `sites-enabled`

### 8.4 Remove Default Nginx Site

```bash
sudo rm /etc/nginx/sites-enabled/default
```

- Removes the default "Welcome to Nginx" page
- Optional but recommended

### 8.5 Test Nginx Configuration

```bash
sudo nginx -t
```

Expected output:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If you see errors:**
- Check for typos in your config file
- Verify domain `yourdomain.com` is correctly set
- Common issue: missing semicolons

### 8.6 Restart Nginx

```bash
sudo systemctl restart nginx
```

Apply the new configuration.

### 8.7 Check Nginx Status

```bash
sudo systemctl status nginx
```

Should show "active (running)" in green. Press `q` to exit.

---

## Part 9: Set Up SSL Certificate (HTTPS)

### 9.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

- Installs Let's Encrypt certificate tool
- `python3-certbot-nginx` = Nginx plugin for automatic SSL setup
- Takes 1-2 minutes

### 9.2 Obtain SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Domain:** Replace with your production domain.

**Certbot will ask you several questions:**

1. **Email address** (for renewal reminders):
   ```
   Enter email address (used for urgent renewal and security notices)
   ```
   Enter your email and press Enter.

2. **Terms of Service:**
   ```
   Please read the Terms of Service at https://letsencrypt.org/documents/LE-SA-v1.3-September-21-2022.pdf
   (A)gree/(C)ancel:
   ```
   Type `A` and press Enter.

3. **Share email with EFF (optional):**
   ```
   Would you be willing to share your email address with the Electronic Frontier Foundation
   (Y)es/(N)o:
   ```
   Type `N` (optional newsletter, not required).

4. **Redirect HTTP to HTTPS:**
   ```
   Please choose whether or not to redirect HTTP traffic to HTTPS
   1: No redirect
   2: Redirect - Make all requests redirect to secure HTTPS access
   Select the appropriate number [1-2]:
   ```
   Type `2` (always use HTTPS).

**Successful output:**

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/yourdomain.com/privkey.pem

Congratulations! You have successfully enabled HTTPS on https://yourdomain.com
```

### 9.3 Test SSL Auto-Renewal

```bash
sudo certbot renew --dry-run
```

- Simulates certificate renewal
- SSL certificates expire every 90 days
- Certbot automatically renews them via cron job
- This command tests that auto-renewal will work

Expected output:
```
Congratulations, all simulated renewals succeeded
```

### 9.4 Verify SSL Certificate

```bash
sudo certbot certificates
```

Shows all certificates and their expiry dates:
```
Found the following certs:
  Certificate Name: yourdomain.com
    Domains: yourdomain.com www.yourdomain.com
    Expiry Date: 2026-05-25 12:00:00+00:00 (VALID: 89 days)
```

---

## Part 10: Verify Deployment

### 10.1 Check All Services

**PM2 (Node.js app):**

```bash
pm2 status
```

Should show `examlbl` as "online".

**Nginx (web server):**

```bash
sudo systemctl status nginx
```

Should show "active (running)".

**PostgreSQL (database):**

```bash
sudo systemctl status postgresql
```

Should show "active (running)".

### 10.2 Test Your Website

Open your browser and navigate to:

1. **HTTP redirect test:**
   - Go to: `http://yourdomain.com`
   - Should automatically redirect to: `https://yourdomain.com`

2. **HTTPS test:**
   - Go to: `https://yourdomain.com`
   - Should show your homepage
   - Check for green padlock icon in browser address bar

3. **Test all pages:**
   - Homepage: `https://yourdomain.com/`
   - Quizzes: `https://yourdomain.com/quizzes`
   - Login: `https://yourdomain.com/login`
   - Dashboard: `https://yourdomain.com/dashboard`

### 10.3 Test Authentication

**Admin Account:**

1. Navigate to `https://yourdomain.com/login`
2. Log in with your `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`
3. You should be redirected to `/dashboard`
4. Verify you can access admin features (e.g., `/admin`)

If all of the above work, **congratulations! Your deployment is complete!** 🎉

---

## Part 11: Deployment Workflow (Future Updates)

When you push changes to GitHub and want to deploy updates:

### 11.1 Connect to VPS

```bash
ssh root@your-vps-ip
cd /var/www/examlbl
```

### 11.2 Pull Latest Code

```bash
git pull origin main
```

- Downloads latest code from GitHub
- If you made local changes, you may need to stash them first:
  ```bash
  git stash
  git pull origin main
  ```

### 11.3 Install New Dependencies

```bash
npm install
```

- Installs any new packages you added to `package.json`
- If no new dependencies, this is instant

### 11.4 Update Database Schema (if changed)

```bash
npm run db:push
```

**Only run this if you modified `prisma/schema.prisma`.**

For production, consider using migrations instead:
```bash
npx prisma migrate deploy
```

### 11.5 Rebuild Application

```bash
npm run build
```

- Rebuilds the optimized production bundle
- Takes 1-3 minutes
- Must complete successfully

### 11.6 Restart App

```bash
pm2 restart examlbl
```

- Restarts your app with the new code
- Zero-downtime restart (PM2 handles this gracefully)
- Takes 2-3 seconds

**⚠️ Important:** Always use `pm2 restart examlbl` for updates, **NOT** `pm2 start npm --name "examlbl" -- start`.

Using `pm2 start` will create a duplicate process, causing port conflicts and resource issues. If you accidentally create duplicates:

```bash
pm2 delete all
pm2 start npm --name "examlbl" -- start
pm2 save
```

### 11.7 Verify Update

```bash
pm2 logs examlbl --lines 50
```

- Check logs for any errors
- Look for "Ready started server on 0.0.0.0:3000"
- Press `Ctrl+C` to exit

Test in browser:
- Clear browser cache (`Ctrl+Shift+R` or `Cmd+Shift+R`)
- Navigate to your site
- Verify changes are live

### Complete Update Script

You can save this as a script for quick updates:

```bash
#!/bin/bash
cd /var/www/examlbl
git pull origin main
npm install
npm run build
pm2 restart examlbl
pm2 logs examlbl --lines 30
```

Save as `update.sh`, make executable:
```bash
chmod +x update.sh
```

Run it:
```bash
./update.sh
```

---

## Part 12: Monitoring & Maintenance

### 12.1 View Application Logs

**Real-time logs:**

```bash
pm2 logs examlbl
```

- Shows live logs as they happen
- Press `Ctrl+C` to exit

**Last N lines:**

```bash
pm2 logs examlbl --lines 200
```

- Shows last 200 lines
- Useful for debugging recent issues

**Error logs only:**

```bash
pm2 logs examlbl --err
```

- Shows only stderr output

**Save logs to file:**

```bash
pm2 logs examlbl --lines 1000 > app-logs-$(date +%Y%m%d).txt
```

### 12.2 Monitor Resource Usage

**PM2 monitoring dashboard:**

```bash
pm2 monit
```

- Live dashboard showing CPU, memory, logs
- Press `Ctrl+C` to exit

**System resource monitor:**

```bash
htop
```

- If not installed: `sudo apt install htop`
- Shows CPU, RAM, processes
- Press `q` to exit

**Disk usage:**

```bash
df -h
```

- Shows disk space usage
- Watch for low space on `/` partition

**PM2 memory usage:**

```bash
pm2 show examlbl
```

- Detailed info about your app
- Shows memory usage, uptime, restart count

### 12.3 Database Management

**Connect to database:**

```bash
psql -U examlbl_app -d cad_exam -h localhost -W
```

- Opens PostgreSQL command line
- Enter your database password

**Useful SQL commands:**

```sql
-- Count users
SELECT COUNT(*) FROM users;

-- Count bookings
SELECT COUNT(*) FROM bookings;

-- Check database size
SELECT pg_size_pretty(pg_database_size('cad_exam'));

-- List all tables
\dt

-- Describe a table
\d bookings

-- Exit
\q
```

**Prisma Studio (Visual Database Browser):**

```bash
npm run db:studio
```

- Opens visual database browser on port 5555
- **Security warning:** Don't expose this publicly!

**Access Prisma Studio securely via SSH tunnel:**

On your local machine, run:
```bash
ssh -L 5555:localhost:5555 root@your-vps-ip
```

Then on the VPS:
```bash
cd /var/www/examlbl
npm run db:studio
```

Open on your local machine: `http://localhost:5555`

### 12.4 Database Backups

**Manual backup:**

```bash
cd /var/www/examlbl
mkdir -p backups
pg_dump -U examlbl_app -h localhost cad_exam > backups/backup-$(date +%Y%m%d-%H%M%S).sql
```

- Creates timestamped SQL backup file
- Enter database password when prompted

**Automated daily backups:**

Create backup script:

```bash
sudo nano /usr/local/bin/backup-db.sh
```

Paste:

```bash
#!/bin/bash
BACKUP_DIR="/var/www/examlbl/backups"
DATE=$(date +%Y%m%d-%H%M%S)
FILENAME="cad_exam_$DATE.sql"

mkdir -p $BACKUP_DIR
pg_dump -U examlbl_app -h localhost cad_exam > "$BACKUP_DIR/$FILENAME"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $FILENAME"
```

Make executable:

```bash
sudo chmod +x /usr/local/bin/backup-db.sh
```

Add to cron (daily at 2 AM):

```bash
sudo crontab -e
```

Add line:

```
0 2 * * * /usr/local/bin/backup-db.sh >> /var/log/db-backup.log 2>&1
```

**Restore from backup:**

```bash
psql -U examlbl_app -h localhost cad_exam < backups/backup-20260224-140530.sql
```

### 12.5 Nginx Logs

**Access logs (successful requests):**

```bash
sudo tail -f /var/log/nginx/access.log
```

**Error logs (failed requests):**

```bash
sudo tail -f /var/log/nginx/error.log
```

**Search for specific error:**

```bash
sudo grep "404" /var/log/nginx/access.log
sudo grep "error" /var/log/nginx/error.log
```

### 12.6 System Updates

**Check for updates:**

```bash
sudo apt update
```

**Apply updates:**

```bash
sudo apt upgrade -y
```

- Run this monthly
- Includes security patches

**Reboot if required:**

```bash
sudo reboot
```

- Your app will automatically restart (thanks to PM2 startup)

---

## Part 13: Troubleshooting

### 13.1 App Won't Start

**Check PM2 status:**

```bash
pm2 status
```

If status is "errored", check logs:

```bash
pm2 logs examlbl --err --lines 100
```

**Common issues:**

**Database connection error:**
```
Error: Can't reach database server at `localhost:5432`
```

**Solution:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify `DATABASE_URL` in `.env` is correct
- Test connection: `psql -U examlbl_app -d cad_exam -h localhost -W`

**Port 3000 already in use:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
lsof -ti:3000 | xargs kill -9
pm2 restart examlbl
```

**Build failed:**
```
Error: Build failed
```

**Solution:**
- Check for TypeScript errors: `npm run build`
- Read error messages carefully
- Fix code issues and rebuild

**Missing environment variables:**
```
Error: NEXTAUTH_SECRET must be provided
```

**Solution:**
- Check `.env` file exists: `cat .env`
- Verify all required variables are set
- Restart after fixing: `pm2 restart examlbl`

### 13.2 502 Bad Gateway (Nginx Error)

**Check if app is running:**

```bash
pm2 status
curl http://localhost:3000
```

If curl fails, the issue is with your Node.js app, not Nginx.

**Check Nginx configuration:**

```bash
sudo nginx -t
```

If test fails, fix config errors.

**Check Nginx logs:**

```bash
sudo tail -n 50 /var/log/nginx/error.log
```

**Restart services:**

```bash
pm2 restart examlbl
sudo systemctl restart nginx
```

### 13.3 Database Issues

**Can't connect to database:**

```bash
sudo systemctl status postgresql
```

If not running:

```bash
sudo systemctl start postgresql
```

**Check PostgreSQL logs:**

```bash
sudo tail -n 50 /var/log/postgresql/postgresql-14-main.log
```

**Reset database (⚠️ deletes all data):**

```bash
npm run db:push --force-reset
npm run db:seed
```

### 13.4 SSL Certificate Issues

**Certificate expired or invalid:**

```bash
sudo certbot certificates
```

Check expiry date. If expired:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

**Force renew:**

```bash
sudo certbot renew --force-renewal
```

**Certificate not found:**

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 13.5 High Memory Usage

**Check memory usage:**

```bash
free -h
pm2 monit
```

**Restart app to clear memory:**

```bash
pm2 restart examlbl
```

**Set memory limit (auto-restart if exceeded):**

```bash
pm2 delete examlbl
pm2 start npm --name "examlbl" --max-memory-restart 500M -- start
pm2 save
```

### 13.6 Slow Response Times

**Check if app is overwhelmed:**

```bash
pm2 monit
htop
```

**Enable cluster mode (multiple instances):**

```bash
pm2 delete examlbl
pm2 start npm --name "examlbl" -i 2 -- start
pm2 save
```

- `-i 2` runs 2 instances
- PM2 load-balances between them
- Use number of CPU cores (e.g., `-i 4` for 4 cores)

**Check database performance:**

```bash
psql -U examlbl_app -d cad_exam -h localhost -W
```

```sql
-- Show slow queries (if enabled)
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

---

## Part 14: Performance Optimization

### 14.1 Enable Node.js Production Mode

Your app already runs in production mode via `next start`. Verify:

```bash
pm2 env 0
```

Should show `NODE_ENV=production`.

### 14.2 PM2 Cluster Mode

Run multiple instances for load balancing:

```bash
pm2 delete examlbl
pm2 start npm --name "examlbl" -i max -- start
pm2 save
```

- `-i max` = Use all CPU cores
- PM2 automatically balances traffic
- Only useful if you have 2+ cores

### 14.3 Database Indexing

Your Prisma schema already includes indexes. Verify:

```bash
psql -U examlbl_app -d cad_exam -h localhost -W
```

```sql
-- List all indexes
SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public';
```

### 14.4 Nginx Caching

Your Nginx config already includes caching for static files. To enhance:

```bash
sudo nano /etc/nginx/sites-available/examlbl
```

Add before the server block:

```nginx
# Increase cache size
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:100m inactive=7d use_temp_path=off max_size=1g;
```

Restart Nginx:

```bash
sudo systemctl reload nginx
```

### 14.5 Enable Gzip Compression

```bash
sudo nano /etc/nginx/nginx.conf
```

Find the `gzip` section and ensure:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

Reload Nginx:

```bash
sudo systemctl reload nginx
```

### 14.6 Monitor Performance

Install monitoring tools:

```bash
sudo npm install -g pm2-logrotate
pm2 install pm2-logrotate
```

- Automatically rotates PM2 logs
- Prevents disk space issues

---

## Part 15: Security Hardening

### 15.1 Disable Root SSH Login

Create a non-root user first:

```bash
adduser deploy
usermod -aG sudo deploy
```

Test SSH with new user:

```bash
ssh deploy@your-vps-ip
```

If successful, disable root login:

```bash
sudo nano /etc/ssh/sshd_config
```

Find and change:

```
PermitRootLogin no
PasswordAuthentication no  # Force SSH keys only
```

Restart SSH:

```bash
sudo systemctl restart sshd
```

### 15.2 Set Up Fail2Ban

Blocks brute-force attacks:

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

Configure:

```bash
sudo nano /etc/fail2ban/jail.local
```

Add:

```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600
```

Restart:

```bash
sudo systemctl restart fail2ban
```

Check banned IPs:

```bash
sudo fail2ban-client status sshd
```

### 15.3 Keep System Updated

Enable automatic security updates:

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

Select "Yes" when prompted.

Manual updates:

```bash
sudo apt update && sudo apt upgrade -y
```

Run this monthly.

### 15.4 Database Security

**Change PostgreSQL default port:**

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Change:

```
port = 5433  # Instead of 5432
```

Restart:

```bash
sudo systemctl restart postgresql
```

Update `.env`:

```env
DATABASE_URL=postgresql://examlbl_app:password@localhost:5433/cad_exam
```

**Restrict database access:**

```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Ensure:

```
local   all             all                                     peer
host    cad_exam  examlbl_app    127.0.0.1/32            md5
```

### 15.5 Environment Variables Security

Protect `.env` file:

```bash
chmod 600 /var/www/examlbl/.env
```

- Only owner can read/write
- Prevents other users from viewing secrets

### 15.6 Rate Limiting

Add to Nginx config:

```bash
sudo nano /etc/nginx/sites-available/examlbl
```

Add before server block:

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
limit_req_status 429;
```

Inside server block, in `location /` :

```nginx
limit_req zone=one burst=20 nodelay;
```

Reload:

```bash
sudo systemctl reload nginx
```

---

## Quick Reference Commands

### Application Management

| Task | Command |
|------|---------|
| View app status | `pm2 status` |
| View app logs | `pm2 logs examlbl` |
| View error logs only | `pm2 logs examlbl --err` |
| Restart app | `pm2 restart examlbl` |
| Stop app | `pm2 stop examlbl` |
| Start app | `pm2 start examlbl` |
| Delete app from PM2 | `pm2 delete examlbl` |
| Monitor resources | `pm2 monit` |

### Deployment & Updates

| Task | Command |
|------|---------|
| Pull latest code | `cd /var/www/examlbl && git pull origin main` |
| Install dependencies | `npm install` |
| Build for production | `npm run build` |
| Restart after update | `pm2 restart examlbl` |
| Full update script | `git pull && npm install && npm run build && pm2 restart examlbl` |

### Nginx Management

| Task | Command |
|------|---------|
| Test Nginx config | `sudo nginx -t` |
| Reload Nginx | `sudo systemctl reload nginx` |
| Restart Nginx | `sudo systemctl restart nginx` |
| Check Nginx status | `sudo systemctl status nginx` |
| View Nginx error logs | `sudo tail -f /var/log/nginx/error.log` |
| View Nginx access logs | `sudo tail -f /var/log/nginx/access.log` |

### Database Management

| Task | Command |
|------|---------|
| Connect to database | `psql -U examlbl_app -d cad_exam -h localhost -W` |
| Backup database | `pg_dump -U examlbl_app cad_exam > backup.sql` |
| Restore database | `psql -U examlbl_app cad_exam < backup.sql` |
| Push schema changes | `npm run db:push` |
| Seed database | `npm run db:seed` |
| Open Prisma Studio | `npm run db:studio` |
| Check PostgreSQL status | `sudo systemctl status postgresql` |

### SSL Certificate Management

| Task | Command |
|------|---------|
| Renew SSL manually | `sudo certbot renew` |
| Force SSL renewal | `sudo certbot renew --force-renewal` |
| Check certificate status | `sudo certbot certificates` |
| Test auto-renewal | `sudo certbot renew --dry-run` |

### System Management

| Task | Command |
|------|---------|
| Check disk space | `df -h` |
| Check memory usage | `free -h` |
| View system resources | `htop` |
| Update system packages | `sudo apt update && sudo apt upgrade -y` |
| Reboot server | `sudo reboot` |
| View firewall status | `sudo ufw status` |
| Check all services | `systemctl status` |

---

## Environment Variables Reference

Your `.env` file must contain these variables:

```env
# PostgreSQL Database Connection
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL=postgresql://examlbl_app:your_password@localhost:5432/cad_exam

# NextAuth Configuration
# The public URL where your app is accessible
NEXTAUTH_URL=https://yourdomain.com

# NextAuth JWT Secret
# Generate with: openssl rand -base64 32
# Must be at least 32 characters
NEXTAUTH_SECRET=your_generated_secret_here

# NextAuth Trust Host
# Required for NextAuth v5 when running behind reverse proxy (Nginx)
# Allows NextAuth to trust the forwarded host headers
AUTH_TRUST_HOST=true

# Admin User (used by seed)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-admin-password
```

**Security reminders:**
- Never commit `.env` to Git (already in `.gitignore`)
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Use different passwords in production vs development
- Rotate `NEXTAUTH_SECRET` if compromised

---

## Resource Requirements

### Minimum VPS Specifications

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 core | 2 cores |
| RAM | 2GB | 4GB |
| Storage | 20GB SSD | 40GB SSD |
| OS | Ubuntu 20.04 | Ubuntu 22.04 LTS |
| Node.js | 20.19.0 | 22.x |
| PostgreSQL | 14 | 15+ |

### Expected Resource Usage

| Component | RAM Usage | Notes |
|-----------|-----------|-------|
| Node.js (single instance) | 200-400MB | Depends on traffic |
| PostgreSQL | 100-200MB | Small database |
| Nginx | 10-20MB | Lightweight |
| System | 200-300MB | Ubuntu baseline |
| **Total** | **~500MB-1GB** | Leaves room for growth |

### Estimated Costs

| Item | Cost | Notes |
|------|------|-------|
| Hostinger VPS | $4-12/month | Depends on plan |
| Domain name | $10-15/year | If not included |
| SSL certificate | FREE | Let's Encrypt |
| **Total** | **~$5-15/month** | Very affordable |

---

## Tech Stack Reference

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework (App Router) |
| React | 18.3.1 | UI library |
| TypeScript | 5.x | Type-safe JavaScript |
| Prisma | 5.x | ORM (database toolkit) |
| PostgreSQL | 14+ | Relational database |
| NextAuth.js | 5.0.0-beta.25 | Authentication |
| Tailwind CSS | 3.4.1 | Utility-first CSS |
| Shadcn/ui | Latest | UI component library |
| react-hook-form | 7.54.0 | Form handling |
| Zod | 3.24.1 | Schema validation |
| Node.js | 20.19.0+ | JavaScript runtime |
| PM2 | 5.x | Process manager |
| Nginx | 1.18+ | Web server / reverse proxy |

---

## Admin Account

After seeding the database, the admin account is available:

| Field | Value |
|-------|-------|
| Email | Value of `ADMIN_EMAIL` in `.env` |
| Password | Value of `ADMIN_PASSWORD` in `.env` |
| Role | admin |
| Access | Dashboard, Admin panel (questions, quizzes) |

---

## Support & Documentation

### Official Documentation

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **NextAuth.js:** https://authjs.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Shadcn/ui:** https://ui.shadcn.com
- **PostgreSQL:** https://www.postgresql.org/docs
- **Nginx:** https://nginx.org/en/docs
- **PM2:** https://pm2.keymetrics.io/docs
- **Certbot:** https://certbot.eff.org/docs

### Community Resources

- **Next.js Discord:** https://nextjs.org/discord
- **Prisma Discord:** https://pris.ly/discord
- **Stack Overflow:** Tag questions with `nextjs`, `prisma`, `nginx`

### Troubleshooting Resources

- **GitHub Issues:** Check your repository issues
- **Next.js Discussions:** https://github.com/vercel/next.js/discussions
- **Prisma Discussions:** https://github.com/prisma/prisma/discussions

---

## Appendix: Common Error Messages

### Build Errors

**Error:** `Type error: Cannot find module '@/lib/db'`

**Solution:**
```bash
npm install
npx prisma generate
npm run build
```

**Error:** `Module not found: Can't resolve 'next/font/google'`

**Solution:** Already using `next/font` correctly. Check import path.

### Runtime Errors

**Error:** `Error: Invalid `prisma.user.findUnique()` invocation`

**Solution:** Database connection issue. Check `DATABASE_URL` in `.env`.

**Error:** `Error: NextAuth.js Error - AuthorizeError`

**Solution:** Check `NEXTAUTH_SECRET` is set in `.env`.

**Error:** `[auth][error] UntrustedHost: Host must be trusted`

**Solution:** Add `AUTH_TRUST_HOST=true` to `.env` file. This is required for NextAuth v5 when running behind Nginx reverse proxy. After adding, restart PM2: `pm2 restart examlbl`

### Database Errors

**Error:** `FATAL: password authentication failed for user "examlbl_app"`

**Solution:** Check database password in `.env` matches PostgreSQL user password.

**Error:** `FATAL: database "cad_exam" does not exist`

**Solution:**
```bash
sudo -u postgres psql
CREATE DATABASE cad_exam;
\q
```

---

## Changelog

### Version 1.2 (March 1, 2026)

- Adapted for CAD Exam Prep App (examlbl)
- Replaced fitness references with examlbl, cad_exam, examlbl_app
- Updated database tables: User, Category, Quiz, Question
- Replaced demo accounts with admin account (ADMIN_EMAIL, ADMIN_PASSWORD)
- Added ADMIN_EMAIL and ADMIN_PASSWORD to environment variables

### Version 1.1 (February 25, 2026)

- Added `AUTH_TRUST_HOST=true` environment variable requirement
- Required for NextAuth v5 authentication behind Nginx reverse proxy
- Added troubleshooting entry for UntrustedHost error
- Updated all environment variable examples

### Version 1.0 (February 24, 2026)

- Initial deployment guide
- Updated for Prisma 7 (Node.js 20+ requirement)
- Includes Next.js 15 and NextAuth v5
- Complete step-by-step instructions
- Troubleshooting section
- Security hardening guide
- Performance optimization tips

---

## License

This deployment guide is provided as-is for the CAD Exam Prep App (examlbl) project.

---

**End of Deployment Guide**

For questions or issues, refer to the troubleshooting section or consult official documentation links provided above.
