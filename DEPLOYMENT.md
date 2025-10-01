# 🌐 Cloud Deployment Guide
## Butagira & Co. Advocates Admin Dashboard

This guide helps you deploy your containerized admin dashboard to various cloud platforms for client access.

## 🚀 Quick Start - Railway (Recommended)

**Railway** is the easiest way to deploy Docker applications with automatic HTTPS and custom domains.

### Step 1: Prepare Your Repository
```bash
# Ensure all files are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. Visit [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect your Docker setup

### Step 3: Configure Environment Variables
In Railway dashboard, add these environment variables:
```
GEMINI_API_KEY=your_actual_gemini_api_key
NODE_ENV=production
PORT=3001
```

### Step 4: Get Your URL
- Railway provides a free subdomain: `https://your-app.railway.app`
- Add custom domain in Railway dashboard for professional URL

**✅ Your app will be live in 2-3 minutes!**

---

## 🌊 DigitalOcean App Platform

**Cost**: $5-12/month | **Features**: Custom domains, auto-scaling, managed databases

### Step 1: Create App
1. Visit [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click "Create App" → Connect GitHub
3. Select your repository

### Step 2: Configure Build Settings
```yaml
# Frontend Configuration
Name: frontend
Source Directory: /
Build Command: docker build -f Dockerfile.frontend .
Run Command: nginx -g 'daemon off;'
HTTP Port: 80

# Backend Configuration  
Name: backend
Source Directory: /backend
Build Command: docker build -f Dockerfile.backend .
Run Command: node dist/main.js
HTTP Port: 3001
```

### Step 3: Environment Variables
```
GEMINI_API_KEY=your_key
NODE_ENV=production
DATABASE_URL=your_managed_db_url
```

### Step 4: Add Database (Optional)
- Add managed PostgreSQL database
- DigitalOcean will auto-configure DATABASE_URL

---

## 🟣 Heroku Deployment

**Cost**: $7-25/month per service | **Features**: Easy scaling, add-ons ecosystem

### Prerequisites
```bash
# Install Heroku CLI
npm install -g heroku
```

### Frontend Deployment
```bash
# Create Heroku app for frontend
heroku create butagira-frontend

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key --app butagira-frontend
heroku config:set NODE_ENV=production --app butagira-frontend

# Deploy
git subtree push --prefix frontend heroku main
```

### Backend Deployment
```bash
# Create Heroku app for backend
heroku create butagira-backend

# Add PostgreSQL add-on
heroku addons:create heroku-postgresql:mini --app butagira-backend

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key --app butagira-backend
heroku config:set NODE_ENV=production --app butagira-backend

# Deploy
git subtree push --prefix backend heroku main
```

---

## 🖥️ VPS/Cloud Server (Advanced)

**Cost**: $5-20/month | **Full Control**: Custom configurations, multiple apps

### Step 1: Server Setup
```bash
# Ubuntu 20.04+ server
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/butagira-admin-dashboard.git
cd butagira-admin-dashboard

# Configure environment
cp .env.production .env
# Edit .env with your values

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Step 3: Set Up Reverse Proxy (Nginx)
```bash
# Install Nginx
sudo apt install nginx

# Configure domain
sudo nano /etc/nginx/sites-available/butagira
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Step 4: Enable HTTPS with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔐 Security Checklist for Production

### Environment Variables
- [ ] Strong, unique `JWT_SECRET`
- [ ] Secure `SESSION_SECRET`
- [ ] Valid `GEMINI_API_KEY`
- [ ] Proper `DATABASE_URL`
- [ ] Correct `CORS_ORIGIN`

### Domain & SSL
- [ ] Custom domain configured
- [ ] HTTPS/SSL certificate installed
- [ ] HTTP redirects to HTTPS
- [ ] Security headers configured

### Database
- [ ] Use managed database service
- [ ] Regular backups enabled
- [ ] Strong database password
- [ ] Network access restricted

### Monitoring
- [ ] Health checks configured
- [ ] Error logging enabled
- [ ] Uptime monitoring set up
- [ ] Resource usage alerts

---

## 🎯 Recommended Deployment Flow

### For Quick Demo/Testing
1. **Railway** - Deploy in 2 minutes, free tier available
2. Share link: `https://your-app.railway.app`

### For Professional Client Access
1. **DigitalOcean App Platform** - $5/month, custom domain
2. Add managed database: +$15/month
3. Custom domain: `https://admin.butagira.co.ug`

### For Full Production
1. **AWS/Google Cloud/VPS** - $10-50/month
2. Multiple environments (staging/production)
3. CDN, monitoring, backups
4. Load balancing for high availability

---

## 📞 Post-Deployment Checklist

### Test Everything
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Document upload works
- [ ] AI features functional
- [ ] Mobile responsive
- [ ] HTTPS working

### Share with Clients
- [ ] Create demo user account
- [ ] Prepare user documentation
- [ ] Test on different devices
- [ ] Monitor for issues
- [ ] Collect feedback

### Maintenance
- [ ] Set up automated backups
- [ ] Monitor resource usage
- [ ] Plan for scaling
- [ ] Update dependencies regularly

---

## 🆘 Troubleshooting Common Issues

### Build Failures
```bash
# Check build logs
docker-compose logs frontend
docker-compose logs backend

# Rebuild with no cache
docker-compose build --no-cache
```

### Environment Variable Issues
```bash
# Verify environment variables
docker-compose config

# Test API endpoints
curl https://your-domain.com/api/health
```

### Performance Issues
```bash
# Check resource usage
docker stats

# Scale services
docker-compose up -d --scale frontend=2
```

**Ready to go live? Choose your preferred platform and follow the guide above!** 🚀