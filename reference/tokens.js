/* Reads the MADS tokens straight from css/mads.css, so the reference page shows the values websites actually get.
   Reference.astro calls readTokens() at build time and hands the result to reference.js as window.MADS_TOKENS; the
   foundation tables, specimens and Code panels are drawn from it instead of from numbers typed into the page.
   It also checks the stylesheet: the two copies of the dark theme must match, and every token the page needs must
   exist. Any problem stops the build with a message saying what to fix. Plain JavaScript, no dependencies. */

const block = (css, selector) => {
  const out = [];
  let i = 0;
  while ((i = css.indexOf(selector, i)) !== -1) {
    const open = css.indexOf('{', i);
    let depth = 0, j = open;
    for (; j < css.length; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}' && --depth === 0) break;
    }
    out.push(css.slice(open + 1, j));
    i = j;
  }
  return out.join('\n');
};

const vars = text => {
  const map = {};
  for (const m of text.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--mads-[\w-]+)\s*:\s*([^;]+);/g)) map[m[1]] = m[2].trim();
  return map;
};

const px = value => {
  const m = String(value).trim().match(/^(-?[\d.]+)(rem|px)?$/);
  if (!m) return NaN;
  return m[2] === 'rem' ? +m[1] * 16 : +m[1];
};

// '#A86400' → ['A86400'] · 'rgb(40 20 90 / .12)' → ['28145A', 0.12]
const color = value => {
  let m = value.match(/^#([0-9a-f]{6})$/i);
  if (m) return [m[1].toUpperCase()];
  m = value.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[/,]\s*([\d.]+))?\s*\)$/i);
  if (m) {
    const hex = [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('').toUpperCase();
    return m[4] === undefined ? [hex] : [hex, +m[4]];
  }
  return null;
};

