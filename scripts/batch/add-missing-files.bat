@echo off
cd /d "%~dp0\..\.."

echo Adding missing files to git...
git add lib/analytics/
git add lib/seo/
git add components/ui/Breadcrumbs.tsx
git add components/blog/BlogViewTracker.tsx
git add app/blog/
git add components/blog/

echo.
echo Files staged. Run 'git commit' and 'git push' to complete.
