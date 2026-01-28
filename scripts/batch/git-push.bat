@echo off
cd /d "%~dp0\..\.."

echo Staging all changes...
git add .

echo.
echo Committing changes...
git commit -m "Fix Suspense boundary errors and rebrand to GuestSync

- Fix useSearchParams Suspense boundary errors in GoogleAnalytics
- Remove useSearchParams, use window.location instead
- Wrap GoogleAnalytics in Suspense boundary
- Update email addresses to guestsync.com domain
- Change 'Who's in the Room' to 'GuestSync' in WaitlistForm
- Add Blog link to header navigation menu"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done!
pause
