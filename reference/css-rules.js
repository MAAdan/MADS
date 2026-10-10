/* Picks the rules for one component out of css/mads.css, so a code tab on the reference page shows
   the CSS the package ships rather than a copy typed by hand.

   cssRules(css, { classes, vars })
     classes  class names without the dot ('mads-chip'): every rule with a selector that starts with one of them,
              including the ones inside @media and @supports, and the @keyframes those rules play
     vars     custom property prefixes ('--mads-ambient-'): those declarations from the :root blocks
              (light and dark), and their @property rules
   Returns the rules in mads.css order, one declaration per line when a rule is long. */

const WIDTH = 110;

/* Splits a block of CSS into its top-level statements: { comment, prelude, body } or { prelude } for @property;…; */
function statements(css) {
  const out = [];
  let i = 0, comment = null;
  while (i < css.length) {
    const ws = css.slice(i).match(/^\s+/);
    if (ws) {
      if ((ws[0].match(/\n/g) || []).length > 1) comment = null;   // a blank line ends a comment's hold on the next rule
      i += ws[0].length;
      continue;
    }
    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i) + 2;
      comment = css.slice(i, end);
      i = end;
      continue;
    }
    let j = i, depth = 0, quote = null;
    for (; j < css.length; j++) {
      const c = css[j];
      if (quote) { if (c === quote && css[j - 1] !== '\\') quote = null; continue; }
      if (c === '"' || c === "'") quote = c;
      else if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) break; }
      else if (c === ';' && depth === 0) break;
    }
    const text = css.slice(i, j + 1);
    const brace = text.indexOf('{');
    out.push(brace < 0 || css[j] === ';'
      ? { comment, prelude: text.trim() }
      : { comment, prelude: text.slice(0, brace).trim(), body: text.slice(brace + 1, -1) });
    comment = null;
    i = j + 1;
  }
  return out;
}

/* Splits declarations on ; outside parentheses and quotes */
function declarations(body) {
  const out = [];
  let depth = 0, quote = null, start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (quote) { if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'") quote = c;
    else if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ';' && depth === 0) { out.push(body.slice(start, i).trim()); start = i + 1; }
  }
  if (body.slice(start).trim()) out.push(body.slice(start).trim());
  return out.filter(Boolean);
}

function rule(prelude, decls, indent) {
  const one = `${indent}${prelude} { ${decls.join('; ')}; }`;
  if (one.length <= WIDTH || decls.length === 1) return one;
  return [`${indent}${prelude} {`, ...decls.map(d => `${indent}  ${d};`), `${indent}}`].join('\n');
}

export function cssRules(css, { classes = [], vars = [] } = {}) {
  const usesClass = classes.length > 0;
  const isVar = name => vars.some(p => name.startsWith(p));
  const keyframes = [];

  /* Returns the statements to keep, as text, or [] */
  const pick = (list, indent) => list.flatMap(s => {
    const at = s.prelude.match(/^@([\w-]+)\s*(.*)$/s);
    if (at && at[1] === 'keyframes') return [{ keyframes: at[2].trim(), s, indent }];
    if (at && at[1] === 'property') return isVar(at[2].trim()) ? [{ text: indent + s.prelude + ' {' + (s.body ?? '').replace(/\s+/g, ' ').replace(/\s*$/, ' ') + '}', s }] : [];
    if (at && s.body !== undefined) {
      const inner = pick(statements(s.body), indent + '  ').filter(x => !x.keyframes || keyframes.includes(x.keyframes));
      if (!inner.some(x => x.text)) return [];
      return [{ text: `${indent}${s.prelude} {\n${inner.filter(x => x.text).map(x => x.text).join('\n')}\n${indent}}`, s }];
    }
    if (s.body === undefined) return [];
    if (/^:root\b/.test(s.prelude)) {
      const decls = declarations(s.body).filter(d => isVar(d.split(':')[0].trim()));
      return decls.length ? [{ text: [`${indent}${s.prelude} {`, ...decls.map(d => `${indent}  ${d};`), `${indent}}`].join('\n'), s }] : [];
    }
    /* A rule belongs to the component its selector starts with: '.mads-card-selectable .mads-progress-thin' is the card's */
    const own = sel => { const first = sel.trim().match(/^\.([\w-]+)/); return first && classes.includes(first[1]); };
    if (!usesClass || !s.prelude.split(',').some(own)) return [];
    return [{ text: rule(s.prelude, declarations(s.body), indent), s }];
  });

  const top = statements(css);
  let kept = pick(top, '');
  /* Keyframes: the ones a kept rule plays. A second pass picks them up where mads.css has them */
  const played = kept.map(x => x.text || '').join('\n');
  for (const m of played.matchAll(/animation(?:-name)?:\s*([\w-]+)/g)) keyframes.push(m[1]);
  kept = pick(top, '').map(x => x.keyframes
    ? (keyframes.includes(x.keyframes) ? { text: x.indent + x.s.prelude + ' { ' + x.s.body.replace(/\s+/g, ' ').trim() + ' }', s: x.s } : null)
    : x).filter(x => x && x.text);

  /* A blank line between groups: before a comment, a multi-line rule, or a rule for another class */
  const base = t => (t.match(/\.mads-[\w-]+|:root|@[\w-]+/) || [''])[0];
  return kept.map((x, i) => {
    const lead = x.s.comment && !x.s.comment.startsWith('/* =====') ? x.s.comment + '\n' : '';
    const prev = kept[i - 1];
    const gap = i > 0 && (lead || x.text.includes('\n') || prev.text.includes('\n') || base(x.text) !== base(prev.text)) ? '\n' : '';
    return gap + lead + x.text;
  }).join('\n');
}

/* The code tabs on the reference page that show mads.css rules, and what each one shows */
export const CODE_TABS = {
  button: { classes: ['mads-button'], vars: ['--mads-button-primary-'] },
  'button-more': { classes: ['mads-button-secondary', 'mads-button-ghost', 'mads-button-icon', 'mads-button-round'] },
  toggle: { classes: ['mads-toggle-theme'] },
  card: { classes: ['mads-card', 'mads-card-title', 'mads-card-marker', 'mads-card-body', 'mads-card-compact', 'mads-card-selectable', 'mads-stat'] },
  chip: { classes: ['mads-chip', 'mads-chip-location', 'mads-tag'] },
  progress: { classes: ['mads-progress', 'mads-progress-track', 'mads-progress-thin'] },
  content: { classes: ['mads-list-diamond', 'mads-quote'] },
  grad: { classes: ['mads-text-gradient', 'mads-ambient', 'mads-frame-gradient'], vars: ['--mads-gradient-amber-pink', '--mads-gradient-surface', '--mads-gradient-scrim', '--mads-ambient-'] },
  icon: { classes: ['mads-icon', 'mads-icon-glow'], vars: ['--mads-icon-'] },
};

/* Every tab's rules, keyed like CODE_TABS. Throws when mads.css has no rule for a class a tab lists
   (it was renamed or removed): update CODE_TABS so the tab keeps showing the component */
export function codeTabCss(css) {
  const out = {};
  for (const [key, which] of Object.entries(CODE_TABS)) {
    const missing = which.classes.filter(c => !cssRules(css, { classes: [c] }));
    if (missing.length) throw new Error(`reference/css-rules.js: css/mads.css has no rules for ${missing.map(c => '.' + c).join(', ')}, listed for the "${key}" code tab in CODE_TABS.`);
    out[key] = cssRules(css, which);
  }
  return out;
}
