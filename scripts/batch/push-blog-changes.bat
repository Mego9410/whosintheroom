@echo off
cd /d "%~dp0\..\.."

echo Staging blog-related changes...
git add app/blog/
git add components/blog/
git add lib/blog/

echo.
echo Committing changes...
git commit -m "Rebuild blog page with category filtering

- Rebuilt blog page from scratch to fix webpack errors
- Added BlogListing component with category filtering
- Implemented client-side filtering with hydration fix
- Added 3 new blog articles (ROI, Supplier Coordination, Real-Time Management)
- Improved article layout with tables and compact formatting
- Fixed cookie-related hydration issues"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done!
pause
