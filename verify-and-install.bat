@echo off
cd /d "%~dp0"
echo ========================================
echo Verifying Installation Directory
echo ========================================
echo Current directory: %CD%
echo.
if not exist "package.json" (
    echo ERROR: package.json not found in current directory!
    echo Please run this script from the whosintheroom directory.
    pause
    exit /b 1
)
echo Found package.json - directory is correct.
echo.
echo Checking package.json contents...
findstr /C:"next" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Next.js project detected
) else (
    echo ✗ This doesn't appear to be a Next.js project
    pause
    exit /b 1
)
echo.
echo ========================================
echo Starting Clean Installation
echo ========================================
echo.

echo Step 1: Removing node_modules (if exists)...
if exist node_modules (
    echo Found node_modules, removing...
    rmdir /s /q node_modules 2>nul
    echo node_modules removed.
) else (
    echo node_modules not found, skipping.
)
echo.

echo Step 2: Removing package-lock.json (if exists)...
if exist package-lock.json (
    del /f /q package-lock.json 2>nul
    echo package-lock.json removed.
) else (
    echo package-lock.json not found, skipping.
)
echo.

echo Step 3: Cleaning npm cache...
call npm cache clean --force
echo.

echo Step 4: Installing dependencies (using .npmrc config)...
call npm install
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Dependencies installed.
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Set up your Supabase project at https://supabase.com
    echo 2. Update .env.local with your Supabase credentials
    echo 3. Run the database migration from migrations/001_waitlist_table.sql in Supabase SQL Editor
    echo 4. Run 'npm run dev' to start the development server
) else (
    echo.
    echo ========================================
    echo Installation completed with warnings.
    echo ========================================
    echo Check the output above for any errors.
    echo If installation succeeded despite warnings, you can proceed.
)
echo.
pause
