const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

// Helper function to move files/folders
function moveItem(source, dest) {
    try {
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        fs.renameSync(source, dest);
        console.log(`Moved: ${path.basename(source)}`);
        return true;
    } catch (error) {
        console.error(`Error moving ${source}: ${error.message}`);
        return false;
    }
}

// Move AI agent folders (except .cursor) to .ai-agents
const agentFolders = ['.agent', '.agents', '.claude', '.cline', '.codex', '.commandcode', '.continue', '.crush', '.factory', '.gemini', '.github', '.goose', '.kilocode', '.kiro', '.mcpjam', '.neovate', '.opencode', '.openhands', '.pi', '.qoder', '.qwen', '.roo', '.trae', '.windsurf', '.zencoder'];

console.log('Moving AI agent folders...');
agentFolders.forEach(folder => {
    const source = path.join(projectRoot, folder);
    const dest = path.join(projectRoot, '.ai-agents', folder);
    if (fs.existsSync(source)) {
        moveItem(source, dest);
    }
});

// Move batch files to scripts/batch
const batchFiles = ['clean-install.bat', 'commit-and-push.bat', 'commit-hero-updates.bat', 'install-dependencies.bat', 'push-changes.bat', 'push-to-github.bat', 'push-vercel-fixes.bat', 'start-dev.bat', 'verify-and-install.bat'];

console.log('\nMoving batch files...');
batchFiles.forEach(file => {
    const source = path.join(projectRoot, file);
    const dest = path.join(projectRoot, 'scripts', 'batch', file);
    if (fs.existsSync(source)) {
        moveItem(source, dest);
    }
});

// Move Python scripts to scripts/python
const pythonFiles = ['add_phase2_features.py', 'insert_phase2.py'];

console.log('\nMoving Python scripts...');
pythonFiles.forEach(file => {
    const source = path.join(projectRoot, file);
    const dest = path.join(projectRoot, 'scripts', 'python', file);
    if (fs.existsSync(source)) {
        moveItem(source, dest);
    }
});

// Move documentation files to docs (except README.md)
const docFiles = ['NAME_SUGGESTIONS.md', 'REDDIT_PROMOTION_GUIDE.md', 'phase2_additions.md'];

console.log('\nMoving documentation files...');
docFiles.forEach(file => {
    const source = path.join(projectRoot, file);
    const dest = path.join(projectRoot, 'docs', file);
    if (fs.existsSync(source)) {
        moveItem(source, dest);
    }
});

console.log('\nOrganization complete!');
