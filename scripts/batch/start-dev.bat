@echo off
cd /d "%~dp0\..\.."
echo ========================================
echo Starting Development Server
echo ========================================
echo.
echo Current directory: %CD%
echo.

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the whosintheroom directory.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo WARNING: node_modules not found!
    echo Installing dependencies first...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
)

echo Starting Next.js development server...
echo The app will be available at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
