@echo off
setlocal EnableDelayedExpansion

:: Deployment script for Butagira & Co. Advocates Admin Dashboard
:: Usage: deploy.bat [dev|prod|stop|logs|status|backup|help]

set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "NC=[0m"

goto main

:print_status
echo %GREEN%[INFO]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:check_requirements
call :print_status "Checking requirements..."

docker --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker is not installed or not in PATH"
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker Compose is not installed or not in PATH"
    exit /b 1
)

if not exist ".env" (
    call :print_warning ".env file not found. Creating from template..."
    copy .env.example .env >nul
    call :print_warning "Please edit .env file with your configuration before running again"
    exit /b 1
)

call :print_status "Requirements check passed ✅"
goto :eof

:deploy_dev
call :print_status "Deploying in development mode..."
docker-compose -f docker-compose.dev.yml up -d
call :print_status "Development deployment complete!"
call :print_status "Frontend: http://localhost:3000"
call :print_status "Backend: http://localhost:3001"
call :print_status "MinIO Console: http://localhost:9001"
goto :eof

:deploy_prod
call :print_status "Deploying in production mode..."
docker-compose up -d --build
call :print_status "Production deployment complete!"
call :print_status "Application: http://localhost:3000"
call :print_status "API: http://localhost:3001"
call :print_status "MinIO Console: http://localhost:9001"
goto :eof

:stop_services
call :print_status "Stopping all services..."
docker-compose down
docker-compose -f docker-compose.dev.yml down >nul 2>&1
call :print_status "All services stopped"
goto :eof

:show_logs
call :print_status "Showing service logs (Ctrl+C to exit)..."
docker-compose logs -f
goto :eof

:show_status
call :print_status "Service status:"
docker-compose ps
echo.
call :print_status "Resource usage:"
docker stats --no-stream
goto :eof

:backup_data
call :print_status "Creating backup..."
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,4%%dt:~4,2%%dt:~6,2%_%dt:~8,2%%dt:~10,2%%dt:~12,2%"
set "backup_dir=backups\%timestamp%"
mkdir "%backup_dir%" 2>nul

:: Backup database
docker-compose exec -T db pg_dump -U postgres butagira > "%backup_dir%\database.sql"

:: Backup volumes
docker run --rm -v butagira_pgdata:/source -v "%cd%\%backup_dir%":/backup alpine tar czf /backup/pgdata.tar.gz -C /source .
docker run --rm -v butagira_miniodata:/source -v "%cd%\%backup_dir%":/backup alpine tar czf /backup/miniodata.tar.gz -C /source .

call :print_status "Backup created in %backup_dir%"
goto :eof

:show_help
echo Butagira ^& Co. Advocates Admin Dashboard - Deployment Script
echo.
echo Usage: %~nx0 [COMMAND]
echo.
echo Commands:
echo   dev      Deploy in development mode with hot reload
echo   prod     Deploy in production mode
echo   stop     Stop all services
echo   logs     Show service logs
echo   status   Show service status and resource usage
echo   backup   Create backup of data
echo   help     Show this help message
echo.
echo Examples:
echo   %~nx0 dev       # Start development environment
echo   %~nx0 prod      # Start production environment
echo   %~nx0 logs      # View logs
echo   %~nx0 stop      # Stop all services
goto :eof

:main
set "command=%~1"
if "%command%"=="" set "command=help"

if "%command%"=="dev" (
    call :check_requirements
    if not errorlevel 1 call :deploy_dev
) else if "%command%"=="prod" (
    call :check_requirements
    if not errorlevel 1 call :deploy_prod
) else if "%command%"=="stop" (
    call :stop_services
) else if "%command%"=="logs" (
    call :show_logs
) else if "%command%"=="status" (
    call :show_status
) else if "%command%"=="backup" (
    call :backup_data
) else if "%command%"=="help" (
    call :show_help
) else if "%command%"=="--help" (
    call :show_help
) else if "%command%"=="-h" (
    call :show_help
) else (
    call :print_error "Unknown command: %command%"
    call :show_help
    exit /b 1
)

endlocal