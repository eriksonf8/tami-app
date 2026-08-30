const fs = require('fs');
const path = require('path');

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      checkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const targetPath = path.resolve(path.dirname(fullPath), importPath);
          const exts = ['', '.tsx', '.ts', '.css'];
          for (const ext of exts) {
            if (fs.existsSync(targetPath + ext)) {
              const dirName = path.dirname(targetPath + ext);
              const baseName = path.basename(targetPath + ext);
              if (fs.existsSync(dirName)) {
                const actualFiles = fs.readdirSync(dirName);
                if (!actualFiles.includes(baseName)) {
                  console.log(`CASE MISMATCH in ${fullPath}: imports '${importPath}' but actual file is '${actualFiles.find(f => f.toLowerCase() === baseName.toLowerCase())}'`);
                }
              }
            }
          }
        }
      }
    }
  });
}
checkDir('./src');
console.log('Check complete.');
