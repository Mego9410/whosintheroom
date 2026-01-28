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

// Move AI agent folders (except .cursor) to .ai-agents
const agentFolders = ['.agent', '.agents', '.claude', '.cline', '.codex', '.commandcode', '.continue', '.crush', '.factory', '.gemini', '.github', '.goose', '.kilocode', '.kiro', '.mcpjam', '.neovate', '.opencode', '.openhands', '.pi', '.qoder', '.qwen', '.roo', '.trae', '.windsurf', '.zencoder'];

console.log('Moving AI agent folders...');
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

console.log('\nDone moving AI agent folders!');
