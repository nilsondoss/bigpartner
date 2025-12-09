# 🚀 Big Partner - Complete Deployment Guide

## Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Deployment Options](#deployment-options)
4. [Option 1: Vercel (Recommended)](#option-1-vercel-recommended)
5. [Option 2: Netlify](#option-2-netlify)
6. [Option 3: AWS](#option-3-aws)
7. [Option 4: DigitalOcean](#option-4-digitalocean)
8. [Option 5: Traditional VPS](#option-5-traditional-vps)
9. [Database Setup](#database-setup)
10. [Environment Variables](#environment-variables)
11. [Domain Configuration](#domain-configuration)
12. [SSL Certificate](#ssl-certificate)
13. [Post-Deployment Testing](#post-deployment-testing)
14. [Monitoring & Maintenance](#monitoring--maintenance)
15. [Troubleshooting](#troubleshooting)

---

## Overview

Your Big Partner website is a **full-stack application** with:
- **Frontend:** React 19 + Vite + TypeScript
- **Backend:** Node.js + Express API routes
- **Database:** MySQL with Drizzle ORM
- **Email:** Nodemailer SMTP
- **Security:** reCAPTCHA v3, bcrypt password hashing

**Deployment Requirements:**
- Node.js 18+ runtime
- MySQL 8.0+ database
- SMTP email server
- SSL certificate (for HTTPS)
- Environment variables configuration

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

### ✅ Required Accounts
- [ ] Hosting provider account (Vercel/Netlify/AWS/etc.)
- [ ] Domain registrar account (GoDaddy/Namecheap/etc.)
- [ ] MySQL database hosting (PlanetScale/AWS RDS/etc.)
- [ ] Email service (Gmail/SendGrid/AWS SES/etc.)
- [ ] Google reCAPTCHA account

### ✅ Required Credentials
- [ ] Database connection string
- [ ] SMTP email credentials
- [ ] reCAPTCHA site key & secret key
- [ ] Domain name (e.g., bigpartner.in)

### ✅ Code Preparation
- [ ] All environment variables documented
- [ ] Database migrations tested
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests pass (`npm run test`)
- [ ] Source code in Git repository

### ✅ Content Ready
- [ ] Property images uploaded
- [ ] Contact information updated
- [ ] WhatsApp number configured
- [ ] Email templates customized

---

## Deployment Options

### Comparison Table

| Platform | Difficulty | Cost | Best For | Database Included |
|----------|-----------|------|----------|-------------------|
| **Vercel** | ⭐ Easy | Free tier available | Quick deployment | No (use PlanetScale) |
| **Netlify** | ⭐ Easy | Free tier available | Static + functions | No (use PlanetScale) |
| **AWS** | ⭐⭐⭐ Advanced | Pay-as-you-go | Enterprise scale | Yes (RDS) |
| **DigitalOcean** | ⭐⭐ Moderate | $5-20/month | Full control | Yes (Managed DB) |
| **VPS** | ⭐⭐⭐ Advanced | $5-50/month | Complete control | Self-managed |

**Recommendation:** Start with **Vercel + PlanetScale** for easiest deployment.

---

## Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ **Easiest deployment** - Git push to deploy
- ✅ **Free tier** - Generous limits for small projects
- ✅ **Automatic SSL** - HTTPS out of the box
- ✅ **Global CDN** - Fast worldwide
- ✅ **Serverless functions** - API routes work automatically

### Step-by-Step Deployment

#### 1. Prepare Your Repository

```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit - Big Partner website"

# Push to GitHub
git remote add origin https://github.com/yourusername/big-partner.git
git branch -M main
git push -u origin main
```

#### 2. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Click "Add New Project"
4. Import your GitHub repository

#### 3. Configure Build Settings

**Framework Preset:** Vite

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

#### 4. Set Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/database

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@bigpartner.in

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key

# WhatsApp
VITE_WHATSAPP_NUMBER=919876543210

# Session Secret
SESSION_SECRET=your-random-secret-key-here

# Node Environment
NODE_ENV=production
```

#### 5. Deploy

Click **"Deploy"** button. Vercel will:
1. Clone your repository
2. Install dependencies
3. Run build command
4. Deploy to production
5. Provide a URL (e.g., `big-partner.vercel.app`)

#### 6. Configure Custom Domain

1. Go to **Settings → Domains**
2. Add your domain: `bigpartner.in`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

---

## Option 2: Netlify

### Step-by-Step Deployment

#### 1. Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub account
3. Click "Add new site" → "Import an existing project"

#### 2. Configure Build Settings

**Build command:**
```bash
npm run build
```

**Publish directory:**
```
dist
```

**Functions directory:**
```
netlify/functions
```

#### 3. Create Netlify Functions for API Routes

Since Netlify doesn't support Express directly, you need to convert API routes to Netlify Functions.

**Create:** `netlify/functions/api.js`

```javascript
const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Import your API routes
const propertiesRouter = require('../../src/server/api/properties/GET.js');
const authRouter = require('../../src/server/api/auth/login/POST.js');

app.use('/api/properties', propertiesRouter);
app.use('/api/auth', authRouter);

module.exports.handler = serverless(app);
```

#### 4. Set Environment Variables

In Netlify dashboard: **Site settings → Environment variables**

Add the same environment variables as Vercel (see above).

#### 5. Deploy

Click **"Deploy site"**. Netlify will build and deploy your site.

---

## Option 3: AWS (Amazon Web Services)

### Architecture

```
┌─────────────────┐
│   CloudFront    │  ← CDN for static assets
│   (CDN)         │
└────────┬────────┘
         │
┌────────▼────────┐
│   S3 Bucket     │  ← Frontend (React build)
│   (Static)      │
└─────────────────┘

┌─────────────────┐
│   EC2 Instance  │  ← Backend (Node.js API)
│   or Lambda     │
└────────┬────────┘
         │
┌────────▼────────┐
│   RDS MySQL     │  ← Database
│   (Database)    │
└─────────────────┘
```

### Step-by-Step Deployment

#### 1. Set Up RDS MySQL Database

1. Go to AWS Console → RDS
2. Click "Create database"
3. Choose **MySQL 8.0**
4. Select **Free tier** (or production settings)
5. Configure:
   - DB instance identifier: `bigpartner-db`
   - Master username: `admin`
   - Master password: (create strong password)
   - DB instance class: `db.t3.micro` (free tier)
   - Storage: 20 GB
   - Public access: **Yes** (for initial setup)
6. Create database
7. Note the endpoint: `bigpartner-db.xxxxx.us-east-1.rds.amazonaws.com`

#### 2. Deploy Backend to EC2

**Launch EC2 Instance:**

1. Go to AWS Console → EC2
2. Click "Launch Instance"
3. Choose **Ubuntu 22.04 LTS**
4. Instance type: `t2.micro` (free tier)
5. Create key pair (download `.pem` file)
6. Configure security group:
   - Allow SSH (port 22)
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
   - Allow Custom TCP (port 3000) for Node.js
7. Launch instance

**Connect to EC2:**

```bash
# SSH into your instance
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-ip
```

**Install Node.js:**

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

**Deploy Application:**

```bash
# Clone repository
git clone https://github.com/yourusername/big-partner.git
cd big-partner

# Install dependencies
npm install

# Create .env file
nano .env
# (Paste your environment variables)

# Run database migrations
npm run db:migrate

# Build application
npm run build

# Install PM2 (process manager)
sudo npm install -g pm2

# Start application
pm2 start npm --name "big-partner" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

**Configure Nginx as Reverse Proxy:**

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/bigpartner
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name bigpartner.in www.bigpartner.in;

    # Frontend (static files)
    location / {
        root /home/ubuntu/big-partner/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable Nginx:**

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bigpartner /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 3. Deploy Frontend to S3 + CloudFront

**Create S3 Bucket:**

1. Go to AWS Console → S3
2. Click "Create bucket"
3. Bucket name: `bigpartner-frontend`
4. Region: `us-east-1`
5. Uncheck "Block all public access"
6. Create bucket

**Upload Frontend Build:**

```bash
# Build frontend locally
npm run build

# Install AWS CLI
pip install awscli

# Configure AWS CLI
aws configure

# Upload to S3
aws s3 sync dist/ s3://bigpartner-frontend --delete
```

**Configure S3 for Static Website:**

1. Go to bucket → Properties
2. Scroll to "Static website hosting"
3. Enable static website hosting
4. Index document: `index.html`
5. Error document: `index.html`

**Create CloudFront Distribution:**

1. Go to AWS Console → CloudFront
2. Click "Create distribution"
3. Origin domain: Select your S3 bucket
4. Origin access: **Origin access control**
5. Default cache behavior: **Redirect HTTP to HTTPS**
6. Create distribution
7. Note the CloudFront URL: `d1234567890.cloudfront.net`

---

## Option 4: DigitalOcean

### Step-by-Step Deployment

#### 1. Create Droplet

1. Go to [digitalocean.com](https://digitalocean.com)
2. Click "Create" → "Droplets"
3. Choose:
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:** Basic ($6/month)
   - **CPU:** Regular (1 GB RAM)
   - **Datacenter:** Closest to your users
4. Add SSH key
5. Create Droplet

#### 2. Create Managed MySQL Database

1. Click "Create" → "Databases"
2. Choose **MySQL 8**
3. Plan: **Basic ($15/month)**
4. Datacenter: Same as Droplet
5. Create database cluster
6. Note connection details

#### 3. Deploy Application

**Connect to Droplet:**

```bash
ssh root@your-droplet-ip
```

**Install Dependencies:**

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2

# Install Git
apt install -y git
```

**Deploy Application:**

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/big-partner.git
cd big-partner

# Install dependencies
npm install

# Create .env file
nano .env
# (Add your environment variables)

# Run migrations
npm run db:migrate

# Build application
npm run build

# Start with PM2
pm2 start npm --name "big-partner" -- start
pm2 save
pm2 startup
```

**Configure Nginx:**

```bash
nano /etc/nginx/sites-available/bigpartner
```

```nginx
server {
    listen 80;
    server_name bigpartner.in www.bigpartner.in;

    root /var/www/big-partner/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/bigpartner /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 4. Install SSL Certificate

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d bigpartner.in -d www.bigpartner.in

# Auto-renewal
certbot renew --dry-run
```

---

## Option 5: Traditional VPS (Hostinger, Bluehost, etc.)

### Requirements

- VPS with root access
- Ubuntu 20.04+ or CentOS 7+
- Minimum 1 GB RAM
- 20 GB storage

### Deployment Steps

Follow the same steps as **DigitalOcean** above, but:

1. Use your VPS provider's control panel to access server
2. Install MySQL locally or use external database
3. Configure firewall rules in control panel
4. Point domain to VPS IP address

---

## Database Setup

### Option A: PlanetScale (Recommended for Vercel/Netlify)

**Why PlanetScale?**
- ✅ Free tier (5 GB storage)
- ✅ Serverless MySQL
- ✅ No connection limits
- ✅ Automatic backups
- ✅ Easy branching

**Setup Steps:**

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with GitHub
3. Create new database: `bigpartner`
4. Create branch: `main`
5. Click "Connect" → Get connection string
6. Copy connection string:
   ```
   mysql://user:pass@host.us-east-3.psdb.cloud/bigpartner?sslaccept=strict
   ```

**Run Migrations:**

```bash
# Set DATABASE_URL
export DATABASE_URL="your-planetscale-connection-string"

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed
```

### Option B: AWS RDS

See **Option 3: AWS** section above.

### Option C: DigitalOcean Managed Database

See **Option 4: DigitalOcean** section above.

### Option D: Self-Hosted MySQL

**Install MySQL on Ubuntu:**

```bash
# Install MySQL
sudo apt update
sudo apt install -y mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database
sudo mysql
```

```sql
CREATE DATABASE bigpartner;
CREATE USER 'bigpartner_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON bigpartner.* TO 'bigpartner_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Connection String:**

```
mysql://bigpartner_user:strong_password@localhost:3306/bigpartner
```

---

## Environment Variables

### Complete List

Create a `.env` file with these variables:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL=mysql://user:password@host:3306/database

# ============================================
# EMAIL CONFIGURATION (SMTP)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@bigpartner.in

# ============================================
# RECAPTCHA (Google reCAPTCHA v3)
# ============================================
VITE_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ============================================
# WHATSAPP INTEGRATION
# ============================================
VITE_WHATSAPP_NUMBER=919876543210

# ============================================
# SESSION & SECURITY
# ============================================
SESSION_SECRET=your-random-secret-key-minimum-32-characters
NODE_ENV=production

# ============================================
# APPLICATION SETTINGS
# ============================================
VITE_APP_NAME=Big Partner
VITE_APP_URL=https://bigpartner.in
VITE_API_URL=https://bigpartner.in/api

# ============================================
# CONTACT INFORMATION
# ============================================
VITE_CONTACT_EMAIL=info@bigpartner.in
VITE_CONTACT_PHONE=+919876543210
VITE_CONTACT_ADDRESS=123 Business Street, City, State 123456
```

### How to Generate Secrets

**SESSION_SECRET:**

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Gmail App Password:**

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Copy 16-character password

**reCAPTCHA Keys:**

1. Go to [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Register new site
3. Choose **reCAPTCHA v3**
4. Add domain: `bigpartner.in`
5. Copy Site Key and Secret Key

---

## Domain Configuration

### Step 1: Purchase Domain

Purchase `bigpartner.in` from:
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare

### Step 2: Configure DNS

**For Vercel:**

Add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

**For AWS CloudFront:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | (CloudFront IP) | 3600 |
| CNAME | www | d1234567890.cloudfront.net | 3600 |

**For VPS/DigitalOcean:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | (Your server IP) | 3600 |
| A | www | (Your server IP) | 3600 |

### Step 3: Wait for DNS Propagation

DNS changes take 5-60 minutes to propagate worldwide.

**Check DNS propagation:**
- [whatsmydns.net](https://whatsmydns.net)
- [dnschecker.org](https://dnschecker.org)

---

## SSL Certificate

### Option A: Automatic (Vercel/Netlify)

SSL is automatic! Vercel and Netlify provide free SSL certificates via Let's Encrypt.

### Option B: Let's Encrypt (VPS/EC2)

**Install Certbot:**

```bash
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx
```

**Get Certificate:**

```bash
# For Nginx
sudo certbot --nginx -d bigpartner.in -d www.bigpartner.in

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect HTTP to HTTPS: Yes
```

**Auto-Renewal:**

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job for renewal
```

### Option C: CloudFlare (Free SSL)

1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update nameservers at your registrar
4. Enable SSL/TLS → Full (strict)
5. Free SSL certificate active!

---

## Post-Deployment Testing

### 1. Functional Testing

**Test all pages:**

```bash
# Homepage
curl -I https://bigpartner.in

# Properties listing
curl -I https://bigpartner.in/properties

# Property detail
curl -I https://bigpartner.in/property/1

# Login page
curl -I https://bigpartner.in/login

# Contact page
curl -I https://bigpartner.in/contact
```

**Expected:** All return `200 OK`

### 2. API Testing

**Test API endpoints:**

```bash
# Health check
curl https://bigpartner.in/api/health

# Properties API
curl https://bigpartner.in/api/properties

# Login API (POST)
curl -X POST https://bigpartner.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3. Database Testing

**Verify database connection:**

```bash
# SSH into server
ssh user@your-server

# Check database
mysql -u user -p -h host -e "USE bigpartner; SELECT COUNT(*) FROM properties;"
```

**Expected:** Returns count of properties (36)

### 4. Email Testing

**Test contact form:**

1. Go to https://bigpartner.in/contact
2. Fill out form
3. Submit
4. Check if email received

### 5. Security Testing

**SSL Certificate:**

```bash
# Check SSL
curl -vI https://bigpartner.in 2>&1 | grep -i "SSL certificate"
```

**Security Headers:**

```bash
# Check headers
curl -I https://bigpartner.in | grep -i "strict-transport-security"
```

### 6. Performance Testing

**Page Load Speed:**

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

**Target Metrics:**
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s

### 7. Mobile Testing

**Test on devices:**
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)

**Or use browser dev tools:**
- Chrome DevTools → Device Toolbar
- Test responsive breakpoints

### 8. Browser Compatibility

**Test on:**
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Monitoring & Maintenance

### 1. Uptime Monitoring

**Free Services:**
- [UptimeRobot](https://uptimerobot.com) - Free, checks every 5 minutes
- [Pingdom](https://pingdom.com) - Free tier available
- [StatusCake](https://statuscake.com) - Free tier available

**Setup:**
1. Create account
2. Add monitor: `https://bigpartner.in`
3. Set alert email
4. Get notified if site goes down

### 2. Error Tracking

**Sentry (Recommended):**

```bash
# Install Sentry
npm install @sentry/react @sentry/node
```

**Configure Sentry:**

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: 'production',
  tracesSampleRate: 1.0,
});
```

### 3. Analytics

**Google Analytics:**

```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 4. Database Backups

**Automated Backups:**

```bash
# Create backup script
nano /home/ubuntu/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
DB_NAME="bigpartner"

# Create backup
mysqldump -u user -p'password' $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/backup_$DATE.sql

# Delete backups older than 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

```bash
# Make executable
chmod +x /home/ubuntu/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/ubuntu/backup-db.sh
```

### 5. Log Monitoring

**PM2 Logs:**

```bash
# View logs
pm2 logs big-partner

# Save logs to file
pm2 logs big-partner > /var/log/bigpartner.log
```

**Nginx Logs:**

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### 6. Performance Monitoring

**New Relic (Free Tier):**

```bash
# Install New Relic
npm install newrelic
```

**Configure:**

```javascript
// newrelic.js
exports.config = {
  app_name: ['Big Partner'],
  license_key: 'your-license-key',
  logging: {
    level: 'info'
  }
};
```

### 7. Security Updates

**Regular Updates:**

```bash
# Update system packages (monthly)
sudo apt update && sudo apt upgrade -y

# Update Node.js packages (weekly)
npm outdated
npm update

# Update PM2
npm install -g pm2@latest
pm2 update
```

---

## Troubleshooting

### Issue 1: Site Not Loading

**Symptoms:**
- Browser shows "Site can't be reached"
- Connection timeout

**Solutions:**

1. **Check DNS:**
   ```bash
   nslookup bigpartner.in
   ```
   Should return your server IP.

2. **Check server status:**
   ```bash
   ssh user@server
   systemctl status nginx
   pm2 status
   ```

3. **Check firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 80
   sudo ufw allow 443
   ```

### Issue 2: 502 Bad Gateway

**Symptoms:**
- Nginx shows "502 Bad Gateway"

**Solutions:**

1. **Check Node.js app:**
   ```bash
   pm2 status
   pm2 restart big-partner
   ```

2. **Check logs:**
   ```bash
   pm2 logs big-partner --lines 50
   ```

3. **Check port:**
   ```bash
   netstat -tulpn | grep 3000
   ```

### Issue 3: Database Connection Failed

**Symptoms:**
- API returns "Database connection error"
- 500 Internal Server Error

**Solutions:**

1. **Check DATABASE_URL:**
   ```bash
   echo $DATABASE_URL
   ```

2. **Test connection:**
   ```bash
   mysql -u user -p -h host -e "SELECT 1"
   ```

3. **Check firewall:**
   ```bash
   # Allow MySQL port
   sudo ufw allow 3306
   ```

### Issue 4: Email Not Sending

**Symptoms:**
- Contact form submits but no email received

**Solutions:**

1. **Check SMTP credentials:**
   ```bash
   # Test SMTP connection
   telnet smtp.gmail.com 587
   ```

2. **Check Gmail settings:**
   - Enable "Less secure app access"
   - Or use App Password

3. **Check logs:**
   ```bash
   pm2 logs big-partner | grep -i "email"
   ```

### Issue 5: SSL Certificate Error

**Symptoms:**
- Browser shows "Not Secure"
- SSL certificate invalid

**Solutions:**

1. **Renew certificate:**
   ```bash
   sudo certbot renew
   sudo systemctl restart nginx
   ```

2. **Check certificate:**
   ```bash
   sudo certbot certificates
   ```

3. **Force HTTPS redirect:**
   ```nginx
   # In Nginx config
   server {
       listen 80;
       server_name bigpartner.in;
       return 301 https://$server_name$request_uri;
   }
   ```

### Issue 6: Slow Performance

**Symptoms:**
- Pages load slowly
- High server load

**Solutions:**

1. **Enable caching:**
   ```nginx
   # In Nginx config
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

2. **Enable Gzip compression:**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

3. **Optimize database:**
   ```sql
   OPTIMIZE TABLE properties;
   ANALYZE TABLE properties;
   ```

4. **Add database indexes:**
   ```sql
   CREATE INDEX idx_property_type ON properties(propertyType);
   CREATE INDEX idx_price ON properties(price);
   ```

### Issue 7: Build Fails

**Symptoms:**
- `npm run build` fails
- TypeScript errors

**Solutions:**

1. **Check Node version:**
   ```bash
   node --version  # Should be 18+
   ```

2. **Clear cache:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Fix TypeScript errors:**
   ```bash
   npm run type-check
   ```

---

## Quick Reference Commands

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# View logs
vercel logs
```

### PM2

```bash
# Start app
pm2 start npm --name "big-partner" -- start

# Restart app
pm2 restart big-partner

# Stop app
pm2 stop big-partner

# View logs
pm2 logs big-partner

# Monitor
pm2 monit

# Save configuration
pm2 save

# Startup script
pm2 startup
```

### Nginx

```bash
# Test configuration
sudo nginx -t

# Restart
sudo systemctl restart nginx

# Reload (no downtime)
sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

### MySQL

```bash
# Connect to database
mysql -u user -p -h host database

# Backup database
mysqldump -u user -p database > backup.sql

# Restore database
mysql -u user -p database < backup.sql

# Show tables
mysql -u user -p -e "USE database; SHOW TABLES;"
```

### SSL (Certbot)

```bash
# Get certificate
sudo certbot --nginx -d domain.com

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# List certificates
sudo certbot certificates
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Code pushed to Git repository
- [ ] All tests passing locally
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] Domain purchased
- [ ] SSL certificate ready

### During Deployment

- [ ] Server/hosting account created
- [ ] Database created and configured
- [ ] Environment variables set
- [ ] Code deployed
- [ ] Database migrations run
- [ ] Sample data seeded
- [ ] DNS configured
- [ ] SSL certificate installed

### Post-Deployment

- [ ] All pages loading correctly
- [ ] API endpoints working
- [ ] Forms submitting successfully
- [ ] Emails sending
- [ ] Database queries working
- [ ] SSL certificate valid
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Monitoring configured
- [ ] Backups scheduled

---

## Support & Resources

### Documentation

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Vercel Documentation](https://vercel.com/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Community

- [Stack Overflow](https://stackoverflow.com/)
- [GitHub Discussions](https://github.com/)
- [Discord Communities](https://discord.com/)

### Paid Support

- [Vercel Support](https://vercel.com/support)
- [AWS Support](https://aws.amazon.com/support/)
- [DigitalOcean Support](https://www.digitalocean.com/support/)

---

## Conclusion

You now have a **complete deployment guide** for your Big Partner website! 

**Recommended Path:**
1. Start with **Vercel + PlanetScale** (easiest, free tier)
2. If you need more control, move to **DigitalOcean** ($21/month)
3. For enterprise scale, use **AWS** (pay-as-you-go)

**Next Steps:**
1. Choose your deployment platform
2. Set up database
3. Configure environment variables
4. Deploy application
5. Configure domain
6. Test thoroughly
7. Set up monitoring

**Your website is production-ready!** 🚀

---

**Questions?** Feel free to ask for help with any specific deployment step!
