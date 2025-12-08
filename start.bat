@echo off
echo ========================================
echo Destiny AI - Quick Start Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo [ACTION REQUIRED] Please edit .env file and add your API keys
    echo Press any key to open .env file...
    pause >nul
    notepad .env
)

REM Check if node_modules exists
if not exist node_modules (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
)

REM Start the server
echo ========================================
echo Starting Destiny AI Server...
echo ========================================
echo.
echo Server will start on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Check if we should use dev mode
if "%1"=="dev" (
    echo [DEV MODE] Starting with nodemon...
    call npm run dev
) else (
    echo [PRODUCTION MODE] Starting server...
    call npm start
)

pause
