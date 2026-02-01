# 🚀 BharatFirstTV VPS Deployment with OpenAI API

## 📋 Complete Deployment Commands

### Step 1: VPS Login
```bash
ssh root@161.97.121.55
```

### Step 2: Create Project Directory
```bash
mkdir -p /var/www/bharatfirsttv
cd /var/www/bharatfirsttv
```

### Step 3: Clone Repository
```bash
git clone https://github.com/jobyojnahub-a11y/bharatfirttv.git .
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Create Environment File with OpenAI API Key
```bash
cat > .env.local << 'EOF'
OPENAI_API_KEY=your_openai_api_key_here
WORDPRESS_API_URL=https://blog.bharatfirsttv.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://bharatfirsttv.com
EOF
```

**⚠️ Important:** Replace `your_openai_api_key_here` with your actual OpenAI API key that starts with `sk-proj-`

### Step 6: Build Project
```bash
npm run build
```

### Step 7: Start with PM2
```bash
pm2 start ecosystem.config.js
```

### Step 8: Setup Nginx
```bash
# Copy nginx config
cp nginx-bharatfirsttv.conf /etc/nginx/sites-available/bharatfirsttv.com

# Enable site
ln -s /etc/nginx/sites-available/bharatfirsttv.com /etc/nginx/sites-enabled/

# Test nginx config
nginx -t

# Restart nginx
systemctl restart nginx
```

### Step 9: Setup SSL (Optional)
```bash
certbot --nginx -d bharatfirsttv.com
```

### Step 10: Check Status
```bash
pm2 status
pm2 logs bharatfirsttv
```

## 🔑 OpenAI API Features

### ✅ What's Ready:
- **AI Image Generation** for blog posts without featured images
- **Category-based prompts** for relevant images
- **Fallback system** if API fails
- **Automatic integration** with WordPress posts

### 🎯 How It Works:
1. WordPress post fetched
2. If no featured image found
3. AI generates image based on title + category
4. Falls back to Unsplash if AI fails

### 📊 API Usage:
- **Model:** DALL-E 3
- **Size:** 1024x1024 (high quality)
- **Prompts:** News-appropriate, Indian context
- **Cost:** ~$0.04 per image

## 🔄 Update Commands (For Future Changes)
```bash
cd /var/www/bharatfirsttv
git pull origin main
npm install
npm run build
pm2 restart bharatfirsttv
```

## 🌐 Final URLs:
- **Homepage:** https://bharatfirsttv.com
- **Blog:** https://bharatfirsttv.com/blog
- **Individual Posts:** https://bharatfirsttv.com/blog/[slug]

## 🎉 Features:
✅ WordPress Blog Integration  
✅ AI Image Generation  
✅ Professional News Layout  
✅ Mobile Responsive  
✅ SEO Optimized  
✅ Comments System  
✅ Social Sharing  
✅ Newsletter Signup  

**Your website is ready to go live! 🚀**