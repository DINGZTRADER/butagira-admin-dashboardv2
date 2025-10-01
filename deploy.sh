#!/bin/bash

# Deployment script for Butagira & Co. Advocates Admin Dashboard
# Usage: ./deploy.sh [dev|prod|stop|logs|status]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before running again"
        exit 1
    fi
    
    print_status "Requirements check passed ✅"
}

deploy_dev() {
    print_status "Deploying in development mode..."
    docker-compose -f docker-compose.dev.yml up -d
    print_status "Development deployment complete!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:3001"
    print_status "MinIO Console: http://localhost:9001"
}

deploy_prod() {
    print_status "Deploying in production mode..."
    docker-compose up -d --build
    print_status "Production deployment complete!"
    print_status "Application: http://localhost:3000"
    print_status "API: http://localhost:3001"
    print_status "MinIO Console: http://localhost:9001"
}

stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    print_status "All services stopped"
}

show_logs() {
    print_status "Showing service logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

show_status() {
    print_status "Service status:"
    docker-compose ps
    echo
    print_status "Resource usage:"
    docker stats --no-stream
}

backup_data() {
    print_status "Creating backup..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_dir="backups/$timestamp"
    mkdir -p "$backup_dir"
    
    # Backup database
    docker-compose exec -T db pg_dump -U postgres butagira > "$backup_dir/database.sql"
    
    # Backup volumes
    docker run --rm -v butagira_pgdata:/source -v "$(pwd)/$backup_dir":/backup alpine tar czf /backup/pgdata.tar.gz -C /source .
    docker run --rm -v butagira_miniodata:/source -v "$(pwd)/$backup_dir":/backup alpine tar czf /backup/miniodata.tar.gz -C /source .
    
    print_status "Backup created in $backup_dir"
}

show_help() {
    echo "Butagira & Co. Advocates Admin Dashboard - Deployment Script"
    echo
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  dev      Deploy in development mode with hot reload"
    echo "  prod     Deploy in production mode"
    echo "  stop     Stop all services"
    echo "  logs     Show service logs"
    echo "  status   Show service status and resource usage"
    echo "  backup   Create backup of data"
    echo "  help     Show this help message"
    echo
    echo "Examples:"
    echo "  $0 dev       # Start development environment"
    echo "  $0 prod      # Start production environment"
    echo "  $0 logs      # View logs"
    echo "  $0 stop      # Stop all services"
}

# Main script logic
case "${1:-help}" in
    "dev")
        check_requirements
        deploy_dev
        ;;
    "prod")
        check_requirements
        deploy_prod
        ;;
    "stop")
        stop_services
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "backup")
        backup_data
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac