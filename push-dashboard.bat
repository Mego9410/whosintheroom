@echo off
cd /d "%~dp0"

echo Getting current branch name...
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i
echo Current branch: %CURRENT_BRANCH%

echo.
echo Checking if Dashboard branch exists locally...
git show-ref --verify --quiet refs/heads/Dashboard
if %errorlevel% neq 0 (
    echo Dashboard branch does not exist locally. Creating it from %CURRENT_BRANCH%...
    git checkout -b Dashboard
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
    echo Merging %CURRENT_BRANCH% into Dashboard...
    git merge %CURRENT_BRANCH% --no-edit
    if %errorlevel% neq 0 (
        echo Warning: Merge had conflicts or errors. Please resolve manually.
    )
)

echo.
echo Pushing Dashboard branch to origin...
git push -u origin Dashboard

if %errorlevel% equ 0 (
    echo.
    echo Successfully pushed to Dashboard branch!
) else (
    echo.
    echo Error: Failed to push to Dashboard branch
)

echo.
pause
