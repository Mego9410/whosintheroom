@echo off
echo Clearing Next.js cache...
echo.

cd /d "%~dp0"

echo Removing .next directory...
if exist ".next" (
    rmdir /s /q ".next"
    echo .next directory removed.
) else (
    echo .next directory not found.
)

echo.
echo Cache cleared successfully!
echo.
echo You can now run: npm run dev
echo.
pause
