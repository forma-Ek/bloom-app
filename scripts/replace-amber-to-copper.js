// Script to replace Tailwind amber utility classes with copper equivalents across the codebase
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..'); // project root

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content
    .replace(/\bamber-/g, 'copper-') // class prefixes
    .replace(/text-amber-(\d{3,4})/g, 'text-copper-$1')
    .replace(/bg-amber-(\d{3,4})/g, 'bg-copper-$1')
    .replace(/border-amber-(\d{3,4})/g, 'border-copper-$1')
    .replace(/hover:bg-amber-(\d{3,4})/g, 'hover:bg-copper-$1')
    .replace(/hover:text-amber-(\d{3,4})/g, 'hover:text-copper-$1')
    .replace(/focus:border-amber-(\d{3,4})/g, 'focus:border-copper-$1');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip node_modules and .git
      if (['node_modules', '.git', 'dist', 'build'].includes(entry.name)) continue;
      walk(fullPath);
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      replaceInFile(fullPath);
    }
  }
}

walk(path.join(root, 'src'));
console.log('Replacement complete.');
