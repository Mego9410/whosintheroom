@echo off
cd /d "%~dp0"
echo Cleaning npm cache and installing dependencies...
call npm cache clean --force
echo.
echo Installing npm dependencies...
call npm install
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Dependencies installed successfully!
    echo.
    echo Next steps:
    echo 1. Set up your Supabase project at https://supabase.com
    echo 2. Update .env.local with your Supabase credentials
    echo 3. Run the database migration from migrations/001_waitlist_table.sql in Supabase SQL Editor
    echo 4. Run 'npm run dev' to start the development server
) else (
    echo.
    echo Error installing dependencies. Trying with --legacy-peer-deps flag...
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo Dependencies installed successfully with --legacy-peer-deps!
    ) else (
        echo.
        echo Error installing dependencies. Please check the error messages above.
    )
)
pause
