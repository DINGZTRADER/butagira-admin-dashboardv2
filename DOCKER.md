# 🐳 Docker Deployment Guide
## Butagira & Co. Advocates Admin Dashboard

This guide explains how to deploy the Butagira & Co. Advocates Admin Dashboard using Docker and Docker Compose.

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- At least 4GB of available RAM
- Gemini API Key from Google AI Studio

## 🚀 Quick Start

### 1. Clone and Setup Environment

```bash
# Navigate to the project directory
cd butagira-&-co.-advocates---admin-dashboard

# Copy environment template
copy .env.example .env
# or on Linux/Mac
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file and add your configuration:

```env
# Required: Your Gemini API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional: Customize other settings
POSTGRES_PASSWORD=your_secure_password
REDIS_PASSWORD=your_redis_password
```

### 3. Deploy with Docker Compose

#### Production Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

#### Development Deployment
```bash
# Use development configuration
docker-compose -f docker-compose.dev.yml up -d

# For development with hot reload
docker-compose -f docker-compose.dev.yml up
```

## 🏗️ Architecture Overview

The application consists of the following services:

### Frontend Service
- **Technology**: React + Vite + TypeScript
- **Port**: 3000 (mapped to host)
- **Features**: 
  - Multi-stage Docker build for optimization
  - Nginx for production serving
  - Gzip compression and security headers
  - Client-side routing support

### Backend Service
- **Technology**: NestJS + TypeScript
- **Port**: 3001 (mapped to host)
- **Features**:
  - RESTful API
  - Health checks
  - Security best practices

### Supporting Services
- **PostgreSQL 15**: Primary database (port 5432)
- **Redis 7**: Caching and session storage (port 6379)
- **MinIO**: S3-compatible object storage (ports 9000, 9001)

## 🔧 Service Management

### View Service Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ destroys data)
docker-compose down -v
```

### Restart Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart frontend
```

### Update Services
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild without cache
docker-compose build --no-cache
```

## 🌐 Access Points

Once deployed, you can access:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **MinIO Console**: http://localhost:9001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🛠️ Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API Key | - | ✅ |
| `POSTGRES_PASSWORD` | Database password | postgres | ⚠️ |
| `REDIS_PASSWORD` | Redis password | redis123 | ⚠️ |
| `NODE_ENV` | Environment mode | production | ❌ |
| `DATABASE_URL` | PostgreSQL connection string | auto-generated | ❌ |

### Volume Mounts

The following data is persisted in Docker volumes:

- `pgdata`: PostgreSQL database files
- `redisdata`: Redis data
- `miniodata`: MinIO object storage

## 🔒 Security Considerations

### Production Deployment Checklist

- [ ] Change default database passwords
- [ ] Use strong Redis password
- [ ] Configure proper network security
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Regular backup strategy
- [ ] Monitor logs and health checks

### Recommended Security Updates

1. **Update passwords in `.env`**:
```env
POSTGRES_PASSWORD=your_very_secure_database_password
REDIS_PASSWORD=your_very_secure_redis_password
```

2. **Use Docker secrets for production**:
```yaml
secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
  redis_password:
    file: ./secrets/redis_password.txt
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
netstat -an | findstr :3000

# Stop conflicting services or change ports in docker-compose.yml
```

#### 2. Database Connection Issues
```bash
# Check database service status
docker-compose logs db

# Verify database is ready
docker-compose exec db pg_isready -U postgres
```

#### 3. Frontend Build Fails
```bash
# Check build logs
docker-compose logs frontend

# Rebuild with verbose output
docker-compose build --no-cache frontend
```

#### 4. Memory Issues
```bash
# Check Docker resource usage
docker stats

# Increase Docker Desktop memory allocation in settings
```

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:3000/health  # Frontend
curl http://localhost:3001/health  # Backend
```

## 📊 Monitoring

### View Resource Usage
```bash
# Real-time resource usage
docker stats

# Specific service stats
docker stats butagira_frontend_1
```

### Log Management
```bash
# Follow logs with timestamps
docker-compose logs -f -t

# Export logs to file
docker-compose logs > application.log
```

## 🔄 Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec db pg_dump -U postgres butagira > backup.sql

# Restore backup
docker-compose exec -T db psql -U postgres butagira < backup.sql
```

### Volume Backup
```bash
# Backup all volumes
docker run --rm -v butagira_pgdata:/source -v $(pwd):/backup alpine tar czf /backup/pgdata_backup.tar.gz -C /source .
```

## 🚦 Scaling

### Horizontal Scaling
```bash
# Scale specific services
docker-compose up -d --scale frontend=3 --scale backend=2
```

### Load Balancing
For production load balancing, consider:
- Nginx upstream configuration
- Docker Swarm mode
- Kubernetes deployment

## 📞 Support

For issues specific to the Docker deployment:

1. Check the logs: `docker-compose logs`
2. Verify environment variables: `docker-compose config`
3. Check service health: `docker-compose ps`
4. Review resource usage: `docker stats`

## 🏷️ Version Information

- **Docker Compose Version**: 3.9
- **Node.js Version**: 20 Alpine
- **PostgreSQL Version**: 15 Alpine
- **Redis Version**: 7 Alpine
- **Nginx Version**: Alpine