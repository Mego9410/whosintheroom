@echo off
cd /d "%~dp0"

echo ========================================
echo Merge Branch to Dashboard
echo ========================================
echo.

echo Getting current branch...
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i
echo Current branch: %CURRENT_BRANCH%
echo.

echo Checking for uncommitted changes...
git status --short
git diff --quiet
if %errorlevel% neq 0 (
    echo.
    echo WARNING: You have uncommitted changes!
    echo Please commit or stash them before merging.
    echo.
    pause
    exit /b 1
)

echo.
set /p SOURCE_BRANCH="Enter the branch name to merge FROM (e.g., main, master, or press Enter for current branch): "
if "%SOURCE_BRANCH%"=="" set SOURCE_BRANCH=%CURRENT_BRANCH%

echo.
echo Checking if Dashboard branch exists locally...
git show-ref --verify --quiet refs/heads/Dashboard
if %errorlevel% neq 0 (
    echo Dashboard branch does not exist locally. Creating it from %SOURCE_BRANCH%...
    git checkout -b Dashboard %SOURCE_BRANCH%
    if %errorlevel% neq 0 (
        echo Error: Failed to create Dashboard branch
        pause
        exit /b 1
    )
) else (
    echo Dashboard branch exists. Switching to it...
    git checkout Dashboard
    if %errorlevel% neq 0 (
        echo Error: Failed to checkout Dashboard branch
        pause
        exit /b 1
    )
    echo.
    echo Merging %SOURCE_BRANCH% into Dashboard...
    git merge %SOURCE_BRANCH% --no-edit
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Merge had conflicts!
        echo Please resolve the conflicts manually, then run:
        echo   git add .
        echo   git commit
        echo   git push origin Dashboard
        pause
        exit /b 1
    )
)

echo.
echo Checking for changes to push...
git fetch origin Dashboard 2>nul
git log HEAD..origin/Dashboard --oneline >nul 2>&1
if %errorlevel% equ 0 (
    echo Remote Dashboard has commits you don't have locally.
    echo You may want to pull first: git pull origin Dashboard
    echo.
)

git log origin/Dashboard..HEAD --oneline >nul 2>&1
if %errorlevel% equ 0 (
    echo You have local commits to push.
    echo.
    echo Pushing Dashboard branch to origin...
    git push -u origin Dashboard
    
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo Successfully pushed to Dashboard branch!
        echo ========================================
    ) else (
        echo.
        echo ========================================
        echo Error: Failed to push to Dashboard branch
        echo ========================================
    )
) else (
    echo Everything is up to date - no new commits to push.
    echo.
    echo If you expected changes, make sure:
    echo 1. You've committed all your changes
    echo 2. You're merging from the correct source branch
    echo 3. The source branch has the changes you want
)

echo.
pause
