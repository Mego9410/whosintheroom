@echo off
cd /d "%~dp0\..\.."

echo Staging changes...
git add components/landing/Hero.tsx
git add components/landing/Features.tsx
git add components/landing/HowItWorks.tsx
git add components/landing/AnimatedMockup.tsx
git add app/globals.css

echo.
echo Committing changes...
git commit -m "Update hero section and messaging

- Replace static mockup with animated guest list component
- Add staggered animations and score counting effects
- Clean up text-heavy hero section messaging
- Update all messaging to emphasize audience understanding and team/supplier collaboration
- Update hero, features, and how-it-works sections with collaboration focus"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done!
pause
