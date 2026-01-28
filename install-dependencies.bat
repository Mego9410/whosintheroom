@echo off
echo Installing dependencies for Who's In The Room...
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please make sure you're in the whosintheroom directory.
    pause
    exit /b 1
)

echo Removing old lock file...
if exist "package-lock.json" del /f /q "package-lock.json"

echo Removing node_modules...
if exist "node_modules" (
    rmdir /s /q "node_modules"
)

echo.
echo Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Dependencies installed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Installation failed. Trying with --legacy-peer-deps...
    echo ========================================
    call npm install --legacy-peer-deps
)

pause
