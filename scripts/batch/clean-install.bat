@echo off
cd /d "%~dp0\..\.."
echo ========================================
echo Cleaning and Installing Dependencies
echo ========================================
echo.

echo Step 1: Removing node_modules (if exists)...
if exist node_modules (
    echo Found node_modules, removing...
    rmdir /s /q node_modules
    echo node_modules removed.
) else (
    echo node_modules not found, skipping.
)
echo.

echo Step 2: Removing package-lock.json (if exists)...
if exist package-lock.json (
    del /f /q package-lock.json
    echo package-lock.json removed.
) else (
    echo package-lock.json not found, skipping.
)
echo.

echo Step 3: Cleaning npm cache...
call npm cache clean --force
echo.

echo Step 4: Installing dependencies...
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
    echo Installation failed. Trying with --legacy-peer-deps...
    echo ========================================
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo SUCCESS! Dependencies installed with --legacy-peer-deps.
        echo ========================================
    ) else (
        echo.
        echo ========================================
        echo ERROR: Installation failed.
        echo ========================================
        echo Please check the error messages above.
    )
)
echo.
pause
