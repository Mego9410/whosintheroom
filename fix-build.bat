@echo off
echo ========================================
echo Fixing Next.js Build Issues
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Stopping any running processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Removing build artifacts...
if exist ".next" (
    echo Removing .next directory...
    rmdir /s /q ".next"
    echo .next removed.
) else (
    echo .next not found.
)

if exist "node_modules\.cache" (
    echo Removing node_modules cache...
    rmdir /s /q "node_modules\.cache"
    echo Cache removed.
)

echo.
echo Step 3: Cleaning npm cache...
call npm cache clean --force

echo.
echo Step 4: Verifying package.json...
if not exist "package.json" (
    echo ERROR: package.json not found!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Ready to rebuild!
echo ========================================
echo.
echo Now run: npm run dev
echo.
echo Watch the terminal for compilation messages.
echo You should see: "Compiled /dashboard in XXXms"
echo.
pause
