# 🚀 BharatFirstTV VPS Deployment Guide

## Step 1: VPS Login
```bash
ssh root@161.97.121.55
```

## Step 2: Create Project Directory
```bash
cd /var/www
mkdir bharatfirsttv
cd bharatfirsttv
```

## Step 3: Clone Repository
```bash
git clone https://github.com/jobyojnahub-a11y/bharatfirttv.git .
```

## Step 4: Install Dependencies
```bash
npm install
```

## Step 5: Build Project
```bash
npm run build
```

## Step 6: PM2 Configuration
Create ecosystem file:
```bash
nano ecosystem.config.js
```

Add this content:
```javascript
module.exports = {
  apps: [{
    name: 'bharatfirsttv',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/bharatfirsttv',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
```

## Step 7: Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 8: Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/bharatfirsttv
```

Add this content:
```nginx
server {
    listen 80;
    server_name bharatfirsttv.com www.bharatfirsttv.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3001;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

## Step 9: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/bharatfirsttv /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 10: SSL Certificate
```bash
sudo certbot --nginx -d bharatfirsttv.com -d www.bharatfirsttv.com
```

## Step 11: Domain Configuration
Point your domain `bharatfirsttv.com` to VPS IP: `161.97.121.55`

### DNS Records:
- A Record: `bharatfirsttv.com` → `161.97.121.55`
- A Record: `www.bharatfirsttv.com` → `161.97.121.55`

## Quick Deploy Commands (Copy-Paste Ready):
```bash
# Login to VPS
ssh root@161.97.121.55

# Create and setup project
cd /var/www && mkdir bharatfirsttv && cd bharatfirsttv
git clone https://github.com/jobyojnahub-a11y/bharatfirttv.git .
npm install
npm run build

# PM2 setup
pm2 start ecosystem.config.js
pm2 save

# Check status
pm2 status
```

## 🎯 Final Result:
- **Website:** https://bharatfirsttv.com
- **Port:** 3001 (internal)
- **SSL:** Auto-configured
- **PM2:** Auto-restart enabled

## 📝 Notes:
- Make sure domain DNS is pointed to VPS IP
- SSL certificate will be auto-renewed
- PM2 will restart app automatically on server reboot