export function readTokens(css) {
  const problems = [];
  const root = vars(block(css, ':root {'));                       // light values and everything theme-independent
  const darkDevice = vars(block(css, ':root:not([data-theme="light"])'));
  const darkChosen = vars(block(css, ':root[data-theme="dark"]'));

  // the dark theme is written twice (device setting, and the switch): both copies must say the same
  for (const name of new Set([...Object.keys(darkDevice), ...Object.keys(darkChosen)])) {
    if (darkDevice[name] !== darkChosen[name]) problems.push(`${name} differs between the two dark blocks in css/mads.css (prefers-color-scheme: "${darkDevice[name]}", data-theme="dark": "${darkChosen[name]}")`);
  }

  const get = (name, map = root) => {
    let value = map[name] ?? root[name];
    if (value === undefined) { problems.push(`css/mads.css has no ${name}`); return ''; }
    for (let k = 0; k < 5 && /^var\((--mads-[\w-]+)\)$/.test(value); k++) value = map[value.slice(4, -1)] ?? root[value.slice(4, -1)];
    return value;
  };
  const num = (name, map) => {
    const v = px(get(name, map));
    if (Number.isNaN(v)) problems.push(`${name} in css/mads.css isn't a plain rem or px value ("${get(name, map)}")`);
    return v;
  };
  const names = prefix => [...new Set(Object.keys(root).filter(k => k.startsWith(prefix)).map(k => k.slice(prefix.length).replace(/-(size|line-height)$/, '')))];

  const sizes = (kind, list) => Object.fromEntries(list.map(n => [n, { size: num(`--mads-${kind}-${n}-size`), lh: num(`--mads-${kind}-${n}-line-height`) }]));
  const scale = kind => names(`--mads-${kind}-`).filter(n => root[`--mads-${kind}-${n}-size`]);

  const tokens = {
    space: Object.keys(root).filter(k => /^--mads-space-\d+$/.test(k)).sort((a, b) => a.match(/\d+$/)[0] - b.match(/\d+$/)[0]).map(k => num(k)),
    text: sizes('text', scale('text')),
    label: sizes('label', scale('label')),
    labelWeight: +get('--mads-label-weight'),
    heading: sizes('heading', scale('heading').filter(n => n !== 'hero')),
    headingWeight: +get('--mads-heading-weight'),
    color: Object.fromEntries(Object.keys(root).filter(k => k.startsWith('--mads-color-')).map(k => [k.slice(13), (color(get(k)) || [''])[0]])),
    theme: { light: {}, dark: {} },
    radius: Object.fromEntries(Object.keys(root).filter(k => k.startsWith('--mads-radius-')).map(k => [k.slice(14), num(k)])),
    gradient: {},
    shadow: {},
    motion: { duration: {}, easing: {} },
    ambient: { light: parseFloat(get('--mads-ambient-strength')), dark: parseFloat(get('--mads-ambient-strength', darkChosen)) },
    font: Object.fromEntries(['display', 'body', 'mono'].map(n => [n, { family: get(`--mads-font-${n}`).match(/^"([^"]+)"/)?.[1] ?? '', fallback: get(`--mads-font-${n}-fallback`) }])),
  };

  // hero heading: a fluid size, clamp(min, preferred, max)
  const hero = get('--mads-heading-hero-size').match(/^clamp\(\s*([\d.]+rem)\s*,\s*([^,]+?)\s*,\s*([\d.]+rem)\s*\)$/);
  if (!hero) problems.push('--mads-heading-hero-size in css/mads.css should be clamp(min rem, preferred, max rem)');
  tokens.heading.hero = { size: hero ? px(hero[1]) : NaN, preferred: hero ? hero[2] : '', max: hero ? px(hero[3]) : NaN, lh: +get('--mads-heading-hero-line-height'), weight: +get('--mads-heading-hero-weight'), tracking: get('--mads-heading-hero-tracking') };

  for (const k of Object.keys(root).filter(k => k.startsWith('--mads-theme-'))) {
    const name = k.slice(13);
    for (const [mode, map] of [['light', root], ['dark', darkChosen]]) {
      const c = color(get(k, map));
      if (!c) problems.push(`${k} (${mode}) in css/mads.css isn't a hex or rgb() colour ("${get(k, map)}")`);
      tokens.theme[mode][name] = c || [''];
    }
  }

  for (const k of Object.keys(root).filter(k => k.startsWith('--mads-gradient-'))) {
    const value = get(k);
    const m = value.match(/^linear-gradient\(\s*90deg\s*,(.*)\)$/);
    if (!m) continue;                                   // surface, scrim…: theme-based, not drawn from colours
    const stops = m[1].split(/,(?![^(]*\))/).map(s => s.trim().match(/^var\(--mads-color-([\w-]+)\)(?:\s+([\d.]+)%)?$/));
    if (stops.some(s => !s)) { problems.push(`${k} in css/mads.css should list var(--mads-color-…) stops`); continue; }
    tokens.gradient[k.slice(16)] = { colors: stops.map(s => s[1]), stops: stops.map((s, i) => s[2] !== undefined ? +s[2] / 100 : i === 0 ? 0 : i === stops.length - 1 ? 1 : NaN) };
  }

  for (const k of Object.keys(root).filter(k => k.startsWith('--mads-shadow-'))) {
    const m = get(k).match(/^(-?[\d.]+(?:px)?)\s+(-?[\d.]+px)\s+(-?[\d.]+px)\s+(-?[\d.]+px)\s+(.+)$/);
    const c = m && color(m[5]);
    if (!c) { problems.push(`${k} in css/mads.css should be "x y blur spread rgb(…)"`); continue; }
    tokens.shadow[k.slice(14)] = { x: px(m[1]), y: px(m[2]), blur: px(m[3]), spread: px(m[4]), color: c[0], alpha: c[1] ?? 1 };
  }

  for (const k of Object.keys(root).filter(k => k.startsWith('--mads-motion-duration-'))) tokens.motion.duration[k.slice(23)] = parseFloat(get(k));
  for (const k of Object.keys(root).filter(k => k.startsWith('--mads-motion-easing-'))) {
    const m = get(k).match(/^cubic-bezier\(([^)]+)\)$/);
    if (!m) { problems.push(`${k} in css/mads.css should be a cubic-bezier()`); continue; }
    tokens.motion.easing[k.slice(21)] = m[1].split(',').map(Number);
  }

  return { tokens, problems };
}
