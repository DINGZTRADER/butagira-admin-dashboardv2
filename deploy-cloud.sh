#!/bin/bash

# Deployment Guide for Butagira & Co. Advocates Admin Dashboard
# Choose your preferred deployment method

echo "🚀 Butagira & Co. Advocates - Cloud Deployment Guide"
echo "=================================================="

show_menu() {
    echo ""
    echo "Choose your deployment platform:"
    echo "1. Railway (Recommended - Easiest)"
    echo "2. DigitalOcean App Platform"
    echo "3. Heroku"
    echo "4. Manual VPS/Cloud Server"
    echo "5. Exit"
    echo ""
}

deploy_railway() {
    echo "🚂 Deploying to Railway..."
    echo ""
    echo "Steps to deploy to Railway:"
    echo "1. Visit https://railway.app and sign up"
    echo "2. Connect your GitHub repository"
    echo "3. Create a new project from your repo"
    echo "4. Add environment variables:"
    echo "   - GEMINI_API_KEY=your_api_key"
    echo "   - NODE_ENV=production"
    echo "5. Railway will auto-deploy using your Dockerfile"
    echo ""
    echo "Your app will be available at: https://your-app.railway.app"
    echo ""
    echo "💡 Tip: Railway provides free hosting with automatic HTTPS!"
}

deploy_digitalocean() {
    echo "🌊 Deploying to DigitalOcean App Platform..."
    echo ""
    echo "Steps to deploy to DigitalOcean:"
    echo "1. Visit https://cloud.digitalocean.com/apps"
    echo "2. Create a new app from GitHub"
    echo "3. Select your repository"
    echo "4. Configure build settings:"
    echo "   - Build command: docker build -f Dockerfile.frontend ."
    echo "   - Run command: nginx -g 'daemon off;'"
    echo "5. Add environment variables in the dashboard"
    echo "6. Deploy!"
    echo ""
    echo "Cost: \$5-12/month with custom domain and HTTPS"
}

deploy_heroku() {
    echo "🟣 Deploying to Heroku..."
    echo ""
    echo "Steps to deploy to Heroku:"
    echo "1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
    echo "2. Create a new Heroku app:"
    echo "   heroku create your-app-name"
    echo "3. Set environment variables:"
    echo "   heroku config:set GEMINI_API_KEY=your_key"
    echo "4. Deploy:"
    echo "   git push heroku main"
    echo ""
    echo "Note: Heroku requires a Procfile for deployment"
}

deploy_vps() {
    echo "🖥️  Manual VPS/Cloud Server Deployment..."
    echo ""
    echo "For AWS, Google Cloud, Azure, or VPS:"
    echo "1. Create a cloud server (Ubuntu 20.04+ recommended)"
    echo "2. Install Docker and Docker Compose"
    echo "3. Clone your repository"
    echo "4. Copy .env.production to .env and configure"
    echo "5. Run: docker-compose -f docker-compose.prod.yml up -d"
    echo "6. Set up reverse proxy (Nginx) for HTTPS"
    echo ""
    echo "Estimated cost: \$5-20/month depending on provider"
}

while true; do
    show_menu
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_railway
            ;;
        2)
            deploy_digitalocean
            ;;
        3)
            deploy_heroku
            ;;
        4)
            deploy_vps
            ;;
        5)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done