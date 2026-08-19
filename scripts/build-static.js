/* Assemble the static output into public/ for Vercel (and any other static host). */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir, filter) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (filter && !filter(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, filter);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// Clean output dir
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// HTML pages at root
for (const f of fs.readdirSync(ROOT)) {
  if (f.endsWith('.html')) copyFile(path.join(ROOT, f), path.join(OUT, f));
}

// site.css
copyFile(path.join(ROOT, 'site.css'), path.join(OUT, 'site.css'));

// compiled JS
copyDir(path.join(ROOT, 'dist'), path.join(OUT, 'dist'));

// assets, skipping the large un-optimised source videos
const SKIP = new Set(['hero1.mp4', 'hero2.mp4', 'hero3.mp4']);
copyDir(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), (name) => !SKIP.has(name));

console.log('Static output assembled in public/');
