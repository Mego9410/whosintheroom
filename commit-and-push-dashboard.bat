@echo off
cd /d "%~dp0"

echo ========================================
echo Committing and Pushing to Dashboard
echo ========================================
echo.

echo Checking current branch...
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i
echo Current branch: %CURRENT_BRANCH%
echo.

echo Checking git status...
git status --short
echo.

echo Checking for uncommitted changes...
git diff --quiet
if %errorlevel% equ 0 (
    git diff --cached --quiet
    if %errorlevel% equ 0 (
        echo No uncommitted changes found.
        echo.
        echo Checking if Dashboard branch needs to be created or updated...
        git show-ref --verify --quiet refs/heads/Dashboard
        if %errorlevel% neq 0 (
            echo Dashboard branch does not exist locally. Creating it...
            git checkout -b Dashboard
        ) else (
            if not "%CURRENT_BRANCH%"=="Dashboard" (
                echo Switching to Dashboard branch...
                git checkout Dashboard
                echo Merging %CURRENT_BRANCH% into Dashboard...
                git merge %CURRENT_BRANCH% --no-edit
            )
        )
    ) else (
        echo Found staged changes. Committing...
        goto :commit
    )
) else (
    echo Found uncommitted changes. Staging all changes...
    git add .
    goto :commit
)

:commit
echo.
echo Staging all changes...
git add .

echo.
echo Committing changes...
git commit -m "Update Dashboard branch with latest changes

- Auto-commit from batch script
- Date: %date% %time%"

if %errorlevel% neq 0 (
    echo Warning: Commit may have failed or there were no changes to commit.
)

echo.
echo Ensuring we're on Dashboard branch...
git show-ref --verify --quiet refs/heads/Dashboard
if %errorlevel% neq 0 (
    echo Creating Dashboard branch...
    git checkout -b Dashboard
) else (
    if not "%CURRENT_BRANCH%"=="Dashboard" (
        echo Switching to Dashboard branch...
        git checkout Dashboard
        echo Merging %CURRENT_BRANCH% into Dashboard...
        git merge %CURRENT_BRANCH% --no-edit
    )
)

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
    echo.
    echo Please check:
    echo 1. Do you have uncommitted changes that need to be committed?
    echo 2. Are there merge conflicts that need to be resolved?
    echo 3. Do you have permission to push to the remote repository?
)

echo.
pause
