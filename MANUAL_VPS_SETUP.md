# 🚀 Manual VPS Setup for BharatFirstTV

## 📋 Step-by-Step Commands

### Step 1: Basic Setup
```bash
ssh root@161.97.121.55
cd /var/www/bharatfirsttv
git pull origin main
npm run build
```

### Step 2: Manual API Key Setup
```bash
# Edit the openai.ts file directly on VPS
nano /var/www/bharatfirsttv/lib/openai.ts
```

**Find this line (around line 19):**
```typescript
const apiKey = process.env.OPENAI_API_KEY || 'API_KEY_PLACEHOLDER'
```

**Replace with your actual OpenAI API key:**
```typescript
const apiKey = 'YOUR_OPENAI_API_KEY_HERE'
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 3: Rebuild and Start
```bash
npm run build
pm2 start ecosystem.config.js
pm2 status
```

### Step 4: Nginx Setup
```bash
cp nginx-bharatfirsttv.conf /etc/nginx/sites-available/bharatfirsttv.com
ln -s /etc/nginx/sites-available/bharatfirsttv.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 🎯 Alternative Method (Sed Command)
```bash
# One-liner to replace API key (replace YOUR_API_KEY with actual key)
sed -i "s/API_KEY_PLACEHOLDER/YOUR_OPENAI_API_KEY_HERE/g" /var/www/bharatfirsttv/lib/openai.ts
```

## 🔍 Verify Setup
```bash
# Check if API key is set
grep -n "sk-proj" /var/www/bharatfirsttv/lib/openai.ts

# Check PM2 status
pm2 logs bharatfirsttv

# Check website
curl -I http://localhost:3001
```

## 🌐 Final URLs
- **Homepage:** https://bharatfirsttv.com
- **Blog:** https://bharatfirsttv.com/blog

**✅ Your website will be live with AI image generation!**