// Checks that tokens/mads-tokens.json says the same as css/mads.css, the stylesheet websites use, and that the
// stylesheet itself is consistent (the two copies of the dark theme match; reference/tokens.js checks that).
// Run with: npm run check:tokens   (it changes nothing; it lists every difference)
import { readFileSync } from 'node:fs';
import { readTokens } from '../reference/tokens.js';

const css = readFileSync(new URL('../css/mads.css', import.meta.url), 'utf8');
const json = JSON.parse(readFileSync(new URL('../tokens/mads-tokens.json', import.meta.url), 'utf8')).tokens;
const { problems } = readTokens(css);

const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '');
const varsIn = text => Object.fromEntries([...strip(text).matchAll(/(--mads-[\w-]+)\s*:\s*([^;{}]+);/g)].map(m => [m[1], m[2].trim()]));
const darkStart = css.indexOf(':root[data-theme="dark"]');
const light = {}, dark = {};
// light: every :root { … } block; dark: the data-theme="dark" blocks (tokens.js already checked they match the media query)
for (const m of css.matchAll(/(^|\n):root\s*\{([^}]*)\}/g)) Object.assign(light, varsIn(m[2]));
for (const m of css.matchAll(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/g)) Object.assign(dark, varsIn(m[1]));
const norm = v => String(v).replace(/\s+/g, ' ').trim().toLowerCase();

const listed = new Set();
for (const [group, entries] of Object.entries(json)) {
  for (const [name, t] of Object.entries(entries)) {
    listed.add(name);
    if ('value' in t) {
      if (!(name in light)) problems.push(`tokens/mads-tokens.json has ${name} (${group}), which css/mads.css doesn't define`);
      else if (norm(t.value) !== norm(light[name])) problems.push(`${name}: mads-tokens.json says "${t.value}", css/mads.css says "${light[name]}"`);
    } else {
      if (norm(t.light) !== norm(light[name])) problems.push(`${name} (light): mads-tokens.json says "${t.light}", css/mads.css says "${light[name]}"`);
      if (norm(t.dark) !== norm(dark[name] ?? light[name])) problems.push(`${name} (dark): mads-tokens.json says "${t.dark}", css/mads.css says "${dark[name] ?? light[name]}"`);
    }
  }
}
for (const name of Object.keys(light)) if (!listed.has(name)) problems.push(`${name} is in css/mads.css but missing from tokens/mads-tokens.json`);

if (problems.length) { console.error('✗ The tokens don\'t agree:\n  - ' + problems.join('\n  - ')); process.exit(1); }
console.log(`✓ tokens/mads-tokens.json matches css/mads.css (${listed.size} tokens)`);
