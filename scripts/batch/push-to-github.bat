@echo off
cd /d "%~dp0\..\.."
git init
git add .
git commit -m "Initial commit" 2>nul || echo No new files to commit, continuing...
git remote add origin https://github.com/Mego9410/whosintheroom.git 2>nul || git remote set-url origin https://github.com/Mego9410/whosintheroom.git
git branch -M main
git push -u origin main
pause
