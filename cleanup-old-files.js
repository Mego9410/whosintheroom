const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

// Helper function to recursively copy directory
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Helper function to recursively delete directory
function deleteDir(dir) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
            const curPath = path.join(dir, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDir(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    }
}

// Delete old batch files from root (they're already in scripts/batch)
const batchFiles = ['clean-install.bat', 'commit-and-push.bat', 'commit-hero-updates.bat', 'install-dependencies.bat', 'push-changes.bat', 'push-to-github.bat', 'push-vercel-fixes.bat', 'start-dev.bat', 'verify-and-install.bat'];

console.log('Deleting old batch files from root...');
batchFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✓ Deleted ${file}`);
    }
});

// Delete old Python scripts from root (they're already in scripts/python)
const pythonFiles = ['add_phase2_features.py', 'insert_phase2.py'];

console.log('\nDeleting old Python scripts from root...');
pythonFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✓ Deleted ${file}`);
    }
});

// Delete old documentation files from root (they're already in docs)
const docFiles = ['NAME_SUGGESTIONS.md', 'REDDIT_PROMOTION_GUIDE.md', 'phase2_additions.md'];

console.log('\nDeleting old documentation files from root...');
docFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✓ Deleted ${file}`);
    }
});

// Move AI agent folders (except .cursor) to .ai-agents
const agentFolders = ['.agent', '.agents', '.claude', '.cline', '.codex', '.commandcode', '.continue', '.crush', '.factory', '.gemini', '.github', '.goose', '.kilocode', '.kiro', '.mcpjam', '.neovate', '.opencode', '.openhands', '.pi', '.qoder', '.qwen', '.roo', '.trae', '.windsurf', '.zencoder'];

console.log('\nMoving AI agent folders to .ai-agents...');
agentFolders.forEach(folder => {
    const source = path.join(projectRoot, folder);
    const dest = path.join(projectRoot, '.ai-agents', folder);
    if (fs.existsSync(source)) {
        console.log(`Moving ${folder}...`);
        copyDir(source, dest);
        deleteDir(source);
        console.log(`✓ Moved ${folder}`);
    }
});

// Delete temporary organization scripts
const tempScripts = ['organize-project.js', 'organize-project.ps1', 'move-agent-folders.js'];

console.log('\nDeleting temporary organization scripts...');
tempScripts.forEach(script => {
    const scriptPath = path.join(projectRoot, script);
    if (fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath);
        console.log(`✓ Deleted ${script}`);
    }
});

console.log('\n✓ Cleanup complete!');
