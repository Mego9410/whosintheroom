@echo off
cd /d "%~dp0\..\.."

echo Checking git status...
git status

echo.
echo Staging project changes...
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
echo Committing...
git commit -m "Landing page updates: footer, legal pages, layout, buttons

- Add Footer with nav links and Privacy/Terms
- Add Privacy Policy and Terms & Conditions pages
- Header/Footer link to home sections when on legal pages
- Larger Hero CTAs (Join Waitlist, See How It Works) and Get early access buttons
- Remove scroll indicator; reduce hero top padding; condense section spacing
- Tweak HowItWorks/Features padding"

echo.
echo Pushing to remote...
git push

echo.
echo Done.
pause
