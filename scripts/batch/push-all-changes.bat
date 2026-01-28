@echo off
cd /d "%~dp0\..\.."

echo Staging all changes...
git add .

echo.
echo Committing changes...
git commit -m "Add blog navigation and fix build dependencies

- Add Blog link to header navigation menu
- Add missing SEO, analytics, and UI components to git
- Rebuild blog page with category filtering functionality
- Add 3 new blog articles (ROI, Supplier Coordination, Real-Time Management)
- Improve article layout with tables and compact formatting"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done!
pause
