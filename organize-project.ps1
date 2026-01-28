# Script to organize project files and folders
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Move AI agent folders (except .cursor) to .ai-agents
$agentFolders = @('.agent', '.agents', '.claude', '.cline', '.codex', '.commandcode', '.continue', '.crush', '.factory', '.gemini', '.github', '.goose', '.kilocode', '.kiro', '.mcpjam', '.neovate', '.opencode', '.openhands', '.pi', '.qoder', '.qwen', '.roo', '.trae', '.windsurf', '.zencoder')

foreach ($folder in $agentFolders) {
    $source = Join-Path $projectRoot $folder
    $dest = Join-Path $projectRoot ".ai-agents\$folder"
    if (Test-Path $source) {
        Write-Host "Moving $folder to .ai-agents..."
        Move-Item -Path $source -Destination $dest -Force -ErrorAction SilentlyContinue
    }
}

# Move batch files to scripts/batch
$batchFiles = @('clean-install.bat', 'commit-and-push.bat', 'commit-hero-updates.bat', 'install-dependencies.bat', 'push-changes.bat', 'push-to-github.bat', 'push-vercel-fixes.bat', 'start-dev.bat', 'verify-and-install.bat')

foreach ($file in $batchFiles) {
    $source = Join-Path $projectRoot $file
    $dest = Join-Path $projectRoot "scripts\batch\$file"
    if (Test-Path $source) {
        Write-Host "Moving $file to scripts/batch..."
        Move-Item -Path $source -Destination $dest -Force -ErrorAction SilentlyContinue
    }
}

# Move Python scripts to scripts/python
$pythonFiles = @('add_phase2_features.py', 'insert_phase2.py')

foreach ($file in $pythonFiles) {
    $source = Join-Path $projectRoot $file
    $dest = Join-Path $projectRoot "scripts\python\$file"
    if (Test-Path $source) {
        Write-Host "Moving $file to scripts/python..."
        Move-Item -Path $source -Destination $dest -Force -ErrorAction SilentlyContinue
    }
}

# Move documentation files to docs (except README.md)
$docFiles = @('NAME_SUGGESTIONS.md', 'REDDIT_PROMOTION_GUIDE.md', 'phase2_additions.md')

foreach ($file in $docFiles) {
    $source = Join-Path $projectRoot $file
    $dest = Join-Path $projectRoot "docs\$file"
    if (Test-Path $source) {
        Write-Host "Moving $file to docs..."
        Move-Item -Path $source -Destination $dest -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Organization complete!"
