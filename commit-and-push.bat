@echo off
cd /d "%~dp0"

echo Checking git status...
git status

echo.
echo Staging changes (excluding .env.local)...
git add app/
git add components/
git add lib/
git add migrations/
git add .env.example
git add *.json
git add *.js
git add *.ts
git add *.config.*
git add *.md
git add .gitignore

echo.
echo Committing changes...
git commit -m "Connect waitlist form to Supabase

- Add waitlist API route with validation and error handling
- Update WaitlistForm to call API endpoint
- Create Supabase server client with service role key support
- Add database migration files for waitlist table
- Update .env.example with service role key documentation"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done!
pause
