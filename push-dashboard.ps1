# Push current branch to remote Dashboard branch
Write-Host "Pushing current branch to Dashboard branch..." -ForegroundColor Cyan

$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow

Write-Host "`nPushing to origin Dashboard..." -ForegroundColor Cyan
git push origin HEAD:Dashboard

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed to Dashboard branch!" -ForegroundColor Green
} else {
    Write-Host "`nError: Failed to push to Dashboard branch" -ForegroundColor Red
    exit 1
}
