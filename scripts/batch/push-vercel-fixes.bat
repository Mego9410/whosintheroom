@echo off
cd /d "%~dp0\..\.."

echo Staging changes...
git add components/landing/Header.tsx
git add components/landing/Hero.tsx

echo.
echo Committing changes...
git commit -m "Fix Header and button issues on Vercel deployment

- Remove mounted state check from Header to prevent rendering issues
- Add error handling and window checks to scroll functions
- Add fallback scrolling with delay for elements not ready yet
- Ensure Header always renders in production"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done!
pause
