// Checks that every file in icons/ draws the same shape as components/icons.js, the one place the icon shapes live.
// Run with: npm run check:icons   (it changes nothing; it lists any icon file that needs updating)
import { readFileSync } from 'node:fs';
import { icons } from '../components/icons.js';

const stale = [];
for (const [key, icon] of Object.entries(icons)) {
  let svg = '';
  try { svg = readFileSync(new URL(`../icons/${icon.file}`, import.meta.url), 'utf8'); } catch { stale.push(`${icon.file} is missing`); continue; }
  const paths = [...svg.matchAll(/\sd="([^"]*)"/g)].map(m => m[1].replace(/\s*z$/i, ''));
  if (!paths.includes(icon.d.replace(/\s*z$/i, ''))) stale.push(`${icon.file} doesn't match icons['${key}'] in components/icons.js`);
}
if (stale.length) { console.error('✗ Icon files out of date:\n  - ' + stale.join('\n  - ')); process.exit(1); }
console.log(`✓ All ${Object.keys(icons).length} icon files match components/icons.js`);
