/* ===== mads.font — specimens, fallback preview and platform code ===== */
(() => {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cm = s => `<span class="dsd-cm">${esc(s)}</span>`;
  const plain = s => esc(s);

  /* Weight sliders */
  document.querySelectorAll('.dsd-specimen').forEach(card => {
    const input = card.querySelector('input[type="range"]');
    const out = card.querySelector('output');
    const sample = card.querySelector('.dsd-specimen-sample');
    if (!input) return;
    input.addEventListener('input', () => { sample.style.fontWeight = input.value; out.textContent = input.value; });
  });

  /* Fallback preview */
  const toggle = document.getElementById('font-fallback-toggle');
  const box = document.getElementById('font-specimens');
  const note = document.getElementById('font-fallback-note');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (toggle && box) toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', on);
    const apply = () => {
      box.classList.toggle('is-fallback', on);
      note.textContent = on ? 'Showing this device’s fallback fonts' : 'Showing Google Fonts';
      box.classList.remove('is-swapping');
    };
    if (still) return apply();
    box.classList.add('is-swapping');
    setTimeout(apply, 200);
  });

  const GF = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Onest:wght@100..900&family=Unbounded:wght@200..900&display=swap';

  const code = {
    css: [
      cm('<!-- 1. In <head>: load the three MADS fonts -->'),
      plain('<link rel="preconnect" href="https://fonts.googleapis.com">'),
      plain('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'),
      plain(`<link rel="stylesheet" href="${GF}">`),
      '',
      cm('/* 2. mads.font tokens. Device fonts take over if Google Fonts can\'t load */'),
      ':root {',
      '  --mads-font-display-fallback: "Arial Rounded MT Bold", "Arial Rounded MT", "Trebuchet MS", sans-serif;',
      '  --mads-font-body-fallback: "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;',
      '  --mads-font-mono-fallback: "SF Mono", ui-monospace, Menlo, Consolas, monospace;',
      '',
      '  --mads-font-display: "Unbounded", var(--mads-font-display-fallback);  ' + cm('/* headings */'),
      '  --mads-font-body: "Onest", var(--mads-font-body-fallback);            ' + cm('/* text */'),
      '  --mads-font-mono: "JetBrains Mono", var(--mads-font-mono-fallback);   ' + cm('/* labels, code */'),
      '}'
    ],
    swift: [
      'import SwiftUI',
      'import UIKit',
      '',
      cm('/// mads.font'),
      cm('/// Add the .ttf files from Google Fonts to the app target and list them'),
      cm('/// under "Fonts provided by application" (UIAppFonts) in Info.plist.'),
      cm('/// If a font is missing, the matching Apple system font is used instead.'),
      'public enum MadsFont {',
      '',
      '    ' + cm('/// mads.font.display — Unbounded, headings. Fallback: SF Pro Rounded'),
      '    public static func display(_ size: CGFloat, weight: Font.Weight = .bold,',
      '                               relativeTo style: Font.TextStyle = .title) -> Font {',
      '        font("Unbounded", size, weight, style, fallback: .rounded)',
      '    }',
      '',
      '    ' + cm('/// mads.font.body — Onest, text. Fallback: SF Pro'),
      '    public static func body(_ size: CGFloat, weight: Font.Weight = .regular,',
      '                            relativeTo style: Font.TextStyle = .body) -> Font {',
      '        font("Onest", size, weight, style, fallback: .default)',
      '    }',
      '',
      '    ' + cm('/// mads.font.mono — JetBrains Mono, labels. Fallback: SF Mono'),
      '    public static func mono(_ size: CGFloat, weight: Font.Weight = .regular,',
      '                            relativeTo style: Font.TextStyle = .caption) -> Font {',
      '        font("JetBrains Mono", size, weight, style, fallback: .monospaced)',
      '    }',
      '',
      '    private static func font(_ family: String, _ size: CGFloat, _ weight: Font.Weight,',
      '                             _ style: Font.TextStyle, fallback: Font.Design) -> Font {',
      '        UIFont.familyNames.contains(family)',
      '            ? .custom(family, size: size, relativeTo: style).weight(weight)',
      '            : .system(size: size, weight: weight, design: fallback)',
      '    }',
      '}'
    ],
    compose: [
      'import androidx.compose.ui.text.font.DeviceFontFamilyName',
      'import androidx.compose.ui.text.font.Font',
      'import androidx.compose.ui.text.font.FontFamily',
      'import androidx.compose.ui.text.font.FontWeight',
      'import androidx.compose.ui.text.googlefonts.Font',
      'import androidx.compose.ui.text.googlefonts.GoogleFont',
      '',
      cm('/**'),
      cm(' * mads.font — downloaded through Google Play services.'),
      cm(' * Needs androidx.compose.ui:ui-text-google-fonts and the'),
      cm(' * com_google_android_gms_fonts_certs array in res/values.'),
      cm(' * Each weight lists the device font right after it as its fallback.'),
      cm(' */'),
      'private val provider = GoogleFont.Provider(',
      '    providerAuthority = "com.google.android.gms.fonts",',
      '    providerPackage = "com.google.android.gms",',
      '    certificates = R.array.com_google_android_gms_fonts_certs',
      ')',
      '',
      'private val weights = (100..900 step 100).map { FontWeight(it) }',
      '',
      'private fun family(google: String, device: String, max: Int = 900) = FontFamily(',
      '    weights.filter { it.weight <= max }.flatMap { w ->',
      '        listOf(',
      '            Font(googleFont = GoogleFont(google), fontProvider = provider, weight = w),',
      '            Font(DeviceFontFamilyName(device), weight = w)',
      '        )',
      '    }',
      ')',
      '',
      'object MadsFont {',
      '    ' + cm('/** mads.font.display — Unbounded, headings */'),
      '    val display = family("Unbounded", "sans-serif")',
      '    ' + cm('/** mads.font.body — Onest, text */'),
      '    val body = family("Onest", "sans-serif")',
      '    ' + cm('/** mads.font.mono — JetBrains Mono, labels */'),
      '    val mono = family("JetBrains Mono", "monospace", max = 800)',
      '}'
    ],
    xml: [
      cm('<!-- res/font/mads_display.xml — mads.font.display (Unbounded, headings) -->'),
      plain('<font-family xmlns:app="http://schemas.android.com/apk/res-auto"'),
      plain('    app:fontProviderAuthority="com.google.android.gms.fonts"'),
      plain('    app:fontProviderPackage="com.google.android.gms"'),
      plain('    app:fontProviderQuery="Unbounded"'),
      plain('    app:fontProviderCerts="@array/com_google_android_gms_fonts_certs" />'),
      '',
      cm('<!-- res/font/mads_body.xml — mads.font.body (Onest, text) -->'),
      plain('<font-family xmlns:app="http://schemas.android.com/apk/res-auto"'),
      plain('    app:fontProviderAuthority="com.google.android.gms.fonts"'),
      plain('    app:fontProviderPackage="com.google.android.gms"'),
      plain('    app:fontProviderQuery="Onest"'),
      plain('    app:fontProviderCerts="@array/com_google_android_gms_fonts_certs" />'),
      '',
      cm('<!-- res/font/mads_mono.xml — mads.font.mono (JetBrains Mono, labels) -->'),
      plain('<font-family xmlns:app="http://schemas.android.com/apk/res-auto"'),
      plain('    app:fontProviderAuthority="com.google.android.gms.fonts"'),
      plain('    app:fontProviderPackage="com.google.android.gms"'),
      plain('    app:fontProviderQuery="JetBrains Mono"'),
      plain('    app:fontProviderCerts="@array/com_google_android_gms_fonts_certs" />'),
      '',
      cm('<!-- Use: android:fontFamily="@font/mads_display". If the download fails,'),
      cm('     the view keeps the device font (sans-serif or monospace). -->')
    ]
  };
  Object.entries(code).forEach(([k, lines]) => {
    const el = document.querySelector(`#font-code-${k} code`);
    if (el) el.innerHTML = lines.join('\n');
  });
})();

/* ===== Shared helpers for the later sections ===== */
const MADSX = (() => {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cm = s => `<span class="dsd-cm">${esc(s)}</span>`;
  const fill = (key, code) => Object.entries(code).forEach(([k, lines]) => {
    const el = document.querySelector(`#${key}-code-${k} code`);
    if (el) el.innerHTML = lines.join('\n');
  });
  const rows = (id, list) => { const el = document.getElementById(id); if (el) el.innerHTML = list.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 ? `<span class="dsd-tok">${c}</span>` : c}</td>`).join('')}</tr>`).join(''); };
  const v = s => `<span class="dsd-val">${s}</span>`;
  return { esc, cm, fill, rows, v };
})();

/* ===== mads.theme ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  const T = [
    { k: 'background',       l: ['F6F4FB'],       d: ['100C20'],       use: 'Page background' },
    { k: 'surface',          l: ['FFFFFF'],       d: ['1A1433'],       use: 'Cards and panels' },
    { k: 'surface-raised',   l: ['E9E4F6'],       d: ['241C45'],       use: 'Raised areas and media frames' },
    { k: 'surface-idle',     l: ['EEECF3'],       d: ['1E1B29'],       use: 'Unselected selectable cards' },
    { k: 'text',             l: ['17122B'],       d: ['F4F0FB'],       use: 'Main text', text: true, note: 'Light: mads.color.dark' },
    { k: 'text-muted',       l: ['544D74'],       d: ['B4ABC9'],       use: 'Secondary text', text: true, note: 'Light: mads.color.dark-1' },
    { k: 'text-faint',       l: ['8A83A6'],       d: ['7D7497'],       use: 'Captions and years', text: true },
    { k: 'line',             l: ['28145A', .12],  d: ['ECE4FF', .10],  use: 'Borders and dividers' },
    { k: 'fill-soft',        l: ['28145A', .05],  d: ['FFFFFF', .05],  use: 'Secondary buttons, tracks, chips' },
    { k: 'fill-ghost',       l: ['28145A', .09],  d: ['FFFFFF', .07],  use: 'Hover on soft fills' },
    { k: 'text-amber-gold',  l: ['A86400'],       d: ['FFBE0B'],       use: 'AmberGold text', text: true },
    { k: 'text-azure-blue',  l: ['1D5FD0'],       d: ['5B9BFF'],       use: 'AzureBlue text', text: true },
    { k: 'text-neon-pink',   l: ['CC0058'],       d: ['FF3D8B'],       use: 'NeonPink text', text: true },
    { k: 'text-blue-violet', l: ['6A25D1'],       d: ['A878FF'],       use: 'BlueViolet text', text: true },
    { k: 'focus',            l: ['FFBE0B'],       d: ['FFBE0B'],       use: 'Focus ring (mads.color.amber-gold)' }
  ];
  const BG = { l: 'F6F4FB', d: '100C20' };
  const rgbA = h => [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  const css = ([h, a]) => a == null ? `#${h}` : `rgb(${rgbA(h).join(' ')} / ${String(a).replace(/^0/, '')})`;
  const lum = h => { const [r, g, b] = rgbA(h).map(x => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
  const grade = r => r >= 4.5 ? ['AA', 'is-aa'] : r >= 3 ? ['Large', 'is-large'] : ['Fail', 'is-fail'];

  const panes = document.getElementById('theme-panes');
  if (panes) panes.innerHTML = [['l', 'Light', '17122B'], ['d', 'Dark', 'F4F0FB']].map(([m, name, fg]) => `
    <div class="dsd-theme-pane" style="background:#${BG[m]};color:#${fg}">
      <h4>${name}</h4>
      <ul>${T.map(t => {
        const c = t[m]; let badge = '';
        if (t.text) { const r = ratio(c[0], BG[m]); const [g, cls] = grade(r); badge = `<b class="${cls}">${r.toFixed(1)} ${g}</b>`; }
        return `<li><span class="chip-c" style="background:${css(c)}"></span><span class="nm">${t.k}</span><span class="vl">${c[1] == null ? '#' + c[0] : css(c).replace('rgb', '')}${badge}</span></li>`;
      }).join('')}</ul>
    </div>`).join('');

  rows('theme-rows', T.map(t => [`mads.theme.${t.k}`,
    `<span class="dsd-dot" style="--c:${css(t.l)}"></span>${v(css(t.l))}`,
    `<span class="dsd-dot" style="--c:${css(t.d)}"></span>${v(css(t.d))}`,
    t.use + (t.note ? `<span class="dsd-sub">${t.note}</span>` : '')]));

  const aHex = ([h, a]) => '#' + (a == null ? '' : Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase()) + h;
  const camel = k => k.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  const snake = k => k.replace(/-/g, '_');
  const swiftC = ([h, a]) => `0x${h}${a == null ? '' : `, alpha: ${a}`}`;
  fill('theme', {
    css: [
      cm('/* mads.theme — light by default, dark from the device or from data-theme="dark" */'),
      ':root {',
      ...T.map(t => `  --mads-theme-${t.k}: ${t.k === 'focus' ? 'var(--mads-color-amber-gold)' : css(t.l)};`),
      '}',
      '@media (prefers-color-scheme: dark) {',
      '  :root:not([data-theme="light"]) {',
      ...T.filter(t => t.k !== 'focus').map(t => `    --mads-theme-${t.k}: ${css(t.d)};`),
      '  }',
      '}',
      ':root[data-theme="dark"] {',
      '  ' + cm('/* the same dark values, so the toggle wins over the device setting */'),
      '}'
    ],
    swift: [
      'import SwiftUI',
      'import UIKit',
      '',
      cm('/// mads.theme — each role resolves to its light or dark value automatically.'),
      cm('/// Force a mode with .preferredColorScheme(.dark) on the root view.'),
      'public enum MadsTheme {',
      ...T.map(t => `    public static let ${camel(t.k).padEnd(15)} = dynamic(light: ${swiftC(t.l)}, dark: ${swiftC(t.d)})`),
      '',
      '    private static func dynamic(light: UInt32, alpha la: CGFloat = 1,',
      '                                dark: UInt32, alpha da: CGFloat = 1) -> Color {',
      '        Color(UIColor { $0.userInterfaceStyle == .dark ? .init(hex: dark, alpha: da) : .init(hex: light, alpha: la) })',
      '    }',
      '}',
      '',
      'extension UIColor {',
      '    convenience init(hex: UInt32, alpha: CGFloat = 1) {',
      '        self.init(red: CGFloat((hex >> 16) & 0xFF) / 255, green: CGFloat((hex >> 8) & 0xFF) / 255,',
      '                  blue: CGFloat(hex & 0xFF) / 255, alpha: alpha)',
      '    }',
      '}'
    ].map(l => l.replace(/dynamic\(light: (0x\w+), alpha: ([\d.]+), dark: (0x\w+), alpha: ([\d.]+)\)/, 'dynamic(light: $1, alpha: $2, dark: $3, alpha: $4)')),
    compose: [
      'import androidx.compose.foundation.isSystemInDarkTheme',
      'import androidx.compose.runtime.Composable',
      'import androidx.compose.runtime.CompositionLocalProvider',
      'import androidx.compose.runtime.staticCompositionLocalOf',
      'import androidx.compose.ui.graphics.Color',
      '',
      cm('/** mads.theme — read with MadsTheme.colors.text inside MadsTheme { } */'),
      'data class MadsThemeColors(',
      ...T.map(t => `    val ${camel(t.k)}: Color,`),
      ')',
      '',
      'val MadsLight = MadsThemeColors(',
      ...T.map(t => `    ${camel(t.k)} = Color(0x${aHex(t.l).slice(1).padStart(8, 'F')}),`),
      ')',
      '',
      'val MadsDark = MadsThemeColors(',
      ...T.map(t => `    ${camel(t.k)} = Color(0x${aHex(t.d).slice(1).padStart(8, 'F')}),`),
      ')',
      '',
      'val LocalMadsTheme = staticCompositionLocalOf { MadsLight }',
      '',
      'object MadsTheme { val colors: MadsThemeColors @Composable get() = LocalMadsTheme.current }',
      '',
      '@Composable',
      'fun MadsTheme(dark: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) =',
      '    CompositionLocalProvider(LocalMadsTheme provides if (dark) MadsDark else MadsLight, content = content)'
    ],
    xml: [
      cm('<!-- res/values/mads_theme.xml — light -->'),
      esc('<resources>'),
      ...T.map(t => esc(`    <color name="mads_theme_${snake(t.k)}">${aHex(t.l)}</color>`)),
      esc('</resources>'),
      '',
      cm('<!-- res/values-night/mads_theme.xml — dark, picked automatically in night mode -->'),
      esc('<resources>'),
      ...T.map(t => esc(`    <color name="mads_theme_${snake(t.k)}">${aHex(t.d)}</color>`)),
      esc('</resources>')
    ]
  });
})();

/* ===== mads.radius, mads.gradient, mads.shadow ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  const R = [['small', 8, 'Focus outlines, bars'], ['medium', 16, 'Compact cards, list items'], ['large', 20, 'Cards, selectable cards'], ['xlarge', 28, 'Large media panels'], ['full', 999, 'Buttons, chips, toggles']];
  const G = [
    ['brand', ['amber-gold', 'blaze-orange', 'neon-pink', 'blue-violet'], [0, .35, .7, 1], 'Display text, decoration'],
    ['orange-pink', ['blaze-orange', 'neon-pink'], [0, 1], 'Primary button, theme toggle'],
    ['pink-violet', ['neon-pink', 'blue-violet'], [0, 1], 'Progress fills'],
    ['violet-azure', ['blue-violet', 'azure-blue'], [0, 1], 'Progress fills'],
    ['orange-amber', ['blaze-orange', 'amber-gold'], [0, 1], 'Progress fills']
  ];
  const S = [['glow', '0 6px 18px -8px NeonPink at 60%', 'Theme toggle'], ['raised', '0 20px 50px -20px black at 80%', 'Phone frames, floating media']];
  const camel = k => k.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  const snake = k => k.replace(/-/g, '_');

  const rd = document.getElementById('radius-demo');
  if (rd) rd.innerHTML = R.map(([n, px]) => `<div class="dsd-swatch-mini"><span class="dsd-radius-demo" style="border-radius:var(--mads-radius-${n})${n === 'full' ? ';width:8rem;height:3rem' : ''}"></span><span class="dsd-tok">mads.radius.${n}</span><span class="dsd-sub">${px === 999 ? 'Full (pill)' : px}</span></div>`).join('');
  const gd = document.getElementById('gradient-demo');
  if (gd) gd.innerHTML = G.map(([n, c]) => `<div class="dsd-swatch-mini"><span style="background:var(--mads-gradient-${n})"></span><span class="dsd-tok">mads.gradient.${n}</span><span class="dsd-sub">${c.join(' → ')}</span></div>`).join('');

  rows('shape-rows', [
    ...R.map(([n, px, use]) => [`mads.radius.${n}`, v(px === 999 ? '999 (pill)' : px), use]),
    ...G.map(([n, c, , use]) => [`mads.gradient.${n}`, v(c.join(' → ')), use]),
    ...S.map(([n, val, use]) => [`mads.shadow.${n}`, v(val), use])
  ]);

  fill('shape', {
    css: [
      ':root {',
      ...R.map(([n, px]) => `  --mads-radius-${n}: ${px === 999 ? '999px' : px / 16 + 'rem'};`.padEnd(34) + cm(`/* ${px === 999 ? 'pill' : px + 'px'} */`)),
      '',
      ...G.map(([n, c, st]) => `  --mads-gradient-${n}: linear-gradient(90deg, ${c.map((x, i) => `var(--mads-color-${x})${c.length > 2 && i > 0 && i < c.length - 1 ? ' ' + st[i] * 100 + '%' : ''}`).join(', ')});`),
      '',
      '  --mads-shadow-glow: 0 6px 18px -8px rgb(255 0 110 / .6);',
      '  --mads-shadow-raised: 0 20px 50px -20px rgb(0 0 0 / .8);',
      '}',
      '',
      cm('/* Gradient text */'),
      '.mads-text-gradient { background: var(--mads-gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }'
    ],
    swift: [
      'import SwiftUI',
      '',
      'public enum MadsRadius {',
      ...R.filter(r => r[0] !== 'full').map(([n, px]) => `    public static let ${n}: CGFloat = ${px}`),
      '    ' + cm('// full: use Capsule() as the shape'),
      '}',
      '',
      'public enum MadsGradient {',
      ...G.map(([n, c, st]) => `    public static let ${camel(n)} = LinearGradient(stops: [${c.map((x, i) => `.init(color: MadsColor.${camel(x)}, location: ${st[i]})`).join(', ')}], startPoint: .leading, endPoint: .trailing)`),
      '}',
      '',
      'public extension View {',
      '    ' + cm('/// Close to the CSS shadows; SwiftUI shadows have no spread.'),
      '    func madsShadowGlow() -> some View { shadow(color: MadsColor.neonPink.opacity(0.45), radius: 6, y: 6) }',
      '    func madsShadowRaised() -> some View { shadow(color: .black.opacity(0.5), radius: 18, y: 16) }',
      '}'
    ],
    compose: [
      'import androidx.compose.foundation.shape.CircleShape',
      'import androidx.compose.foundation.shape.RoundedCornerShape',
      'import androidx.compose.ui.graphics.Brush',
      'import androidx.compose.ui.unit.dp',
      '',
      'object MadsRadius {',
      ...R.filter(r => r[0] !== 'full').map(([n, px]) => `    val ${n} = RoundedCornerShape(${px}.dp)`),
      '    val full = CircleShape',
      '}',
      '',
      'object MadsGradient {',
      ...G.map(([n, c, st]) => `    val ${camel(n)} = Brush.horizontalGradient(${c.map((x, i) => `${st[i]}f to MadsColor.${camel(x)}`).join(', ')})`),
      '}',
      '',
      cm('// Shadows: Modifier.shadow(12.dp, shape, spotColor = MadsColor.neonPink) for the glow,'),
      cm('// Modifier.shadow(24.dp, shape) for raised. Android shadows have no spread, so these are close matches.')
    ],
    xml: [
      cm('<!-- res/values/mads_radius.xml -->'),
      esc('<resources>'),
      ...R.map(([n, px]) => esc(`    <dimen name="mads_radius_${n}">${px}dp</dimen>`)),
      esc('</resources>'),
      '',
      ...G.filter(g => g[1].length === 2).flatMap(([n, c]) => [
        cm(`<!-- res/drawable/mads_gradient_${snake(n)}.xml -->`),
        esc(`<shape xmlns:android="http://schemas.android.com/apk/res/android">`),
        esc(`    <gradient android:angle="0" android:startColor="@color/mads_color_${snake(c[0])}" android:endColor="@color/mads_color_${snake(c[1])}" />`),
        esc('</shape>'), ''
      ]),
      cm('<!-- mads.gradient.brand has four stops: draw it in code with LinearGradient. -->')
    ]
  });
})();

/* ===== mads.motion ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  const D = [['fast', 200, 'Hover, colour and press feedback'], ['base', 350, 'Switches, tabs, opening sections'], ['slow', 600, 'Gradient shifts, bars filling']];
  const E = [['standard', [.2, .7, .2, 1], 'State changes'], ['spring', [.34, 1.56, .64, 1], 'Things settling into place, with a small overshoot'], ['entrance', [.2, .9, .25, 1.15], 'Elements arriving on screen']];
  rows('motion-rows', [
    ...D.map(([n, ms, use]) => [`mads.motion.duration.${n}`, v(ms + 'ms'), use]),
    ...E.map(([n, c, use]) => [`mads.motion.easing.${n}`, v(`cubic-bezier(${c.join(', ')})`), use]),
    ['mads.motion.reveal', v('rise 48px on scroll'), 'Sections entering the screen']
  ]);
  const row = document.getElementById('motion-row');
  if (row) {
    row.innerHTML = E.map(([n]) => `<div class="dsd-motion-lane"><span class="dsd-tok">easing.${n}</span><span class="dsd-motion-track"><span class="dsd-motion-ball" style="transition:transform var(--mads-motion-duration-slow) var(--mads-motion-easing-${n})"></span></span></div>`).join('');
    const setW = () => row.querySelectorAll('.dsd-motion-track').forEach(t => row.style.setProperty('--w', t.clientWidth + 'px'));
    setW(); addEventListener('resize', setW);
    document.getElementById('motion-play')?.addEventListener('click', () => { setW(); row.classList.toggle('is-go'); });
  }
  fill('motion', {
    css: [
      ':root {',
      ...D.map(([n, ms]) => `  --mads-motion-duration-${n}: ${ms}ms;`),
      ...E.map(([n, c]) => `  --mads-motion-easing-${n}: cubic-bezier(${c.join(', ')});`),
      '}',
      '',
      cm('/* Example */'),
      '.thing { transition: transform var(--mads-motion-duration-base) var(--mads-motion-easing-spring); }',
      '',
      cm('/* mads.motion.reveal — content stays visible where unsupported */'),
      '@supports (animation-timeline: view()) {',
      '  .mads-reveal { animation: mads-rise linear both; animation-timeline: view(); animation-range: entry 5% entry 45%; }',
      '  @keyframes mads-rise { from { opacity: 0; transform: translateY(48px); } }',
      '}',
      '@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }'
    ],
    swift: [
      'import SwiftUI',
      '',
      'public enum MadsMotion {',
      ...D.map(([n, ms]) => `    public static let ${n}: Double = ${ms / 1000}`),
      '',
      ...E.map(([n, c]) => `    public static func ${n}(_ duration: Double = base) -> Animation { .timingCurve(${c.join(', ')}, duration: duration) }`),
      '}',
      '',
      cm('// withAnimation(MadsMotion.spring()) { isOn.toggle() }'),
      cm('// Respect Reduce Motion: @Environment(\\.accessibilityReduceMotion) var reduceMotion')
    ],
    compose: [
      'import androidx.compose.animation.core.CubicBezierEasing',
      'import androidx.compose.animation.core.tween',
      '',
      'object MadsMotion {',
      ...D.map(([n, ms]) => `    const val ${n} = ${ms}`),
      ...E.map(([n, c]) => `    val ${n} = CubicBezierEasing(${c.map(x => x + 'f').join(', ')})`),
      '}',
      '',
      cm('// animateFloatAsState(target, tween(MadsMotion.base, easing = MadsMotion.spring))')
    ],
    xml: [
      cm('<!-- res/values/mads_motion.xml -->'),
      esc('<resources>'),
      ...D.map(([n, ms]) => esc(`    <integer name="mads_motion_duration_${n}">${ms}</integer>`)),
      esc('</resources>'),
      '',
      ...E.flatMap(([n, c]) => [
        cm(`<!-- res/interpolator/mads_motion_${n}.xml -->`),
        esc(`<pathInterpolator xmlns:android="http://schemas.android.com/apk/res/android"`),
        esc(`    android:controlX1="${c[0]}" android:controlY1="${c[1]}" android:controlX2="${c[2]}" android:controlY2="${c[3]}" />`),
        ''
      ])
    ]
  });
})();

/* ===== mads.button.secondary / ghost / icon / round ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  rows('button-more-rows', [
    ['mads.button.secondary', v('fill-soft · line · text'), 'Same size, text and pill shape as the primary. Hover: fill-ghost and a text-faint line.'],
    ['mads.button.ghost', v('transparent · text-muted'), 'Mono at 13, padding 8 / 12, 36 tall. Hover: text colour and a line.'],
    ['mads.button.icon', v('40 circle · line'), 'Holds a 20px mads.icon. Hover: surface fill. The chevron nudges 3px when pressed.'],
    ['mads.button.round', v('44 circle · fill-soft · line'), 'Icon only. The secondary button as a circle, holding a 20px mads.icon. Hover: fill-ghost and a text-faint line. Pressed: 98%.']
  ]);
  fill('button-more', {
    css: [
      cm('<!-- Astro (the @maadan/mads package) -->'),
      esc("import Button from '@maadan/mads/components/Button.astro';"),
      esc("import IconButton from '@maadan/mads/components/IconButton.astro';"),
      esc('<Button variant="secondary" href="#contact">Lorem ipsum</Button>'),
      esc('<Button variant="ghost" href="#toolkit" current>Lorem ipsum</Button>'),
      esc('<IconButton icon="chevron-left" label="Previous" dir="prev" />'),
      esc('<IconButton icon="settings" label="Settings" round />'),
      '',
      cm('/* Needs mads.theme, mads.radius and mads.motion */'),
      '.mads-button-secondary {',
      '  display: inline-flex; align-items: center; justify-content: center; gap: var(--mads-space-2);',
      '  min-height: 2.75rem; padding: .75rem 1.5rem;',
      '  border: 1px solid var(--mads-theme-line); border-radius: var(--mads-radius-full);',
      '  background: var(--mads-theme-fill-soft); color: var(--mads-theme-text); font: var(--mads-text-large);',
      '  transition: background-color var(--mads-motion-duration-fast) var(--mads-motion-easing-standard),',
      '              border-color var(--mads-motion-duration-fast), transform var(--mads-motion-duration-fast);',
      '}',
      '.mads-button-secondary:hover { background: var(--mads-theme-fill-ghost); border-color: var(--mads-theme-text-faint); }',
      '.mads-button-secondary:active { transform: scale(.98); }',
      '.mads-button-secondary:focus-visible { outline: 2px solid var(--mads-color-neon-pink); outline-offset: 3px; }',
      '',
      '.mads-button-ghost {',
      '  display: inline-flex; align-items: center; min-height: 2.25rem; padding: .5rem .75rem;',
      '  border: 1px solid transparent; border-radius: var(--mads-radius-full); background: transparent;',
      '  color: var(--mads-theme-text-muted); font: 500 var(--mads-text-default-size)/1 var(--mads-font-mono);',
      '}',
      '.mads-button-ghost:hover { color: var(--mads-theme-text); border-color: var(--mads-theme-line); }',
      '.mads-button-ghost[aria-current="page"] { color: var(--mads-theme-text); background: var(--mads-theme-fill-soft); }',
      '',
      '.mads-button-icon {',
      '  display: inline-grid; place-items: center; width: 2.5rem; height: 2.5rem;',
      '  border: 1px solid var(--mads-theme-line); border-radius: 50%; background: transparent; color: var(--mads-theme-text);',
      '}',
      '.mads-button-icon svg { width: 1.25rem; height: 1.25rem; transition: transform var(--mads-motion-duration-fast) var(--mads-motion-easing-spring); }',
      '.mads-button-icon:hover { background: var(--mads-theme-surface); }',
      '.mads-button-icon[data-dir="next"]:active svg { transform: translateX(3px); }',
      '',
      cm('<!-- <button class="mads-button-icon" data-dir="next" aria-label="Next"><svg class="mads-icon">…</svg></button> -->'),
      '',
      cm('/* mads.button.round: the secondary button as a 44 circle, icon only */'),
      '.mads-button-round {',
      '  display: inline-grid; place-items: center; width: 2.75rem; height: 2.75rem; padding: 0;',
      '  border: 1px solid var(--mads-theme-line); border-radius: 50%;',
      '  background: var(--mads-theme-fill-soft); color: var(--mads-theme-text);',
      '  transition: background-color var(--mads-motion-duration-fast) var(--mads-motion-easing-standard),',
      '              border-color var(--mads-motion-duration-fast), transform var(--mads-motion-duration-fast);',
      '}',
      '.mads-button-round svg { width: 1.25rem; height: 1.25rem; }',
      '.mads-button-round:hover { background: var(--mads-theme-fill-ghost); border-color: var(--mads-theme-text-faint); }',
      '.mads-button-round:active { transform: scale(.98); }',
      '.mads-button-round:focus-visible { outline: 2px solid var(--mads-color-neon-pink); outline-offset: 3px; }',
      '.mads-button-round:disabled { opacity: .4; cursor: not-allowed; transform: none; }',
      cm('<!-- <button class="mads-button-round" aria-label="Settings"><svg class="mads-icon">…</svg></button> -->')
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.button.secondary'),
      'public struct MadsSecondaryButtonStyle: ButtonStyle {',
      '    public func makeBody(configuration: Configuration) -> some View {',
      '        configuration.label',
      '            .madsText(.large)',
      '            .foregroundStyle(MadsTheme.text)',
      '            .padding(.vertical, 12).padding(.horizontal, 24)',
      '            .frame(minHeight: 44)',
      '            .background(configuration.isPressed ? MadsTheme.fillGhost : MadsTheme.fillSoft, in: Capsule())',
      '            .overlay(Capsule().strokeBorder(MadsTheme.line, lineWidth: 1))',
      '            .scaleEffect(configuration.isPressed ? 0.98 : 1)',
      '            .animation(MadsMotion.standard(MadsMotion.fast), value: configuration.isPressed)',
      '    }',
      '}',
      '',
      cm('/// mads.button.ghost'),
      'public struct MadsGhostButtonStyle: ButtonStyle {',
      '    var isCurrent = false',
      '    public func makeBody(configuration: Configuration) -> some View {',
      '        configuration.label',
      '            .font(MadsFont.mono(13, weight: .medium))',
      '            .foregroundStyle(isCurrent || configuration.isPressed ? MadsTheme.text : MadsTheme.textMuted)',
      '            .padding(.vertical, 8).padding(.horizontal, 12)',
      '            .background(isCurrent ? MadsTheme.fillSoft : .clear, in: Capsule())',
      '    }',
      '}',
      '',
      cm('/// mads.button.icon — 40 circle with a 20pt MadsIcon'),
      'public struct MadsIconButton: View {',
      '    let icon: MadsIconName',
      '    let label: String',
      '    let action: () -> Void',
      '    public var body: some View {',
      '        Button(action: action) {',
      '            MadsIcon(icon, size: 20)',
      '                .foregroundStyle(MadsTheme.text)',
      '                .frame(width: 40, height: 40)',
      '                .overlay(Circle().strokeBorder(MadsTheme.line, lineWidth: 1))',
      '                .contentShape(Circle())',
      '        }',
      '        .buttonStyle(.plain)',
      '        .accessibilityLabel(label)',
      '    }',
      '}',
      '',
      'public extension ButtonStyle where Self == MadsSecondaryButtonStyle { static var madsSecondary: Self { .init() } }',
      '',
      cm('/// mads.button.round — the secondary button as a 44 circle, icon only'),
      'public struct MadsRoundButtonStyle: ButtonStyle {',
      '    public func makeBody(configuration: Configuration) -> some View {',
      '        configuration.label',
      '            .frame(width: 20, height: 20)',
      '            .foregroundStyle(MadsTheme.text)',
      '            .frame(width: 44, height: 44)',
      '            .background(configuration.isPressed ? MadsTheme.fillGhost : MadsTheme.fillSoft, in: Circle())',
      '            .overlay(Circle().strokeBorder(MadsTheme.line, lineWidth: 1))',
      '            .contentShape(Circle())',
      '            .scaleEffect(configuration.isPressed ? 0.98 : 1)',
      '            .animation(MadsMotion.standard(MadsMotion.fast), value: configuration.isPressed)',
      '    }',
      '}',
      'public extension ButtonStyle where Self == MadsRoundButtonStyle { static var madsRound: Self { .init() } }',
      '',
      cm('// Button(action: openSettings) { MadsIcon(.settings, size: 20) }'),
      cm('//     .buttonStyle(.madsRound).accessibilityLabel("Settings")')
    ],
    compose: [
      cm('/** mads.button.secondary — same size as MadsButton, theme colours */'),
      '@Composable',
      'fun MadsSecondaryButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier) {',
      '    val c = MadsTheme.colors',
      '    val interaction = remember { MutableInteractionSource() }',
      '    val pressed by interaction.collectIsPressedAsState()',
      '    val scale by animateFloatAsState(if (pressed) 0.98f else 1f, tween(80), label = "press")',
      '    Box(',
      '        modifier',
      '            .graphicsLayer { scaleX = scale; scaleY = scale }',
      '            .clip(CircleShape)',
      '            .background(if (pressed) c.fillGhost else c.fillSoft)',
      '            .border(1.dp, c.line, CircleShape)',
      '            .clickable(interaction, indication = null, role = Role.Button, onClick = onClick)',
      '            .defaultMinSize(minHeight = 44.dp)',
      '            .padding(horizontal = 24.dp, vertical = 12.dp),',
      '        contentAlignment = Alignment.Center',
      '    ) { Text(text, style = MadsText.large, color = c.text) }',
      '}',
      '',
      cm('/** mads.button.ghost */'),
      '@Composable',
      'fun MadsGhostButton(text: String, onClick: () -> Unit, current: Boolean = false) {',
      '    val c = MadsTheme.colors',
      '    Text(',
      '        text,',
      '        style = MadsText.default.copy(fontFamily = MadsFont.mono, fontWeight = FontWeight.Medium),',
      '        color = if (current) c.text else c.textMuted,',
      '        modifier = Modifier.clip(CircleShape)',
      '            .background(if (current) c.fillSoft else Color.Transparent)',
      '            .clickable(role = Role.Button, onClick = onClick)',
      '            .padding(horizontal = 12.dp, vertical = 8.dp)',
      '    )',
      '}',
      '',
      cm('/** mads.button.icon */'),
      '@Composable',
      'fun MadsIconButton(icon: ImageVector, label: String, onClick: () -> Unit) {',
      '    val c = MadsTheme.colors',
      '    Box(',
      '        Modifier.size(40.dp).clip(CircleShape).border(1.dp, c.line, CircleShape)',
      '            .clickable(role = Role.Button, onClickLabel = label, onClick = onClick),',
      '        contentAlignment = Alignment.Center',
      '    ) { Icon(icon, contentDescription = label, tint = c.text, modifier = Modifier.size(20.dp)) }',
      '}',
      '',
      cm('/** mads.button.round — the secondary button as a 44 circle, icon only */'),
      '@Composable',
      'fun MadsRoundButton(icon: ImageVector, label: String, onClick: () -> Unit, enabled: Boolean = true) {',
      '    val c = MadsTheme.colors',
      '    val interaction = remember { MutableInteractionSource() }',
      '    val pressed by interaction.collectIsPressedAsState()',
      '    val scale by animateFloatAsState(if (pressed) 0.98f else 1f, tween(80), label = "press")',
      '    Box(',
      '        Modifier.size(44.dp)',
      '            .graphicsLayer { scaleX = scale; scaleY = scale; alpha = if (enabled) 1f else 0.4f }',
      '            .clip(CircleShape)',
      '            .background(if (pressed) c.fillGhost else c.fillSoft)',
      '            .border(1.dp, if (pressed) c.textFaint else c.line, CircleShape)',
      '            .clickable(interaction, indication = null, enabled = enabled, role = Role.Button, onClickLabel = label, onClick = onClick),',
      '        contentAlignment = Alignment.Center',
      '    ) { Icon(icon, contentDescription = label, tint = c.text, modifier = Modifier.size(20.dp)) }',
      '}',
      '',
      cm('// MadsRoundButton(MadsIcons.settings, label = "Settings", onClick = { … })')
    ],
    xml: [
      cm('<!-- res/drawable/mads_button_secondary_bg.xml -->'),
      esc('<selector xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <item android:state_pressed="true"><shape><corners android:radius="999dp" />'),
      esc('        <solid android:color="@color/mads_theme_fill_ghost" /><stroke android:width="1dp" android:color="@color/mads_theme_text_faint" /></shape></item>'),
      esc('    <item><shape><corners android:radius="999dp" />'),
      esc('        <solid android:color="@color/mads_theme_fill_soft" /><stroke android:width="1dp" android:color="@color/mads_theme_line" /></shape></item>'),
      esc('</selector>'),
      '',
      cm('<!-- res/values/mads_button_variants.xml -->'),
      esc('<resources>'),
      esc('    <style name="Widget.Mads.Button.Secondary" parent="Widget.Mads.Button.Primary">'),
      esc('        <item name="android:background">@drawable/mads_button_secondary_bg</item>'),
      esc('        <item name="android:textColor">@color/mads_theme_text</item>'),
      esc('    </style>'),
      esc('    <style name="Widget.Mads.Button.Ghost" parent="">'),
      esc('        <item name="android:background">@android:color/transparent</item>'),
      esc('        <item name="android:fontFamily">@font/mads_mono</item>'),
      esc('        <item name="android:textSize">13sp</item>'),
      esc('        <item name="android:textColor">@color/mads_theme_text_muted</item>'),
      esc('        <item name="android:paddingHorizontal">12dp</item>'),
      esc('        <item name="android:paddingVertical">8dp</item>'),
      esc('        <item name="android:textAllCaps">false</item>'),
      esc('    </style>'),
      esc('</resources>'),
      '',
      cm('<!-- Icon button: an ImageButton 40dp × 40dp with an oval stroke background and'),
      cm('     app:srcCompat="@drawable/mads_icon_chevron_right", app:tint="@color/mads_theme_text" -->'),
      '',
      cm('<!-- res/drawable/mads_button_round_bg.xml — mads.button.round -->'),
      esc('<selector xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <item android:state_pressed="true"><shape android:shape="oval">'),
      esc('        <solid android:color="@color/mads_theme_fill_ghost" /><stroke android:width="1dp" android:color="@color/mads_theme_text_faint" /></shape></item>'),
      esc('    <item><shape android:shape="oval">'),
      esc('        <solid android:color="@color/mads_theme_fill_soft" /><stroke android:width="1dp" android:color="@color/mads_theme_line" /></shape></item>'),
      esc('</selector>'),
      '',
      cm('<!-- res/values/mads_button_variants.xml (add inside the resources above) -->'),
      esc('<style name="Widget.Mads.Button.Round" parent="">'),
      esc('    <item name="android:layout_width">44dp</item>'),
      esc('    <item name="android:layout_height">44dp</item>'),
      esc('    <item name="android:padding">12dp</item>'),
      esc('    <item name="android:scaleType">fitCenter</item>'),
      esc('    <item name="android:background">@drawable/mads_button_round_bg</item>'),
      esc('    <item name="tint">@color/mads_theme_text</item>'),
      esc('</style>'),
      '',
      esc('<ImageButton style="@style/Widget.Mads.Button.Round"'),
      esc('    app:srcCompat="@drawable/mads_icon_settings"'),
      esc('    android:contentDescription="Settings" />')
    ]
  });
})();

/* ===== mads.toggle.theme ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  rows('toggle-rows', [
    ['mads.toggle.theme', v('56 × 36 · full radius'), 'Background mads.gradient.orange-pink with mads.shadow.glow'],
    ['knob', v('28 · white · inset 4'), 'Slides 20 to the right when dark mode is on'],
    ['icons', v('16 · sun BlazeOrange · moon BlueViolet'), 'The hidden one turns −60° and shrinks to 60%'],
    ['motion', v('base · spring'), 'mads.motion.duration.base with mads.motion.easing.spring'],
    ['storage', v('mads-theme'), 'The saved choice: light or dark. No value means follow the device.']
  ]);
  fill('toggle', {
    css: [
      cm('<!-- HTML -->'),
      esc('<button type="button" class="mads-toggle-theme" role="switch" aria-checked="false" aria-label="Dark mode">'),
      esc('  <span class="knob"><svg class="sun">…</svg><svg class="moon">…</svg></span>'),
      esc('</button>'),
      '',
      '.mads-toggle-theme {',
      '  position: relative; width: 3.5rem; height: 2.25rem; padding: 0; border: 0; cursor: pointer;',
      '  border-radius: var(--mads-radius-full); background: var(--mads-gradient-orange-pink); box-shadow: var(--mads-shadow-glow);',
      '}',
      '.mads-toggle-theme .knob {',
      '  position: absolute; top: .25rem; left: .25rem; width: 1.75rem; height: 1.75rem; border-radius: 50%;',
      '  display: grid; place-items: center; background: var(--mads-color-white);',
      '  transition: transform var(--mads-motion-duration-base) var(--mads-motion-easing-spring);',
      '}',
      '.mads-toggle-theme[aria-checked="true"] .knob { transform: translateX(1.25rem); }',
      '.mads-toggle-theme svg { position: absolute; width: 1rem; height: 1rem; transition: opacity 250ms, transform var(--mads-motion-duration-base); }',
      '.mads-toggle-theme .sun { color: var(--mads-color-blaze-orange); }',
      '.mads-toggle-theme .moon { color: var(--mads-color-blue-violet); }',
      '.mads-toggle-theme[aria-checked="true"] .sun, .mads-toggle-theme[aria-checked="false"] .moon { opacity: 0; transform: rotate(-60deg) scale(.6); }',
      '',
      cm('/* JS: put the first line in <head> so the page never flashes the wrong theme */'),
      "try { const t = localStorage.getItem('mads-theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) {}",
      "const dark = () => (document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';",
      "toggle.addEventListener('click', () => {",
      "  const next = dark() ? 'light' : 'dark';",
      '  document.documentElement.dataset.theme = next;',
      "  try { localStorage.setItem('mads-theme', next); } catch (e) {}",
      "  toggle.setAttribute('aria-checked', next === 'dark');",
      '});'
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.toggle.theme. Apply the choice at the root:'),
      cm('/// .preferredColorScheme(theme == "dark" ? .dark : theme == "light" ? .light : nil)'),
      'public struct MadsThemeToggle: View {',
      '    @AppStorage("mads-theme") private var theme = ""',
      '    @Environment(\\.colorScheme) private var scheme',
      '    private var isDark: Bool { theme.isEmpty ? scheme == .dark : theme == "dark" }',
      '',
      '    public var body: some View {',
      '        Button { theme = isDark ? "light" : "dark" } label: {',
      '            Capsule()',
      '                .fill(MadsGradient.orangePink)',
      '                .frame(width: 56, height: 36)',
      '                .overlay(alignment: isDark ? .trailing : .leading) {',
      '                    Circle().fill(.white).frame(width: 28, height: 28).padding(4)',
      '                        .overlay {',
      '                            Image(systemName: isDark ? "moon.fill" : "sun.max.fill")',
      '                                .font(.system(size: 13, weight: .bold))',
      '                                .foregroundStyle(isDark ? MadsColor.blueViolet : MadsColor.blazeOrange)',
      '                                .contentTransition(.symbolEffect(.replace))',
      '                        }',
      '                }',
      '                .madsShadowGlow()',
      '        }',
      '        .buttonStyle(.plain)',
      '        .animation(MadsMotion.spring(), value: isDark)',
      '        .accessibilityLabel("Dark mode")',
      '        .accessibilityValue(isDark ? "On" : "Off")',
      '        .accessibilityAddTraits(.isToggle)',
      '    }',
      '}'
    ],
    compose: [
      cm('/** mads.toggle.theme — store the choice (e.g. DataStore) and pass it to MadsTheme(dark = …) */'),
      '@Composable',
      'fun MadsThemeToggle(dark: Boolean, onChange: (Boolean) -> Unit) {',
      '    val offset by animateDpAsState(if (dark) 20.dp else 0.dp, tween(MadsMotion.base, easing = MadsMotion.spring), label = "knob")',
      '    Box(',
      '        Modifier',
      '            .size(56.dp, 36.dp)',
      '            .shadow(12.dp, CircleShape, spotColor = MadsColor.neonPink)',
      '            .clip(CircleShape)',
      '            .background(MadsGradient.orangePink)',
      '            .toggleable(value = dark, role = Role.Switch, onValueChange = onChange)',
      '            .semantics { contentDescription = "Dark mode" }',
      '            .padding(4.dp)',
      '    ) {',
      '        Box(',
      '            Modifier.offset(x = offset).size(28.dp).clip(CircleShape).background(MadsColor.white),',
      '            contentAlignment = Alignment.Center',
      '        ) {',
      '            Crossfade(dark, label = "icon") { isDark ->',
      '                Icon(',
      '                    if (isDark) Icons.Filled.DarkMode else Icons.Filled.LightMode, null,',
      '                    tint = if (isDark) MadsColor.blueViolet else MadsColor.blazeOrange,',
      '                    modifier = Modifier.size(16.dp)',
      '                )',
      '            }',
      '        }',
      '    }',
      '}'
    ],
    xml: [
      cm('<!-- Use a SwitchCompat with these drawables, and in code:'),
      cm('     AppCompatDelegate.setDefaultNightMode(if (isChecked) MODE_NIGHT_YES else MODE_NIGHT_NO) -->'),
      '',
      cm('<!-- res/drawable/mads_toggle_track.xml -->'),
      esc('<shape xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <size android:width="56dp" android:height="36dp" />'),
      esc('    <corners android:radius="18dp" />'),
      esc('    <gradient android:angle="0" android:startColor="@color/mads_color_blaze_orange" android:endColor="@color/mads_color_neon_pink" />'),
      esc('</shape>'),
      '',
      cm('<!-- res/drawable/mads_toggle_thumb.xml -->'),
      esc('<layer-list xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <item android:top="4dp" android:bottom="4dp" android:left="4dp" android:right="4dp">'),
      esc('        <shape android:shape="oval"><size android:width="28dp" android:height="28dp" />'),
      esc('            <solid android:color="@color/mads_color_white" /></shape>'),
      esc('    </item>'),
      esc('</layer-list>'),
      '',
      esc('<androidx.appcompat.widget.SwitchCompat'),
      esc('    android:id="@+id/themeToggle" android:contentDescription="Dark mode"'),
      esc('    app:track="@drawable/mads_toggle_track" app:thumbTint="@null"'),
      esc('    android:thumb="@drawable/mads_toggle_thumb" />')
    ]
  });
})();

/* ===== mads.popover / mads.language.switch ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  const src = window.MADS_SOURCE || {};
  const lines = s => (s || '').trim().split('\n').map(esc);
  rows('popover-rows', [
    ['mads.popover.button', v('mads.button.round · 44'), 'While its card is open: fill ghost and a TextFaint border. Settings turns 120° with the spring; Ideas turns AmberGold and plays its glow'],
    ['mads.popover.card', v('mads.card · 330 wide · padding 4 18'), 'Opens 12 below the button, lined up with its right edge, with mads.shadow.raised. A card of links is 300 wide'],
    ['mads.popover.row', v('padding 14 · gap 16'), 'A label (mads.text.default, with an optional hint in mads.text.small, TextFaint) and a control. A 1px line between rows'],
    ['mads.popover.link', v('52 tall · chevron 16'), 'A row that is a link. Hover: AzureBlue, and the chevron moves 3 to the right with the spring'],
    ['motion', v('slow · entrance'), 'The card grows from the button as a circle; the rows slide in 10 up, from 110ms and 80ms apart. Closing takes duration.base'],
    ['--mads-popover-shift', v('px · screens up to 620'), 'Moves the card to the right so it lines up with the buttons beside it (the shift prop in Astro)'],
    ['mads.language.switch', v('36 tall · full radius · flag 16'), 'Mono label, mads.text.default size. Hover: AzureBlue. aria-disabled: 45% opacity and greyscale']
  ]);
  fill('popover', {
    css: [
      cm('<!-- Astro (the @maadan/mads package): the components write the markup and add the script -->'),
      esc("import IdeasMenu from '@maadan/mads/components/IdeasMenu.astro';"),
      esc("import SettingsMenu from '@maadan/mads/components/SettingsMenu.astro';"),
      esc("import PopoverRow from '@maadan/mads/components/PopoverRow.astro';"),
      esc("import ThemeToggle from '@maadan/mads/components/ThemeToggle.astro';"),
      '',
      esc('<IdeasMenu links={[{ href: "/mads/", text: "MA Design System (MADS)" }]} />'),
      esc('<SettingsMenu>'),
      esc('  <PopoverRow label="Toggle to dark or light mode"><ThemeToggle /></PopoverRow>'),
      esc('</SettingsMenu>'),
      '',
      cm('<!-- The same in plain HTML -->'),
      esc('<div class="mads-popover" id="settings" data-mads-popover>'),
      esc('  <button type="button" class="mads-button-round mads-popover-button" data-icon="settings"'),
      esc('          aria-expanded="false" aria-controls="settingsCard" aria-label="Settings">'),
      esc('    <svg class="mads-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="…" /></svg>'),
      esc('  </button>'),
      esc('  <div class="mads-card mads-popover-card" id="settingsCard" role="group" aria-label="Settings">'),
      esc('    <div class="mads-popover-row"><span class="mads-popover-label">Toggle to dark or light mode</span> …toggle… </div>'),
      esc('  </div>'),
      esc('</div>'),
      '',
      cm('/* css/mads.css */'),
      ...lines(src.popoverCss),
      '',
      cm('/* JS: components/popover.js (Astro adds it for you) */'),
      ...lines(src.popoverJs)
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.popover: a round button that opens a floating card below it, lined up with its right edge.'),
      cm('/// Give every popover on a screen the same `open` binding, so only one is open at a time:'),
      cm('/// @State private var open: String? = nil'),
      'public struct MadsPopover<Content: View>: View {',
      '    let id: String',
      '    let icon: MadsIconName',
      '    let label: String',
      '    @Binding var open: String?',
      '    @ViewBuilder var content: () -> Content',
      '    @State private var glow = 0',
      '    private var isOpen: Bool { open == id }',
      '',
      '    public var body: some View {',
      '        Button { withAnimation(MadsMotion.entrance(MadsMotion.slow)) { open = isOpen ? nil : id } } label: {',
      '            Group {',
      '                if icon == .ideas { MadsIdeasIcon(size: 20, trigger: $glow) } else { MadsIcon(icon, size: 20) }',
      '            }',
      '            .foregroundStyle(icon == .ideas && isOpen ? MadsTheme.textAmberGold : MadsTheme.text)',
      '            .rotationEffect(.degrees(icon == .settings && isOpen ? 120 : 0))',
      '            .animation(MadsMotion.spring(MadsMotion.slow), value: isOpen)',
      '        }',
      '        .buttonStyle(.madsRound)',
      '        .accessibilityLabel(label)',
      '        .accessibilityValue(isOpen ? "Expanded" : "Collapsed")',
      '        .onChange(of: isOpen) { if isOpen { glow += 1 } }',
      '        .overlay(alignment: .topTrailing) {',
      '            if isOpen {',
      '                VStack(spacing: 0) { content() }',
      '                    .padding(.horizontal, 18).padding(.vertical, 4)',
      '                    .frame(width: 330)',
      '                    .background(MadsTheme.surface, in: RoundedRectangle(cornerRadius: MadsRadius.large))',
      '                    .overlay(RoundedRectangle(cornerRadius: MadsRadius.large).strokeBorder(MadsTheme.line))',
      '                    .madsShadowRaised()',
      '                    .fixedSize()',
      '                    .offset(y: 44 + 12)',
      '                    .transition(.scale(scale: 0.94, anchor: .topTrailing).combined(with: .opacity))',
      '                    .accessibilityElement(children: .contain)',
      '                    .accessibilityLabel(label)',
      '            }',
      '        }',
      '        .zIndex(isOpen ? 1 : 0)',
      '    }',
      '}',
      '',
      cm('/// mads.popover.row: a label and a control, with a line above every row but the first'),
      'public struct MadsPopoverRow<Control: View>: View {',
      '    let label: String',
      '    var divider = true',
      '    @ViewBuilder var control: () -> Control',
      '    public var body: some View {',
      '        HStack(spacing: 16) {',
      '            Text(label).madsText(.default).foregroundStyle(MadsTheme.text)',
      '            Spacer(minLength: 0)',
      '            control()',
      '        }',
      '        .padding(.vertical, 14)',
      '        .overlay(alignment: .top) { if divider { Rectangle().fill(MadsTheme.line).frame(height: 1) } }',
      '    }',
      '}',
      '',
      cm('/// mads.language.switch: a pill with a round flag (an image in your asset catalogue)'),
      'public struct MadsLanguageSwitch: View {',
      '    let text: String',
      '    let flag: String',
      '    var enabled = true',
      '    let action: () -> Void',
      '    public var body: some View {',
      '        Button(action: action) {',
      '            HStack(spacing: 8) {',
      '                Image(flag).resizable().scaledToFill().frame(width: 16, height: 16).clipShape(Circle())',
      '                Text(text).font(MadsFont.mono(14, weight: .medium))',
      '            }',
      '            .foregroundStyle(MadsTheme.text)',
      '            .padding(.leading, 10).padding(.trailing, 14).frame(height: 36)',
      '            .overlay(Capsule().strokeBorder(MadsTheme.line))',
      '        }',
      '        .buttonStyle(.plain)',
      '        .disabled(!enabled)',
      '        .opacity(enabled ? 1 : 0.45)',
      '        .saturation(enabled ? 1 : 0.4)',
      '    }',
      '}',
      '',
      cm('// MadsPopover(id: "settings", icon: .settings, label: "Settings", open: $open) {'),
      cm('//     MadsPopoverRow(label: "Toggle to dark or light mode", divider: false) { MadsThemeToggle() }'),
      cm('// }'),
      cm('// Close it from a tap anywhere else: .onTapGesture { open = nil } on the screen background')
    ],
    compose: [
      cm('/** mads.popover: a round button that opens a floating card below it, lined up with its right edge.'),
      cm(' *  Share `open` between the popovers on a screen so only one is open at a time.'),
      cm(' *  For mads.icon.ideas, draw MadsIdeasIcon(trigger, tint = c.textAmberGold) in the button instead of the plain icon. */'),
      '@Composable',
      'fun MadsPopover(',
      '    id: String,',
      '    icon: ImageVector,',
      '    label: String,',
      '    open: String?,',
      '    onOpenChange: (String?) -> Unit,',
      '    width: Dp = 330.dp,',
      '    content: @Composable ColumnScope.() -> Unit',
      ') {',
      '    val c = MadsTheme.colors',
      '    val isOpen = open == id',
      '    val turn by animateFloatAsState(if (isOpen && icon == MadsIcons.settings) 120f else 0f,',
      '        tween(MadsMotion.slow, easing = MadsMotion.spring), label = "turn")',
      '    val shown = remember { MutableTransitionState(false) }.apply { targetState = isOpen }',
      '    Box {',
      '        Box(Modifier.graphicsLayer { rotationZ = turn }) {',
      '            MadsRoundButton(icon, label = label, onClick = { onOpenChange(if (isOpen) null else id) })',
      '        }',
      '        if (shown.currentState || shown.targetState) {',
      '            val below = with(LocalDensity.current) { (44 + 12).dp.roundToPx() }',
      '            Popup(',
      '                alignment = Alignment.TopEnd, offset = IntOffset(0, below),',
      '                onDismissRequest = { onOpenChange(null) },',
      '                properties = PopupProperties(focusable = true)',
      '            ) {',
      '                AnimatedVisibility(',
      '                    shown,',
      '                    enter = scaleIn(tween(MadsMotion.slow, easing = MadsMotion.entrance), 0.94f, TransformOrigin(1f, 0f)) +',
      '                        fadeIn(tween(MadsMotion.fast)),',
      '                    exit = fadeOut(tween(MadsMotion.base))',
      '                ) {',
      '                    Column(',
      '                        Modifier.width(width)',
      '                            .shadow(24.dp, MadsRadius.large)',
      '                            .clip(MadsRadius.large)',
      '                            .background(c.surface)',
      '                            .border(1.dp, c.line, MadsRadius.large)',
      '                            .padding(horizontal = 18.dp, vertical = 4.dp)',
      '                            .semantics { contentDescription = label },',
      '                        content = content',
      '                    )',
      '                }',
      '            }',
      '        }',
      '    }',
      '}',
      '',
      cm('/** mads.popover.row: a label and a control, with a line above every row but the first */'),
      '@Composable',
      'fun MadsPopoverRow(label: String, divider: Boolean = true, control: @Composable () -> Unit) {',
      '    val c = MadsTheme.colors',
      '    if (divider) HorizontalDivider(thickness = 1.dp, color = c.line)',
      '    Row(',
      '        Modifier.fillMaxWidth().padding(vertical = 14.dp),',
      '        verticalAlignment = Alignment.CenterVertically,',
      '        horizontalArrangement = Arrangement.spacedBy(16.dp)',
      '    ) {',
      '        Text(label, style = MadsText.default, color = c.text, modifier = Modifier.weight(1f))',
      '        control()',
      '    }',
      '}',
      '',
      cm('/** mads.language.switch: a pill with a round flag */'),
      '@Composable',
      'fun MadsLanguageSwitch(text: String, flag: Painter, enabled: Boolean = true, onClick: () -> Unit) {',
      '    val c = MadsTheme.colors',
      '    Row(',
      '        Modifier.height(36.dp)',
      '            .graphicsLayer { alpha = if (enabled) 1f else 0.45f }',
      '            .clip(CircleShape)',
      '            .border(1.dp, c.line, CircleShape)',
      '            .clickable(enabled = enabled, role = Role.Button, onClick = onClick)',
      '            .padding(start = 10.dp, end = 14.dp),',
      '        verticalAlignment = Alignment.CenterVertically,',
      '        horizontalArrangement = Arrangement.spacedBy(8.dp)',
      '    ) {',
      '        Image(flag, contentDescription = null, contentScale = ContentScale.Crop, modifier = Modifier.size(16.dp).clip(CircleShape))',
      '        Text(text, style = MadsText.default.copy(fontFamily = MadsFont.mono, fontWeight = FontWeight.Medium), color = c.text)',
      '    }',
      '}',
      '',
      cm('// var open by remember { mutableStateOf<String?>(null) }'),
      cm('// MadsPopover("settings", MadsIcons.settings, "Settings", open, { open = it }) {'),
      cm('//     MadsPopoverRow("Toggle to dark or light mode", divider = false) { MadsThemeToggle(dark, onDark) }'),
      cm('// }')
    ],
    xml: [
      cm('<!-- res/drawable/mads_popover_bg.xml: mads.card -->'),
      esc('<shape xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <corners android:radius="20dp" />'),
      esc('    <solid android:color="@color/mads_theme_surface" />'),
      esc('    <stroke android:width="1dp" android:color="@color/mads_theme_line" />'),
      esc('    <padding android:left="18dp" android:right="18dp" android:top="4dp" android:bottom="4dp" />'),
      esc('</shape>'),
      '',
      cm('<!-- res/anim/mads_popover_in.xml: grows from the top right corner -->'),
      esc('<set xmlns:android="http://schemas.android.com/apk/res/android"'),
      esc('    android:interpolator="@interpolator/mads_motion_entrance" android:duration="@integer/mads_motion_duration_slow">'),
      esc('    <scale android:fromXScale="0.94" android:toXScale="1" android:fromYScale="0.94" android:toYScale="1"'),
      esc('        android:pivotX="100%" android:pivotY="0%" />'),
      esc('    <alpha android:fromAlpha="0" android:toAlpha="1" android:duration="@integer/mads_motion_duration_fast" />'),
      esc('</set>'),
      '',
      cm('<!-- res/anim/mads_popover_out.xml -->'),
      esc('<alpha xmlns:android="http://schemas.android.com/apk/res/android"'),
      esc('    android:fromAlpha="1" android:toAlpha="0" android:duration="@integer/mads_motion_duration_base" />'),
      '',
      cm('<!-- res/values/mads_popover.xml -->'),
      esc('<resources>'),
      esc('    <style name="Animation.Mads.Popover" parent="">'),
      esc('        <item name="android:windowEnterAnimation">@anim/mads_popover_in</item>'),
      esc('        <item name="android:windowExitAnimation">@anim/mads_popover_out</item>'),
      esc('    </style>'),
      esc('    <style name="Widget.Mads.Popover.Row" parent="">'),
      esc('        <item name="android:layout_width">match_parent</item>'),
      esc('        <item name="android:layout_height">wrap_content</item>'),
      esc('        <item name="android:orientation">horizontal</item>'),
      esc('        <item name="android:gravity">center_vertical</item>'),
      esc('        <item name="android:paddingTop">14dp</item>'),
      esc('        <item name="android:paddingBottom">14dp</item>'),
      esc('    </style>'),
      esc('    <style name="Widget.Mads.LanguageSwitch" parent="Widget.MaterialComponents.Button.OutlinedButton">'),
      esc('        <item name="android:minHeight">36dp</item>'),
      esc('        <item name="android:insetTop">0dp</item>'),
      esc('        <item name="android:insetBottom">0dp</item>'),
      esc('        <item name="android:paddingStart">10dp</item>'),
      esc('        <item name="android:paddingEnd">14dp</item>'),
      esc('        <item name="android:fontFamily">@font/mads_mono</item>'),
      esc('        <item name="android:textAllCaps">false</item>'),
      esc('        <item name="android:textColor">@color/mads_theme_text</item>'),
      esc('        <item name="cornerRadius">18dp</item>'),
      esc('        <item name="strokeColor">@color/mads_theme_line</item>'),
      esc('        <item name="iconSize">16dp</item>'),
      esc('        <item name="iconTint">@null</item>'),
      esc('        <item name="iconPadding">8dp</item>'),
      esc('    </style>'),
      esc('</resources>'),
      '',
      cm('<!-- res/layout/mads_popover_settings.xml: the card (a separator View of 1dp mads_theme_line between rows) -->'),
      esc('<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"'),
      esc('    android:layout_width="330dp" android:layout_height="wrap_content"'),
      esc('    android:orientation="vertical" android:background="@drawable/mads_popover_bg" android:elevation="24dp">'),
      esc('    <LinearLayout style="@style/Widget.Mads.Popover.Row">'),
      esc('        <TextView android:layout_width="0dp" android:layout_weight="1" android:layout_height="wrap_content"'),
      esc('            android:text="Toggle to dark or light mode" android:textAppearance="@style/TextAppearance.Mads.Default" />'),
      esc('        <com.google.android.material.switchmaterial.SwitchMaterial android:id="@+id/theme_toggle" … />'),
      esc('    </LinearLayout>'),
      esc('</LinearLayout>'),
      '',
      cm('<!-- In code: open it 12dp below the round button, lined up with its right edge. Only one is open at a time:'),
      cm('     focusable = true closes it on a tap outside or Back.'),
      cm('     val popup = PopupWindow(layoutInflater.inflate(R.layout.mads_popover_settings, null),'),
      cm('         WRAP_CONTENT, WRAP_CONTENT, true).apply { animationStyle = R.style.Animation_Mads_Popover; elevation = 24f.dp }'),
      cm('     settingsButton.setOnClickListener { popup.showAsDropDown(it, 0, 12.dp, Gravity.END)'),
      cm('         it.animate().rotation(120f).setDuration(600).setInterpolator(springInterpolator) }'),
      cm('     popup.setOnDismissListener { settingsButton.animate().rotation(0f) } -->')
    ]
  });
})();

/* ===== mads.card ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  rows('card-rows', [
    ['mads.card', v('surface · line · radius.large · padding 24'), 'Title in mads.heading.small, text in mads.text.large and text-muted, 16 between them'],
    ['mads.card.marker', v('10 diamond · any mads.color'), 'A rotated square with a 3 corner'],
    ['mads.card.compact', v('surface · line · radius.medium · padding 16'), 'Mono semibold title and default text, 4 between them'],
    ['mads.card.selectable', v('surface-idle → surface · radius.large'), 'Selected: accent border at 60%, accent title, thin bar filling over 8s'],
    ['mads.stat', v('heading.xxlarge · text.default'), 'Number in an accent text role, label in text-muted']
  ]);
  const box = document.getElementById('select-demo');
  if (box) {
    const cards = [...box.querySelectorAll('.mads-card-selectable')];
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0, auto = !still;
    const pick = n => { i = (n + cards.length) % cards.length; cards.forEach((c, k) => c.setAttribute('aria-pressed', k === i)); };
    cards.forEach((c, k) => {
      c.addEventListener('click', () => { auto = false; pick(k); });
      c.querySelector('.mads-progress-thin i').addEventListener('animationend', () => { if (auto) pick(i + 1); });
    });
  }
  fill('card', {
    css: [
      cm('<!-- Astro (the @maadan/mads package) -->'),
      esc("import Card from '@maadan/mads/components/Card.astro';"),
      esc("import CompactCard from '@maadan/mads/components/CompactCard.astro';"),
      esc("import SelectableCard from '@maadan/mads/components/SelectableCard.astro';"),
      esc("import Stat from '@maadan/mads/components/Stat.astro';"),
      esc('<Card title="Lorem ipsum" marker="amber-gold">Dolor sit amet.</Card>'),
      esc('<CompactCard title="Lorem ipsum">Dolor sit amet</CompactCard>'),
      esc('<SelectableCard index="2012" title="Lorem ipsum" accent="text-azure-blue" pressed>Dolor sit amet.</SelectableCard>'),
      esc('<Stat value="20+" accent="text-amber-gold">Lorem ipsum dolor</Stat>'),
      '',
      '.mads-card {',
      '  display: grid; gap: var(--mads-space-3); padding: 1.5rem; border-radius: var(--mads-radius-large);',
      '  background: var(--mads-theme-surface); border: 1px solid var(--mads-theme-line); color: var(--mads-theme-text);',
      '}',
      '.mads-card-title { display: flex; align-items: center; gap: .625rem; margin: 0; font: var(--mads-heading-small); }',
      '.mads-card-marker { width: .625rem; height: .625rem; border-radius: 3px; transform: rotate(45deg); background: var(--marker); }',
      '.mads-card-body { margin: 0; font: var(--mads-text-large); color: var(--mads-theme-text-muted); }',
      '',
      '.mads-card-compact { display: grid; gap: var(--mads-space-1); padding: 1rem; border-radius: var(--mads-radius-medium);',
      '  background: var(--mads-theme-surface); border: 1px solid var(--mads-theme-line); }',
      '',
      '.mads-card-selectable { display: grid; grid-template-columns: auto 1fr; padding: 1.25rem; border-radius: var(--mads-radius-large);',
      '  border: 1px solid var(--mads-theme-line); background: var(--mads-theme-surface-idle);',
      '  transition: background-color var(--mads-motion-duration-base) var(--mads-motion-easing-standard); }',
      '.mads-card-selectable[aria-pressed="true"] { background: var(--mads-theme-surface);',
      '  border-color: color-mix(in srgb, var(--accent) 60%, transparent); }',
      '.mads-card-selectable[aria-pressed="true"] .t { color: var(--accent); }',
      '.mads-card-selectable[aria-pressed="true"] .mads-progress-thin i { animation: mads-progress-fill 8s linear forwards; }',
      '',
      '.mads-stat b { font: var(--mads-heading-xxlarge); letter-spacing: -.02em; color: var(--accent); }',
      '.mads-stat span { font: var(--mads-text-default); color: var(--mads-theme-text-muted); }',
      '',
      cm('<!-- <div class="mads-card" style="--marker: var(--mads-color-amber-gold)">'),
      cm('       <h3 class="mads-card-title"><i class="mads-card-marker"></i>Title</h3>'),
      cm('       <p class="mads-card-body">Text</p></div> -->')
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.card'),
      'public struct MadsCard: View {',
      '    let title: String, text: String, marker: Color',
      '    public var body: some View {',
      '        VStack(alignment: .leading, spacing: 16) {',
      '            HStack(spacing: 10) {',
      '                RoundedRectangle(cornerRadius: 3).fill(marker).frame(width: 10, height: 10).rotationEffect(.degrees(45))',
      '                Text(title).madsHeading(.small)',
      '            }',
      '            Text(text).madsText(.large).foregroundStyle(MadsTheme.textMuted)',
      '        }',
      '        .frame(maxWidth: .infinity, alignment: .leading)',
      '        .padding(24)',
      '        .background(MadsTheme.surface, in: RoundedRectangle(cornerRadius: MadsRadius.large))',
      '        .overlay(RoundedRectangle(cornerRadius: MadsRadius.large).strokeBorder(MadsTheme.line))',
      '        .foregroundStyle(MadsTheme.text)',
      '    }',
      '}',
      '',
      cm('/// mads.stat'),
      'public struct MadsStat: View {',
      '    let value: String, label: String, accent: Color',
      '    public var body: some View {',
      '        VStack(alignment: .leading, spacing: 10) {',
      '            Text(value).madsHeading(.xxlarge).foregroundStyle(accent)',
      '            Text(label).madsText(.default).foregroundStyle(MadsTheme.textMuted)',
      '        }',
      '    }',
      '}',
      '',
      cm('// mads.card.compact: the same with padding 16, MadsRadius.medium, spacing 4.')
    ],
    compose: [
      cm('/** mads.card */'),
      '@Composable',
      'fun MadsCard(title: String, text: String, marker: Color, modifier: Modifier = Modifier) {',
      '    val c = MadsTheme.colors',
      '    Column(',
      '        modifier.fillMaxWidth().clip(MadsRadius.large).background(c.surface)',
      '            .border(1.dp, c.line, MadsRadius.large).padding(24.dp),',
      '        verticalArrangement = Arrangement.spacedBy(16.dp)',
      '    ) {',
      '        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {',
      '            Box(Modifier.size(10.dp).rotate(45f).clip(RoundedCornerShape(3.dp)).background(marker))',
      '            Text(title, style = MadsHeading.small, color = c.text)',
      '        }',
      '        Text(text, style = MadsText.large, color = c.textMuted)',
      '    }',
      '}',
      '',
      cm('/** mads.stat */'),
      '@Composable',
      'fun MadsStat(value: String, label: String, accent: Color) = Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {',
      '    Text(value, style = MadsHeading.xxlarge, color = accent)',
      '    Text(label, style = MadsText.default, color = MadsTheme.colors.textMuted)',
      '}'
    ],
    xml: [
      cm('<!-- res/drawable/mads_card_bg.xml -->'),
      esc('<shape xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <corners android:radius="@dimen/mads_radius_large" />'),
      esc('    <solid android:color="@color/mads_theme_surface" />'),
      esc('    <stroke android:width="1dp" android:color="@color/mads_theme_line" />'),
      esc('</shape>'),
      '',
      cm('<!-- Layout -->'),
      esc('<LinearLayout android:orientation="vertical" android:padding="24dp"'),
      esc('    android:background="@drawable/mads_card_bg" android:showDividers="middle"'),
      esc('    android:divider="@drawable/mads_space_16">'),
      esc('    <TextView android:textAppearance="@style/TextAppearance.Mads.Heading.Small"'),
      esc('        android:textColor="@color/mads_theme_text" android:drawableStart="@drawable/mads_card_marker"'),
      esc('        android:drawablePadding="10dp" />'),
      esc('    <TextView android:textAppearance="@style/TextAppearance.Mads.Large"'),
      esc('        android:textColor="@color/mads_theme_text_muted" />'),
      esc('</LinearLayout>')
    ]
  });
})();

/* ===== mads.chip / mads.tag ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  rows('chip-rows', [
    ['mads.chip', v('mono 13 · padding 8 / 12 · line'), 'Text in text-muted, full radius'],
    ['mads.chip.location', v('fill-soft · 7 NeonPink dot'), 'The dot has a 3 halo at 30%'],
    ['mads.tag', v('label.xsmall · NeonPink · White'), 'Padding 4 / 8, capitals with 0.08em tracking. White on NeonPink is 3.83:1.']
  ]);
  fill('chip', {
    css: [
      cm('<!-- Astro (the @maadan/mads package) -->'),
      esc("import Chip from '@maadan/mads/components/Chip.astro';"),
      esc("import Tag from '@maadan/mads/components/Tag.astro';"),
      esc('<Chip>Lorem</Chip> <Chip location>Lorem · Ipsum</Chip> <Tag>Video</Tag>'),
      '',
      '.mads-chip {',
      '  display: inline-flex; align-items: center; gap: var(--mads-space-2); padding: .5rem .75rem;',
      '  border: 1px solid var(--mads-theme-line); border-radius: var(--mads-radius-full);',
      '  color: var(--mads-theme-text-muted); font: 500 var(--mads-text-default-size)/1 var(--mads-font-mono);',
      '}',
      '.mads-chip-location { background: var(--mads-theme-fill-soft); color: var(--mads-theme-text); }',
      '.mads-chip-location::before {',
      '  content: ""; width: .4375rem; height: .4375rem; border-radius: 50%; background: var(--mads-color-neon-pink);',
      '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--mads-color-neon-pink) 30%, transparent);',
      '}',
      '.mads-tag {',
      '  padding: .25rem .5rem; border-radius: var(--mads-radius-full);',
      '  background: var(--mads-color-neon-pink); color: var(--mads-color-white);',
      '  font: var(--mads-label-weight) var(--mads-label-xsmall-size)/1 var(--mads-font-mono); text-transform: uppercase; letter-spacing: .08em;',
      '}'
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.chip (set location: true for mads.chip.location)'),
      'public struct MadsChip: View {',
      '    let text: String; var location = false',
      '    public var body: some View {',
      '        HStack(spacing: 8) {',
      '            if location {',
      '                Circle().fill(MadsColor.neonPink).frame(width: 7, height: 7)',
      '                    .background(Circle().fill(MadsColor.neonPink.opacity(0.3)).padding(-3))',
      '            }',
      '            Text(text).font(MadsFont.mono(13, weight: .medium))',
      '        }',
      '        .foregroundStyle(location ? MadsTheme.text : MadsTheme.textMuted)',
      '        .padding(.vertical, 8).padding(.horizontal, 12)',
      '        .background(location ? MadsTheme.fillSoft : .clear, in: Capsule())',
      '        .overlay(Capsule().strokeBorder(MadsTheme.line))',
      '    }',
      '}',
      '',
      cm('/// mads.tag'),
      'public struct MadsTag: View {',
      '    let text: String',
      '    public var body: some View {',
      '        Text(text).font(MadsFont.mono(11, weight: .bold)).textCase(.uppercase).tracking(0.9)',
      '            .foregroundStyle(MadsColor.white)',
      '            .padding(.vertical, 4).padding(.horizontal, 8)',
      '            .background(MadsColor.neonPink, in: Capsule())',
      '    }',
      '}'
    ],
    compose: [
      cm('/** mads.chip */'),
      '@Composable',
      'fun MadsChip(text: String, location: Boolean = false) {',
      '    val c = MadsTheme.colors',
      '    Row(',
      '        Modifier.clip(CircleShape).background(if (location) c.fillSoft else Color.Transparent)',
      '            .border(1.dp, c.line, CircleShape).padding(horizontal = 12.dp, vertical = 8.dp),',
      '        verticalAlignment = Alignment.CenterVertically,',
      '        horizontalArrangement = Arrangement.spacedBy(8.dp)',
      '    ) {',
      '        if (location) Box(Modifier.size(7.dp).clip(CircleShape).background(MadsColor.neonPink))',
      '        Text(text, style = MadsText.default.copy(fontFamily = MadsFont.mono, fontWeight = FontWeight.Medium),',
      '            color = if (location) c.text else c.textMuted)',
      '    }',
      '}',
      '',
      cm('/** mads.tag */'),
      '@Composable',
      'fun MadsTag(text: String) = Text(',
      '    text.uppercase(),',
      '    style = MadsLabel.xsmall.copy(letterSpacing = 0.08.em),',
      '    color = MadsColor.white,',
      '    modifier = Modifier.clip(CircleShape).background(MadsColor.neonPink).padding(horizontal = 8.dp, vertical = 4.dp)',
      ')'
    ],
    xml: [
      cm('<!-- res/drawable/mads_chip_bg.xml -->'),
      esc('<shape xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <corners android:radius="999dp" />'),
      esc('    <stroke android:width="1dp" android:color="@color/mads_theme_line" />'),
      esc('</shape>'),
      '',
      cm('<!-- res/values/mads_chip.xml -->'),
      esc('<resources>'),
      esc('    <style name="Widget.Mads.Chip" parent="">'),
      esc('        <item name="android:background">@drawable/mads_chip_bg</item>'),
      esc('        <item name="android:fontFamily">@font/mads_mono</item>'),
      esc('        <item name="android:textSize">13sp</item>'),
      esc('        <item name="android:textColor">@color/mads_theme_text_muted</item>'),
      esc('        <item name="android:paddingHorizontal">12dp</item>'),
      esc('        <item name="android:paddingVertical">8dp</item>'),
      esc('    </style>'),
      esc('    <style name="Widget.Mads.Tag" parent="TextAppearance.Mads.Label.Xsmall">'),
      esc('        <item name="android:background">@drawable/mads_tag_bg</item>'),
      esc('        <item name="android:textColor">@color/mads_color_white</item>'),
      esc('        <item name="android:letterSpacing">0.08</item>'),
      esc('        <item name="android:paddingHorizontal">8dp</item>'),
      esc('        <item name="android:paddingVertical">4dp</item>'),
      esc('    </style>'),
      esc('</resources>')
    ]
  });
})();

/* ===== mads.progress ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  rows('progress-rows', [
    ['mads.progress', v('8 tall · fill-soft track · radius.small'), 'Label 96 wide in mono 13, value 40 wide on the right'],
    ['mads.progress.fill', v('any mads.gradient'), 'Grows from the left with duration.slow and easing.standard'],
    ['mads.progress.thin', v('4 tall · line track'), 'Fills in an accent colour over a set time']
  ]);
  const demo = document.getElementById('progress-demo');
  if (demo) {
    const bars = [...demo.querySelectorAll('.mads-progress-track i')];
    const outs = [...demo.querySelectorAll('output')];
    const set = vals => bars.forEach((b, k) => { b.style.setProperty('--value', vals[k]); outs[k].textContent = Math.round(vals[k] * 100) + '%'; });
    requestAnimationFrame(() => requestAnimationFrame(() => set(bars.map(b => +b.dataset.value))));
    document.getElementById('progress-shuffle')?.addEventListener('click', () => {
      const r = [Math.random() + .1, Math.random() + .1, Math.random() + .1]; const s = r[0] + r[1] + r[2];
      const p = r.map(x => Math.round(x / s * 100)); p[0] = 100 - p[1] - p[2];
      set(p.map(x => x / 100));
    });
  }
  fill('progress', {
    css: [
      cm('<!-- Astro (the @maadan/mads package) -->'),
      esc("import Progress from '@maadan/mads/components/Progress.astro';"),
      esc('<Progress label="Lorem" value={0.7} fill="violet-azure" />'),
      '',
      cm('<!-- <div class="mads-progress"><span>Label</span><span class="mads-progress-track"><i style="--value:.7; --fill:var(--mads-gradient-violet-azure)"></i></span><output>70%</output></div> -->'),
      '.mads-progress { display: grid; grid-template-columns: 6rem 1fr 2.5rem; gap: .75rem; align-items: center;',
      '  font: 500 var(--mads-text-default-size)/1 var(--mads-font-mono); color: var(--mads-theme-text-muted); }',
      '.mads-progress-track { height: .5rem; border-radius: var(--mads-radius-small); background: var(--mads-theme-fill-soft); overflow: hidden; }',
      '.mads-progress-track i { display: block; height: 100%; background: var(--fill); transform-origin: left;',
      '  transform: scaleX(var(--value)); transition: transform var(--mads-motion-duration-slow) var(--mads-motion-easing-standard); }',
      '.mads-progress output { text-align: right; font-variant-numeric: tabular-nums; color: var(--mads-theme-text); }',
      '',
      '.mads-progress-thin { display: block; height: .25rem; border-radius: 2px; background: var(--mads-theme-line); overflow: hidden; }',
      '.mads-progress-thin i { display: block; height: 100%; width: 0; background: var(--accent); }',
      '@keyframes mads-progress-fill { to { width: 100%; } }'
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.progress'),
      'public struct MadsProgress: View {',
      '    let label: String; let value: Double; let fill: LinearGradient',
      '    public var body: some View {',
      '        HStack(spacing: 12) {',
      '            Text(label).font(MadsFont.mono(13, weight: .medium)).foregroundStyle(MadsTheme.textMuted).frame(width: 96, alignment: .leading)',
      '            Capsule().fill(MadsTheme.fillSoft).frame(height: 8)',
      '                .overlay(alignment: .leading) {',
      '                    GeometryReader { g in Capsule().fill(fill).frame(width: g.size.width * value) }',
      '                }',
      '                .clipShape(Capsule())',
      '            Text(value, format: .percent.precision(.fractionLength(0)))',
      '                .font(MadsFont.mono(13, weight: .medium)).monospacedDigit().frame(width: 40, alignment: .trailing)',
      '        }',
      '        .animation(MadsMotion.standard(MadsMotion.slow), value: value)',
      '    }',
      '}'
    ],
    compose: [
      cm('/** mads.progress */'),
      '@Composable',
      'fun MadsProgress(label: String, value: Float, fill: Brush) {',
      '    val c = MadsTheme.colors',
      '    val shown by animateFloatAsState(value, tween(MadsMotion.slow, easing = MadsMotion.standard), label = "progress")',
      '    val mono = MadsText.default.copy(fontFamily = MadsFont.mono, fontWeight = FontWeight.Medium)',
      '    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {',
      '        Text(label, style = mono, color = c.textMuted, modifier = Modifier.width(96.dp))',
      '        Box(Modifier.weight(1f).height(8.dp).clip(MadsRadius.small).background(c.fillSoft)) {',
      '            Box(Modifier.fillMaxHeight().fillMaxWidth(shown).background(fill))',
      '        }',
      '        Text("${(value * 100).roundToInt()}%", style = mono, color = c.text,',
      '            textAlign = TextAlign.End, modifier = Modifier.width(40.dp))',
      '    }',
      '}'
    ],
    xml: [
      cm('<!-- res/drawable/mads_progress.xml — use with a horizontal ProgressBar, 8dp tall -->'),
      esc('<layer-list xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <item android:id="@android:id/background">'),
      esc('        <shape><corners android:radius="@dimen/mads_radius_small" /><solid android:color="@color/mads_theme_fill_soft" /></shape>'),
      esc('    </item>'),
      esc('    <item android:id="@android:id/progress">'),
      esc('        <scale android:scaleWidth="100%">'),
      esc('            <shape><corners android:radius="@dimen/mads_radius_small" />'),
      esc('                <gradient android:angle="0" android:startColor="@color/mads_color_blue_violet" android:endColor="@color/mads_color_azure_blue" /></shape>'),
      esc('        </scale>'),
      esc('    </item>'),
      esc('</layer-list>'),
      '',
      esc('<ProgressBar style="?android:attr/progressBarStyleHorizontal" android:layout_height="8dp"'),
      esc('    android:progressDrawable="@drawable/mads_progress" android:max="100" />'),
      cm('<!-- Animate with ObjectAnimator.ofInt(bar, "progress", value) over mads_motion_duration_slow -->')
    ]
  });
})();

/* ===== mads.list.diamond / mads.quote ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  rows('content-rows', [
    ['mads.list.diamond', v('compact items · 10 diamond'), 'Items use surface, line and radius.medium, text in mads.text.large. 8 between items.'],
    ['mads.quote', v('3 accent line · text.xlarge 500'), 'Left padding 20, up to 56 characters wide'],
    ['mads.text.gradient', v('mads.gradient.brand'), 'Clipped to the text. For display sizes only.']
  ]);
  fill('content', {
    css: [
      cm('<!-- Astro (the @maadan/mads package) -->'),
      esc("import DiamondList from '@maadan/mads/components/DiamondList.astro';"),
      esc("import Quote from '@maadan/mads/components/Quote.astro';"),
      esc('<DiamondList accent="azure-blue"><li>Lorem ipsum</li><li>Dolor sit</li></DiamondList>'),
      esc('<Quote accent="neon-pink">Lorem ipsum dolor sit amet.</Quote>'),
      '',
      '.mads-list-diamond { list-style: none; margin: 0; padding: 0; display: grid;',
      '  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--mads-space-2); }',
      '.mads-list-diamond li { position: relative; padding: 1rem 1rem 1rem 2.5rem;',
      '  background: var(--mads-theme-surface); border: 1px solid var(--mads-theme-line);',
      '  border-radius: var(--mads-radius-medium); font: var(--mads-text-large); }',
      '.mads-list-diamond li::before { content: ""; position: absolute; left: 1rem; top: 1.375rem;',
      '  width: .625rem; height: .625rem; border-radius: 3px; transform: rotate(45deg); background: var(--accent); }',
      '',
      '.mads-quote { margin: 0; border-left: 3px solid var(--accent); padding: .25rem 0 .25rem 1.25rem; max-width: 56ch;',
      '  font: 500 var(--mads-text-xlarge-size)/var(--mads-text-xlarge-line-height) var(--mads-font-body); }'
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.list.diamond — one item'),
      'public struct MadsDiamondItem: View {',
      '    let text: String; let accent: Color',
      '    public var body: some View {',
      '        HStack(alignment: .firstTextBaseline, spacing: 14) {',
      '            RoundedRectangle(cornerRadius: 3).fill(accent).frame(width: 10, height: 10).rotationEffect(.degrees(45))',
      '            Text(text).madsText(.large)',
      '        }',
      '        .frame(maxWidth: .infinity, alignment: .leading)',
      '        .padding(16)',
      '        .background(MadsTheme.surface, in: RoundedRectangle(cornerRadius: MadsRadius.medium))',
      '        .overlay(RoundedRectangle(cornerRadius: MadsRadius.medium).strokeBorder(MadsTheme.line))',
      '    }',
      '}',
      '',
      cm('/// mads.quote'),
      'public struct MadsQuote: View {',
      '    let text: String; let accent: Color',
      '    public var body: some View {',
      '        Text(text).madsText(.xlarge).fontWeight(.medium)',
      '            .padding(.leading, 20).padding(.vertical, 4)',
      '            .overlay(alignment: .leading) { Rectangle().fill(accent).frame(width: 3) }',
      '    }',
      '}'
    ],
    compose: [
      cm('/** mads.list.diamond — one item */'),
      '@Composable',
      'fun MadsDiamondItem(text: String, accent: Color) {',
      '    val c = MadsTheme.colors',
      '    Row(',
      '        Modifier.fillMaxWidth().clip(MadsRadius.medium).background(c.surface)',
      '            .border(1.dp, c.line, MadsRadius.medium).padding(16.dp),',
      '        horizontalArrangement = Arrangement.spacedBy(14.dp)',
      '    ) {',
      '        Box(Modifier.padding(top = 7.dp).size(10.dp).rotate(45f).clip(RoundedCornerShape(3.dp)).background(accent))',
      '        Text(text, style = MadsText.large, color = c.text)',
      '    }',
      '}',
      '',
      cm('/** mads.quote */'),
      '@Composable',
      'fun MadsQuote(text: String, accent: Color) = Row(Modifier.height(IntrinsicSize.Min)) {',
      '    Box(Modifier.width(3.dp).fillMaxHeight().background(accent))',
      '    Text(text, style = MadsText.xlarge.copy(fontWeight = FontWeight.Medium), color = MadsTheme.colors.text,',
      '        modifier = Modifier.padding(start = 20.dp, top = 4.dp, bottom = 4.dp))',
      '}'
    ],
    xml: [
      cm('<!-- res/drawable/mads_quote_bg.xml — a 3dp accent line on the left -->'),
      esc('<layer-list xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <item android:gravity="start" android:width="3dp">'),
      esc('        <shape><solid android:color="@color/mads_color_neon_pink" /></shape>'),
      esc('    </item>'),
      esc('</layer-list>'),
      '',
      esc('<TextView android:background="@drawable/mads_quote_bg" android:paddingStart="20dp"'),
      esc('    android:textAppearance="@style/TextAppearance.Mads.Xlarge" android:textColor="@color/mads_theme_text" />'),
      '',
      cm('<!-- Diamond list items: mads_card_bg with radius_medium, padding 16dp, and a rotated'),
      cm('     10dp square drawable as android:drawableStart -->')
    ]
  });
})();

/* ===== mads.gradient usage ===== */
(() => {
  const { esc, cm, fill, rows, v } = MADSX;
  const dot = c => `<span class="dsd-dot" style="--c:var(--mads-color-${c})"></span>`;
  const bar = g => `<span class="dsd-dot" style="--c:var(--mads-gradient-${g});width:2rem;border-radius:999px;background:var(--mads-gradient-${g})"></span>`;
  rows('topic-rows', [
    ['Default', `${dot('amber-gold')}${v('—')}`, v('—'), `${dot('amber-gold')}${dot('blaze-orange')}${v('amber + orange')}`, 'Introductions and anywhere without a topic'],
    ['Technology', `${dot('azure-blue')}${v('azure-blue')}`, `${bar('violet-azure')}${v('violet-azure')}`, `${dot('azure-blue')}${dot('blue-violet')}${v('azure + violet')}`, 'Engineering, code and technical content'],
    ['People', `${dot('neon-pink')}${v('neon-pink')}`, `${bar('pink-violet')}${v('pink-violet')}`, `${dot('neon-pink')}${dot('blue-violet')}${v('pink + violet')}`, 'Leadership, teams and people content'],
    ['Product', `${dot('amber-gold')}${v('amber-gold')}`, `${bar('orange-amber')}${v('orange-amber')}`, `${dot('amber-gold')}${dot('blaze-orange')}${v('amber + orange')}`, 'Product, planning and delivery content']
  ].map(r => [r[0], ...r.slice(1)]));

  rows('grad-rows', [
    ['mads.gradient.orange-pink', v('blaze-orange → neon-pink'), 'Action: primary button, theme switch, logo bar'],
    ['mads.gradient.brand', v('amber → orange → pink → violet'), 'Highlight: a phrase in a heading or a big stat'],
    ['mads.gradient.amber-pink', v('amber-gold → neon-pink') + '<span class="dsd-sub">new</span>', 'Frames: avatar outline (top to bottom), map routes'],
    ['mads.gradient.violet-azure', v('blue-violet → azure-blue'), 'Topic: Technology'],
    ['mads.gradient.pink-violet', v('neon-pink → blue-violet'), 'Topic: People'],
    ['mads.gradient.orange-amber', v('blaze-orange → amber-gold'), 'Topic: Product'],
    ['mads.gradient.ambient', v('2 radial glows · 16% / 22%') + '<span class="dsd-sub">new</span>', 'Page background, colours follow the topic'],
    ['mads.gradient.surface', v('surface → background, 160°') + '<span class="dsd-sub">new</span>', 'Large panels and stages'],
    ['mads.gradient.surface-raised', v('surface-raised → surface, 180°') + '<span class="dsd-sub">new</span>', 'Media placeholders, avatar backgrounds'],
    ['mads.gradient.scrim', v('background → transparent') + '<span class="dsd-sub">new</span>', 'Under sticky headers']
  ]);

  const amb = document.getElementById('ambient-demo');
  if (amb) {
    const btns = [...amb.querySelectorAll('button')];
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x === b ? x.setAttribute('aria-current', 'page') : x.removeAttribute('aria-current'));
      amb.style.setProperty('--mads-ambient-a', `var(--mads-color-${b.dataset.a})`);
      amb.style.setProperty('--mads-ambient-b', `var(--mads-color-${b.dataset.b})`);
    }));
  }

  fill('grad', {
    css: [
      cm('/* New gradient tokens (the others are in Shape and depth) */'),
      ':root {',
      '  --mads-gradient-amber-pink: linear-gradient(90deg, var(--mads-color-amber-gold), var(--mads-color-neon-pink));',
      '  --mads-gradient-surface: linear-gradient(160deg, var(--mads-theme-surface), var(--mads-theme-background));',
      '  --mads-gradient-surface-raised: linear-gradient(180deg, var(--mads-theme-surface-raised), var(--mads-theme-surface));',
      '  --mads-gradient-scrim: linear-gradient(var(--mads-theme-background) 82%, transparent);',
      '  --mads-ambient-strength: 16%;            ' + cm('/* 22% in dark mode */'),
      '}',
      '',
      cm('/* Highlight: one phrase per heading */'),
      '.mads-text-gradient { background: var(--mads-gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }',
      '',
      cm('/* Ambient glow. Set --mads-ambient-a/b to the topic colours */'),
      '.mads-ambient {',
      '  --mads-ambient-a: var(--mads-color-amber-gold);',
      '  --mads-ambient-b: var(--mads-color-blaze-orange);',
      '  background:',
      '    radial-gradient(60% 50% at 85% 10%, color-mix(in srgb, var(--mads-ambient-a) var(--mads-ambient-strength), transparent), transparent 70%),',
      '    radial-gradient(50% 60% at 5% 90%, color-mix(in srgb, var(--mads-ambient-b) var(--mads-ambient-strength), transparent), transparent 70%),',
      '    var(--mads-theme-background);',
      '}',
      '@property --mads-ambient-a { syntax: "<color>"; inherits: true; initial-value: #FFBE0B; }',
      '@property --mads-ambient-b { syntax: "<color>"; inherits: true; initial-value: #FB5607; }',
      '.mads-ambient { transition: --mads-ambient-a 1.2s var(--mads-motion-easing-standard), --mads-ambient-b 1.2s var(--mads-motion-easing-standard); }',
      '',
      cm('/* Frame: 2px gradient outline that follows the corner radius */'),
      '.mads-frame-gradient { position: relative; }',
      '.mads-frame-gradient::after {',
      '  content: ""; position: absolute; inset: 0; border-radius: inherit; border: 2px solid transparent;',
      '  background: linear-gradient(180deg, var(--mads-color-amber-gold), var(--mads-color-neon-pink)) border-box;',
      '  -webkit-mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);',
      '  -webkit-mask-composite: xor; mask-composite: exclude;',
      '}'
    ],
    swift: [
      'import SwiftUI',
      '',
      'public extension MadsGradient {',
      '    static let amberPink = LinearGradient(colors: [MadsColor.amberGold, MadsColor.neonPink], startPoint: .leading, endPoint: .trailing)',
      '    ' + cm('/// Frames run top to bottom'),
      '    static let frame = LinearGradient(colors: [MadsColor.amberGold, MadsColor.neonPink], startPoint: .top, endPoint: .bottom)',
      '    static let surface = LinearGradient(colors: [MadsTheme.surface, MadsTheme.background], startPoint: .topLeading, endPoint: .bottomTrailing)',
      '    static let surfaceRaised = LinearGradient(colors: [MadsTheme.surfaceRaised, MadsTheme.surface], startPoint: .top, endPoint: .bottom)',
      '}',
      '',
      cm('/// Highlight: Text("Five cities").foregroundStyle(MadsGradient.brand)'),
      '',
      cm('/// mads.gradient.ambient'),
      'public struct MadsAmbient: View {',
      '    var a: Color = MadsColor.amberGold',
      '    var b: Color = MadsColor.blazeOrange',
      '    @Environment(\\.colorScheme) private var scheme',
      '    public var body: some View {',
      '        let k = scheme == .dark ? 0.22 : 0.16',
      '        GeometryReader { g in',
      '            ZStack {',
      '                MadsTheme.background',
      '                RadialGradient(colors: [a.opacity(k), .clear], center: UnitPoint(x: 0.85, y: 0.1),',
      '                               startRadius: 0, endRadius: g.size.width * 0.6 * 0.7)',
      '                RadialGradient(colors: [b.opacity(k), .clear], center: UnitPoint(x: 0.05, y: 0.9),',
      '                               startRadius: 0, endRadius: g.size.width * 0.5 * 0.7)',
      '            }',
      '        }',
      '        .ignoresSafeArea()',
      '        .animation(.easeInOut(duration: 1.2), value: a)',
      '    }',
      '}',
      '',
      cm('/// Frame: .overlay(Capsule().strokeBorder(MadsGradient.frame, lineWidth: 2))')
    ],
    compose: [
      'object MadsGradientExtra {',
      '    val amberPink = Brush.horizontalGradient(listOf(MadsColor.amberGold, MadsColor.neonPink))',
      '    val frame = Brush.verticalGradient(listOf(MadsColor.amberGold, MadsColor.neonPink))',
      '}',
      '',
      cm('/** mads.gradient.ambient — draw behind the screen content */'),
      '@Composable',
      'fun MadsAmbient(a: Color = MadsColor.amberGold, b: Color = MadsColor.blazeOrange, dark: Boolean = isSystemInDarkTheme()) {',
      '    val k = if (dark) 0.22f else 0.16f',
      '    val ca by animateColorAsState(a, tween(1200), label = "a")',
      '    val cb by animateColorAsState(b, tween(1200), label = "b")',
      '    val bg = MadsTheme.colors.background',
      '    Canvas(Modifier.fillMaxSize()) {',
      '        drawRect(bg)',
      '        drawRect(Brush.radialGradient(listOf(ca.copy(alpha = k), Color.Transparent),',
      '            center = Offset(size.width * .85f, size.height * .1f), radius = size.width * .42f))',
      '        drawRect(Brush.radialGradient(listOf(cb.copy(alpha = k), Color.Transparent),',
      '            center = Offset(size.width * .05f, size.height * .9f), radius = size.width * .35f))',
      '    }',
      '}',
      '',
      cm('// Highlight: Text("Five cities", style = MadsHeading.xlarge.copy(brush = MadsGradient.brand))'),
      cm('// Frame:     Modifier.border(2.dp, MadsGradientExtra.frame, CircleShape)')
    ],
    xml: [
      cm('<!-- res/drawable/mads_gradient_amber_pink.xml -->'),
      esc('<shape xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <gradient android:angle="0" android:startColor="@color/mads_color_amber_gold" android:endColor="@color/mads_color_neon_pink" />'),
      esc('</shape>'),
      '',
      cm('<!-- res/drawable/mads_gradient_scrim.xml — under sticky headers -->'),
      esc('<shape xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <gradient android:angle="270" android:startColor="@color/mads_theme_background"'),
      esc('        android:centerColor="@color/mads_theme_background" android:centerY="0.82" android:endColor="@android:color/transparent" />'),
      esc('</shape>'),
      '',
      cm('<!-- res/drawable/mads_ambient.xml — one glow; layer two in a layer-list -->'),
      esc('<shape xmlns:android="http://schemas.android.com/apk/res/android">'),
      esc('    <gradient android:type="radial" android:gradientRadius="60%p" android:centerX="0.85" android:centerY="0.1"'),
      esc('        android:startColor="#38FFBE0B" android:endColor="#00FFBE0B" />'),
      esc('</shape>'),
      cm('<!-- #38 = 22% alpha for night mode; use #29 (16%) in values (light) -->')
    ]
  });
})();

/* ===== mads.icon — grid, motion demos, table and platform code ===== */
(() => {
  const ICONS = [
    { k: 'up',    name: 'Chevron up',    token: 'mads.icon.chevron.up',    file: 'mads-icon-chevron-up.svg',    d: MADS_ICONS['chevron-up'].d },
    { k: 'down',  name: 'Chevron down',  token: 'mads.icon.chevron.down',  file: 'mads-icon-chevron-down.svg',  d: MADS_ICONS['chevron-down'].d },
    { k: 'left',  name: 'Chevron left',  token: 'mads.icon.chevron.left',  file: 'mads-icon-chevron-left.svg',  d: MADS_ICONS['chevron-left'].d },
    { k: 'right', name: 'Chevron right', token: 'mads.icon.chevron.right', file: 'mads-icon-chevron-right.svg', d: MADS_ICONS['chevron-right'].d },
    { k: 'home',  name: 'Home',          token: 'mads.icon.home',          file: 'mads-icon-home.svg',          d: MADS_ICONS['home'].d },
    { k: 'settings', name: 'Settings',   token: 'mads.icon.settings',      file: 'mads-icon-settings.svg',      d: MADS_ICONS['settings'].d },
    { k: 'ideas',    name: 'Ideas',      token: 'mads.icon.ideas',         file: 'mads-icon-ideas.svg', glow: true,         d: MADS_ICONS['ideas'].d }
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cm = s => `<span class="dsd-cm">${esc(s)}</span>`;
  const camel = t => t.replace('mads.icon.', '').replace(/\.(\w)/g, (_, c) => c.toUpperCase());
  const snake = t => t.replace(/\./g, '_');
  const GLOW = '<circle class="mads-icon-glow" cx="12" cy="9.19" r="10"/>';
  const svg = (d, size, glow) => `<svg class="mads-icon" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${glow ? GLOW : ''}<path pathLength="1" d="${d}"/></svg>`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const section = document.getElementById('icons');
  const grid = document.getElementById('icon-grid');
  if (!section || !grid) return;

  /* Grid */
  grid.innerHTML = ICONS.map(i => `
    <button type="button" class="dsd-icon-tile" aria-label="${i.name}, play its motion">
      <span class="dsd-icon-big" data-k="${i.k}">${svg(i.d, 64, i.glow)}</span>
      <span class="dsd-icon-sizes">${svg(i.d, 16)}${svg(i.d, 24)}${svg(i.d, 32)}</span>
      <span class="dsd-icon-meta"><b>${i.name}</b><span class="dsd-tok">${i.token}</span></span>
    </button>`).join('');
  grid.querySelectorAll('.dsd-icon-tile').forEach(t => {
    t.addEventListener('click', () => { t.classList.remove('is-go'); void t.offsetWidth; t.classList.add('is-go'); });
    t.addEventListener('animationend', () => t.classList.remove('is-go'));
  });

  /* Colour */
  const sws = [...document.querySelectorAll('.dsd-icon-sw')];
  sws.forEach(b => b.addEventListener('click', () => {
    sws.forEach(s => s.setAttribute('aria-pressed', s === b));
    const c = b.dataset.c;
    section.style.setProperty('--icon-color', c === 'ink' || c === 'gradient' ? 'var(--dsd-ink)' : `var(--mads-color-${c})`);
    section.classList.toggle('use-grad', c === 'gradient');
  }));

  /* Disclosure */
  section.querySelectorAll('.dsd-acc-head').forEach(h => h.addEventListener('click', () => {
    const item = h.parentElement, open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open); h.setAttribute('aria-expanded', open);
  }));

  /* Morph: chevron up <-> home, the same five points */
  const mp = document.getElementById('icon-morph-path'), mBtn = document.getElementById('icon-morph-btn');
  const A = [14.5, 14.5, 9.5, 14.5, 14.5, 19], B = [19.5, 9.5, 4.5, 9.5, 19.5, 5];
  const toD = v => `M5 ${v[0]}V${v[1]}L12 ${v[2]} 19 ${v[3]}V${v[4]}H${Math.max(5, v[5])}`;
  const spring = t => { const c1 = 1.70158 * 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  let isHome = false, raf = null;
  if (mp && mBtn) mBtn.addEventListener('click', () => {
    const from = isHome ? B : A, to = isHome ? A : B; isHome = !isHome;
    mBtn.textContent = isHome ? 'Morph to Chevron up' : 'Morph to Home';
    mp.closest('svg').setAttribute('aria-label', isHome ? 'Home' : 'Chevron up');
    if (reduce) { mp.setAttribute('d', toD(to)); return; }
    cancelAnimationFrame(raf); const t0 = performance.now(), dur = 650;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), e = spring(t);
      mp.setAttribute('d', toD(from.map((f, i) => +(f + (to[i] - f) * e).toFixed(3))));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  });

  /* Pager */
  const dots = [...document.querySelectorAll('#icon-dots .dsd-pg-dot')]; let page = 0;
  const setPage = p => { page = (p + dots.length) % dots.length; dots.forEach((d, i) => d.classList.toggle('is-on', i === page)); };
  document.getElementById('icon-prev')?.addEventListener('click', () => setPage(page - 1));
  document.getElementById('icon-next')?.addEventListener('click', () => setPage(page + 1));

  /* Draw on */
  const row = document.getElementById('icon-draw-row');
  if (row) {
    row.innerHTML = ICONS.map(i => svg(i.d, 36)).join('');
    const replay = () => row.querySelectorAll('path').forEach((p, n) => {
      if (reduce) return;
      p.style.animation = 'none'; void p.getBoundingClientRect();
      p.style.strokeDasharray = '1 1.02';
      p.style.animation = `dsd-draw .8s cubic-bezier(.2, .8, .2, 1) ${n * 0.12}s both`;
    });
    document.getElementById('icon-draw-btn')?.addEventListener('click', replay);
  }

  /* Table */
  const rows = document.getElementById('icon-rows');
  if (rows) rows.innerHTML = ICONS.map(i => `
    <tr>
      <td><span class="dsd-tok">${i.token}</span><span class="dsd-sub">${i.name}</span></td>
      <td><span class="dsd-val">${i.file}</span></td>
      <td><span class="dsd-val">&lt;svg class="mads-icon"&gt;</span></td>
      <td><span class="dsd-val">MadsIcon(.${camel(i.token)})</span></td>
      <td><span class="dsd-val">MadsIcons.${camel(i.token)}</span><span class="dsd-sub">@drawable/${snake(i.token)}</span></td>
    </tr>`).join('');

  /* Code */
  const code = {
    css: [
      cm('<!-- Inline SVG. The icon takes the text colour, so set color to any mads.color -->'),
      ...ICONS.map(i => esc(`<svg class="mads-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${i.glow ? '<circle class="mads-icon-glow" cx="12" cy="9.19" r="10"/>' : ''}<path d="${i.d}"/></svg>`) + '  ' + cm(`<!-- ${i.token} -->`)),
      '',
      cm('/* mads.icon */'),
      ':root { --mads-icon-stroke: 3.5; }',
      '.mads-icon {',
      '  fill: none; stroke: currentColor; stroke-width: var(--mads-icon-stroke);',
      '  stroke-linecap: round; stroke-linejoin: round; overflow: visible;',
      '}',
      '',
      cm('/* Motion: chevrons nudge the way they point, Home draws itself on, Settings turns one tooth, Ideas glows */'),
      '@keyframes mads-icon-nudge-down { 50% { transform: translateY(6px); } }',
      '@keyframes mads-icon-draw { from { stroke-dashoffset: 1.01; } to { stroke-dashoffset: 0; } }',
      '.mads-icon.is-nudge-down { animation: mads-icon-nudge-down .5s cubic-bezier(.34, 1.56, .64, 1); }',
      '.mads-icon.is-draw path { stroke-dasharray: 1 1.02; animation: mads-icon-draw .9s cubic-bezier(.2, .7, .2, 1); }',
      '@keyframes mads-icon-turn { to { transform: rotate(60deg); } }',
      '.mads-icon.is-turn { animation: mads-icon-turn .6s cubic-bezier(.34, 1.56, .64, 1); }',
      cm('/* mads.icon.ideas default: a solid AmberGold circle at 50% alpha grows from the bulb centre, then fades out */'),
      '.mads-icon-glow { fill: var(--mads-color-amber-gold); fill-opacity: .5; stroke: none; opacity: 0; transform-box: fill-box; transform-origin: center; }',
      '@keyframes mads-icon-glow { 0% { transform: scale(.1); opacity: 1; } 55% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }',
      '.mads-icon.is-glow .mads-icon-glow { animation: mads-icon-glow 1.6s cubic-bezier(.22, .61, .36, 1); }',
      cm('/* is-draw needs pathLength="1" on the <path> */'),
      '@media (prefers-reduced-motion: reduce) { .mads-icon, .mads-icon path, .mads-icon-glow { animation: none; } }'
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.icon — one stroked line on a 24 grid, stroke 3.5, round caps and joins.'),
      'public enum MadsIconName: CaseIterable {',
      '    case chevronUp, chevronDown, chevronLeft, chevronRight, home, settings, ideas',
      '',
      '    ' + cm('/// Points on the 24 × 24 grid'),
      '    var points: [CGPoint] {',
      '        switch self {',
      '        case .chevronUp:    [.init(x: 5, y: 14.5), .init(x: 12, y: 9.5), .init(x: 19, y: 14.5)]',
      '        case .chevronDown:  [.init(x: 5, y: 9.5), .init(x: 12, y: 14.5), .init(x: 19, y: 9.5)]',
      '        case .chevronLeft:  [.init(x: 14.5, y: 5), .init(x: 9.5, y: 12), .init(x: 14.5, y: 19)]',
      '        case .chevronRight: [.init(x: 9.5, y: 5), .init(x: 14.5, y: 12), .init(x: 9.5, y: 19)]',
      '        case .home:         [.init(x: 19, y: 19.5), .init(x: 19, y: 9.5), .init(x: 12, y: 4.5),',
      '                             .init(x: 5, y: 9.5), .init(x: 5, y: 19.5)]',
      '        case .settings:     []  ' + cm('// built with arcs in MadsIconShape.gear'),
      '        case .ideas:        []  ' + cm('// built with curves in MadsIconShape.bulb'),
      '        }',
      '    }',
      '    var closed: Bool { self == .home }',
      '}',
      '',
      'public struct MadsIconShape: Shape {',
      '    let name: MadsIconName',
      '    public func path(in rect: CGRect) -> Path {',
      '        let s = min(rect.width, rect.height) / 24',
      '        if name == .settings { return Self.gear(scale: s, origin: rect.origin) }',
      '        if name == .ideas { return Self.bulb(scale: s, origin: rect.origin) }',
      '        var p = Path()',
      '        p.addLines(name.points.map { CGPoint(x: rect.minX + $0.x * s, y: rect.minY + $0.y * s) })',
      '        if name.closed { p.closeSubpath() }',
      '        return p',
      '    }',
      '',
      '    ' + cm('/// mads.icon.settings: six teeth (tips r 7.5 at ±10.2°), body arcs r 5.6 (±19°), centre dot'),
      '    static func gear(scale s: CGFloat, origin o: CGPoint) -> Path {',
      '        func pt(_ r: CGFloat, _ deg: CGFloat) -> CGPoint {',
      '            let a = deg * .pi / 180',
      '            return CGPoint(x: o.x + (12 + r * sin(a)) * s, y: o.y + (12 - r * cos(a)) * s)',
      '        }',
      '        let c = CGPoint(x: o.x + 12 * s, y: o.y + 12 * s)',
      '        var p = Path()',
      '        for i in 0..<6 {',
      '            let t = CGFloat(i) * 60',
      '            if i == 0 { p.move(to: pt(7.5, t - 10.2)) } else { p.addLine(to: pt(7.5, t - 10.2)) }',
      '            p.addLine(to: pt(7.5, t + 10.2))',
      '            p.addLine(to: pt(5.6, t + 19))',
      '            p.addArc(center: c, radius: 5.6 * s, startAngle: .degrees(Double(t) - 71),',
      '                     endAngle: .degrees(Double(t) - 49), clockwise: false)',
      '        }',
      '        p.closeSubpath()',
      '        p.move(to: c); p.addLine(to: CGPoint(x: c.x + 0.01 * s, y: c.y))  ' + cm('// centre dot'),
      '        return p',
      '    }',
      '',
      '    ' + cm('/// mads.icon.ideas: bulb with a closed neck, then a base line'),
      '    static func bulb(scale s: CGFloat, origin o: CGPoint) -> Path {',
      '        func pt(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: o.x + x * s, y: o.y + y * s) }',
      '        var p = Path()',
      '        p.move(to: pt(12, 4.43))',
      '        p.addCurve(to: pt(7.24, 9.19), control1: pt(9.37, 4.43), control2: pt(7.24, 6.56))',
      '        p.addCurve(to: pt(9.59, 13.3), control1: pt(7.24, 10.88), control2: pt(8.13, 12.45))',
      '        p.addCurve(to: pt(9.58, 13.47), control1: pt(9.59, 13.36), control2: pt(9.58, 13.42))',
      '        p.addLine(to: pt(9.58, 14))',
      '        p.addCurve(to: pt(10.87, 15.29), control1: pt(9.58, 14.71), control2: pt(10.16, 15.29))',
      '        p.addLine(to: pt(13.12, 15.29))',
      '        p.addCurve(to: pt(14.41, 14), control1: pt(13.84, 15.29), control2: pt(14.41, 14.71))',
      '        p.addLine(to: pt(14.41, 13.47))',
      '        p.addCurve(to: pt(14.4, 13.3), control1: pt(14.41, 13.42), control2: pt(14.41, 13.36))',
      '        p.addCurve(to: pt(16.76, 9.19), control1: pt(15.86, 12.45), control2: pt(16.76, 10.88))',
      '        p.addCurve(to: pt(12, 4.43), control1: pt(16.76, 6.56), control2: pt(14.63, 4.43))',
      '        p.closeSubpath()',
      '        p.move(to: pt(10.2, 19.57)); p.addLine(to: pt(13.8, 19.57))  ' + cm('// base'),
      '        return p',
      '    }',
      '}',
      '',
      cm('/// MadsIcon(.home, size: 24).foregroundStyle(MadsColor.neonPink)'),
      'public struct MadsIcon: View {',
      '    let name: MadsIconName',
      '    var size: CGFloat = 24',
      '    public init(_ name: MadsIconName, size: CGFloat = 24) { self.name = name; self.size = size }',
      '    public var body: some View {',
      '        MadsIconShape(name: name)',
      '            .stroke(style: StrokeStyle(lineWidth: 3.5 * size / 24, lineCap: .round, lineJoin: .round))',
      '            .frame(width: size, height: size)',
      '            .accessibilityHidden(true)',
      '    }',
      '}',
      '',
      cm('// Draw on: MadsIconShape(name: .home).trim(from: 0, to: progress).stroke(…)'),
      '',
      cm('/// mads.icon.ideas default motion: a solid AmberGold circle at 50% alpha grows from the bulb centre, then fades out'),
      'public struct MadsIdeasIcon: View {',
      '    var size: CGFloat = 24',
      '    @Binding var trigger: Int',
      '    @State private var scale: CGFloat = 0.1',
      '    @State private var glow: Double = 0',
      '    public var body: some View {',
      '        ZStack {',
      '            Circle()',
      '                .fill(MadsColor.amberGold.opacity(0.5))',
      '                .frame(width: size * 20 / 24, height: size * 20 / 24)',
      '                .scaleEffect(scale).opacity(glow)',
      '                .offset(y: size * (9.19 - 12) / 24)',
      '            MadsIcon(.ideas, size: size)',
      '        }',
      '        .onChange(of: trigger) {',
      '            scale = 0.1; glow = 1',
      '            withAnimation(.timingCurve(0.22, 0.61, 0.36, 1, duration: 0.88)) { scale = 1 }',
      '            withAnimation(.easeOut(duration: 0.72).delay(0.88)) { glow = 0 }',
      '        }',
      '    }',
      '}'
    ],
    compose: [
      'import androidx.compose.ui.graphics.SolidColor',
      'import androidx.compose.ui.graphics.Color',
      'import androidx.compose.ui.graphics.StrokeCap',
      'import androidx.compose.ui.graphics.StrokeJoin',
      'import androidx.compose.ui.graphics.vector.ImageVector',
      'import androidx.compose.ui.graphics.vector.addPathNodes',
      'import androidx.compose.ui.unit.dp',
      '',
      cm('/** mads.icon — 24 grid, stroke 3.5. Tint with Icon(tint = MadsColor.neonPink). */'),
      'private fun madsIcon(name: String, pathData: String) = ImageVector.Builder(',
      '    name = name, defaultWidth = 24.dp, defaultHeight = 24.dp,',
      '    viewportWidth = 24f, viewportHeight = 24f',
      ').addPath(',
      '    pathData = addPathNodes(pathData),',
      '    stroke = SolidColor(Color.Black),',
      '    strokeLineWidth = 3.5f,',
      '    strokeLineCap = StrokeCap.Round,',
      '    strokeLineJoin = StrokeJoin.Round',
      ').build()',
      '',
      'object MadsIcons {',
      ...ICONS.map(i => `    val ${camel(i.token).padEnd(12)} = madsIcon("${i.token}", "${i.d}")`),
      '}',
      '',
      cm('// Icon(MadsIcons.home, contentDescription = null, tint = MadsColor.dark)'),
      '',
      cm('/** mads.icon.ideas default motion: a solid AmberGold circle at 50% alpha grows from the bulb centre, then fades out */'),
      '@Composable',
      'fun MadsIdeasIcon(trigger: Int, size: Dp = 24.dp, tint: Color = MadsColor.dark) {',
      '    val scale = remember { Animatable(0.1f) }',
      '    val glow = remember { Animatable(0f) }',
      '    LaunchedEffect(trigger) {',
      '        if (trigger == 0) return@LaunchedEffect',
      '        scale.snapTo(0.1f); glow.snapTo(1f)',
      '        scale.animateTo(1f, tween(880, easing = CubicBezierEasing(0.22f, 0.61f, 0.36f, 1f)))',
      '        glow.animateTo(0f, tween(720))',
      '    }',
      '    Box(Modifier.size(size).drawBehind {',
      '        val u = this.size.minDimension / 24f',
      '        val c = Offset(12f * u, 9.19f * u)',
      '        val r = 10f * u * scale.value',
      '        drawCircle(MadsColor.amberGold.copy(alpha = .5f), radius = r, center = c, alpha = glow.value)',
      '    }) { Icon(MadsIcons.ideas, contentDescription = null, tint = tint) }',
      '}'
    ],
    xml: [
      ...ICONS.flatMap(i => [
        cm(`<!-- res/drawable/${snake(i.token)}.xml — ${i.token} -->`),
        esc('<vector xmlns:android="http://schemas.android.com/apk/res/android"'),
        esc('    android:width="24dp" android:height="24dp"'),
        esc('    android:viewportWidth="24" android:viewportHeight="24">'),
        esc('    <path'),
        esc(`        android:pathData="${i.d}"`),
        esc('        android:strokeColor="#FF000000"'),
        esc('        android:strokeWidth="3.5"'),
        esc('        android:strokeLineCap="round"'),
        esc('        android:strokeLineJoin="round" />'),
        esc('</vector>'),
        ''
      ]),
      cm('<!-- Colour it with app:tint="@color/mads_color_neon_pink" on the ImageView -->')
    ]
  };
  Object.entries(code).forEach(([k, lines]) => {
    const el = document.querySelector(`#icon-code-${k} code`);
    if (el) el.innerHTML = lines.join('\n');
  });
})();

/* ===== mads.button — platform code ===== */
(() => {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cm = s => `<span class="dsd-cm">${esc(s)}</span>`;
  const code = {
    css: [
      cm('/* mads.button.primary — needs the mads.color, mads.text and mads.space tokens */'),
      cm('<!-- Astro (the @maadan/mads package) -->'),
      esc("import Button from '@maadan/mads/components/Button.astro';"),
      esc('<Button href="#story" icon="chevron-down">Lorem ipsum</Button>'),
      esc('<Button disabled>Lorem ipsum</Button>'),
      '',
      ':root {',
      '  --mads-button-primary-background: linear-gradient(90deg, var(--mads-color-blaze-orange), var(--mads-color-neon-pink));',
      '  --mads-button-primary-text: var(--mads-color-white);',
      '  --mads-button-primary-font: var(--mads-text-large);',
      '  --mads-button-primary-radius: 999px;            ' + cm('/* pill */'),
      '  --mads-button-primary-padding-y: 0.75rem;       ' + cm('/* 12px */'),
      '  --mads-button-primary-padding-x: 1.5rem;        ' + cm('/* 24px */'),
      '  --mads-button-primary-gap: var(--mads-space-2); ' + cm('/*  8px */'),
      '  --mads-button-primary-min-height: 2.75rem;      ' + cm('/* 44px */'),
      '}',
      '',
      '.mads-button {',
      '  display: inline-flex; align-items: center; justify-content: center;',
      '  gap: var(--mads-button-primary-gap);',
      '  min-height: var(--mads-button-primary-min-height);',
      '  padding: var(--mads-button-primary-padding-y) var(--mads-button-primary-padding-x);',
      '  border: 0;',
      '  border-radius: var(--mads-button-primary-radius);',
      '  font: var(--mads-button-primary-font);',
      '  color: var(--mads-button-primary-text);',
      '  ' + cm('/* Twice as wide, so hover can shift it slightly towards pink */'),
      '  background-image: linear-gradient(90deg, var(--mads-color-blaze-orange) 0%,',
      '    var(--mads-color-neon-pink) 50%, var(--mads-color-blaze-orange) 100%);',
      '  background-size: 200% 100%;',
      '  background-position: 0% 0;',
      '  cursor: pointer;',
      '  transition: background-position .6s cubic-bezier(.2, .7, .2, 1),',
      '              transform .2s cubic-bezier(.2, .7, .2, 1),',
      '              box-shadow .3s cubic-bezier(.2, .7, .2, 1);',
      '}',
      '.mads-button svg { width: 1em; height: 1em; transition: transform .3s cubic-bezier(.2, .7, .2, 1); }',
      '.mads-button:hover { background-position: 30% 0;',
      '  box-shadow: 0 4px 12px -6px rgb(255 0 110 / .35); }',
      '.mads-button:hover svg { transform: translateY(1px); }',
      '.mads-button:active { transform: scale(.98); box-shadow: none; }',
      '.mads-button:focus-visible { outline: 2px solid var(--mads-color-neon-pink); outline-offset: 3px; }',
      '.mads-button:disabled { opacity: .4; cursor: not-allowed; transform: none; box-shadow: none; }',
      '@media (prefers-reduced-motion: reduce) { .mads-button, .mads-button svg { transition: none; } }',
      '',
      cm('<!-- <button class="mads-button">Lorem ipsum</button> -->')
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.button.primary — pill, BlazeOrange → NeonPink, White text, no border.'),
      cm('/// Uses MadsColor, MadsText (.madsText) and MadsSpace.'),
      'public struct MadsPrimaryButtonStyle: ButtonStyle {',
      '    @Environment(\\.isEnabled) private var isEnabled',
      '',
      '    public init() {}',
      '',
      '    public func makeBody(configuration: Configuration) -> some View {',
      '        configuration.label',
      '            .madsText(.large)',
      '            .foregroundStyle(MadsColor.white)',
      '            .padding(.vertical, 12)',
      '            .padding(.horizontal, 24)',
      '            .frame(minHeight: 44)',
      '            .background(',
      '                LinearGradient(colors: [MadsColor.blazeOrange, MadsColor.neonPink],',
      '                               startPoint: .leading, endPoint: .trailing),',
      '                in: Capsule()',
      '            )',
      '            .contentShape(Capsule())',
      '            .scaleEffect(configuration.isPressed ? 0.98 : 1)',
      '            .opacity(isEnabled ? 1 : 0.4)',
      '            .animation(.spring(response: 0.25, dampingFraction: 0.7), value: configuration.isPressed)',
      '    }',
      '}',
      '',
      'public extension ButtonStyle where Self == MadsPrimaryButtonStyle {',
      '    static var madsPrimary: MadsPrimaryButtonStyle { .init() }',
      '}',
      '',
      cm('// Button("Lorem ipsum") { }'),
      cm('//     .buttonStyle(.madsPrimary)')
    ],
    compose: [
      'import androidx.compose.animation.core.animateFloatAsState',
      'import androidx.compose.foundation.background',
      'import androidx.compose.foundation.clickable',
      'import androidx.compose.foundation.interaction.MutableInteractionSource',
      'import androidx.compose.foundation.interaction.collectIsPressedAsState',
      'import androidx.compose.foundation.layout.*',
      'import androidx.compose.foundation.shape.CircleShape',
      'import androidx.compose.material3.Text',
      'import androidx.compose.material3.ripple',
      'import androidx.compose.runtime.*',
      'import androidx.compose.ui.Alignment',
      'import androidx.compose.ui.Modifier',
      'import androidx.compose.ui.draw.clip',
      'import androidx.compose.ui.graphics.Brush',
      'import androidx.compose.ui.graphics.graphicsLayer',
      'import androidx.compose.ui.semantics.Role',
      'import androidx.compose.ui.unit.dp',
      '',
      cm('/** mads.button.primary — pill, BlazeOrange → NeonPink, White text, no border. */'),
      '@Composable',
      'fun MadsButton(',
      '    text: String,',
      '    onClick: () -> Unit,',
      '    modifier: Modifier = Modifier,',
      '    enabled: Boolean = true,',
      '    trailingIcon: (@Composable () -> Unit)? = null',
      ') {',
      '    val interaction = remember { MutableInteractionSource() }',
      '    val pressed by interaction.collectIsPressedAsState()',
      '    val scale by animateFloatAsState(if (pressed) 0.98f else 1f, label = "mads-button-press")',
      '',
      '    Row(',
      '        modifier = modifier',
      '            .graphicsLayer { scaleX = scale; scaleY = scale; alpha = if (enabled) 1f else 0.4f }',
      '            .clip(CircleShape)',
      '            .background(Brush.horizontalGradient(listOf(MadsColor.blazeOrange, MadsColor.neonPink)))',
      '            .clickable(',
      '                interactionSource = interaction,',
      '                indication = ripple(color = MadsColor.white),',
      '                enabled = enabled,',
      '                role = Role.Button,',
      '                onClick = onClick',
      '            )',
      '            .defaultMinSize(minHeight = 44.dp)',
      '            .padding(horizontal = 24.dp, vertical = 12.dp),',
      '        verticalAlignment = Alignment.CenterVertically,',
      '        horizontalArrangement = Arrangement.spacedBy(MadsSpace.s2)',
      '    ) {',
      '        Text(text, style = MadsText.large, color = MadsColor.white)',
      '        trailingIcon?.invoke()',
      '    }',
      '}',
      '',
      cm('// MadsButton("Lorem ipsum", onClick = { })')
    ],
    xml: [
      cm('<!-- res/drawable/mads_button_primary_bg.xml -->'),
      esc('<ripple xmlns:android="http://schemas.android.com/apk/res/android"'),
      esc('    android:color="#33FFFFFF">'),
      esc('    <item>'),
      esc('        <shape android:shape="rectangle">'),
      esc('            <corners android:radius="999dp" />'),
      esc('            <gradient'),
      esc('                android:angle="0"'),
      esc('                android:startColor="@color/mads_color_blaze_orange"'),
      esc('                android:endColor="@color/mads_color_neon_pink" />'),
      esc('        </shape>'),
      esc('    </item>'),
      esc('</ripple>'),
      '',
      cm('<!-- res/values/mads_button.xml -->'),
      esc('<resources>'),
      esc('    <style name="Widget.Mads.Button.Primary" parent="">'),
      esc('        <item name="android:background">@drawable/mads_button_primary_bg</item>'),
      esc('        <item name="android:textAppearance">@style/TextAppearance.Mads.Large</item>'),
      esc('        <item name="android:textColor">@color/mads_color_white</item>'),
      esc('        <item name="android:textAllCaps">false</item>'),
      esc('        <item name="android:minHeight">44dp</item>'),
      esc('        <item name="android:paddingStart">24dp</item>'),
      esc('        <item name="android:paddingEnd">24dp</item>'),
      esc('        <item name="android:paddingTop">12dp</item>'),
      esc('        <item name="android:paddingBottom">12dp</item>'),
      esc('        <item name="android:drawablePadding">8dp</item>'),
      esc('        <item name="android:stateListAnimator">@null</item>'),
      esc('    </style>'),
      esc('</resources>'),
      '',
      cm('<!-- Use with androidx.appcompat.widget.AppCompatButton; MaterialButton replaces'),
      cm('     the background. Add an end icon with android:drawableEnd. -->')
    ]
  };
  Object.entries(code).forEach(([k, lines]) => {
    const el = document.querySelector(`#button-code-${k} code`);
    if (el) el.innerHTML = lines.join('\n');
  });
})();

/* ===== mads.color — swatches, contrast, table and platform code ===== */
(() => {
  const COLORS = [
    { key: 'dark',         name: 'Dark',        hex: '17122B', group: 'neutrals' },
    { key: 'dark-1',       name: 'Dark 1',      hex: '544D74', group: 'neutrals' },
    { key: 'light',        name: 'Light',       hex: '757575', group: 'neutrals' },
    { key: 'white',        name: 'White',       hex: 'FFFFFF', group: 'neutrals' },
    { key: 'amber-gold',   name: 'AmberGold',   hex: 'FFBE0B', group: 'accents' },
    { key: 'blaze-orange', name: 'BlazeOrange', hex: 'FB5607', group: 'accents' },
    { key: 'neon-pink',    name: 'NeonPink',    hex: 'FF006E', group: 'accents' },
    { key: 'blue-violet',  name: 'BlueViolet',  hex: '8338EC', group: 'accents' },
    { key: 'azure-blue',   name: 'AzureBlue',   hex: '3A86FF', group: 'accents' }
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cm = s => `<span class="dsd-cm">${esc(s)}</span>`;
  const rgb = h => [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  const lum = h => {
    const [r, g, b] = rgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const grade = r => r >= 4.5 ? ['AA', 'is-aa'] : r >= 3 ? ['Large', 'is-large'] : ['Fail', 'is-fail'];
  const camel = k => k.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  const snake = k => k.replace(/-/g, '_');
  const WHITE = 'FFFFFF', DARK = '17122B';

  const card = c => {
    const w = ratio(c.hex, WHITE), d = ratio(c.hex, DARK);
    const on = c.key === 'dark' ? WHITE : (w >= d ? WHITE : DARK);
    const row = (label, dot, r) => {
      const [g, cls] = grade(r);
      return `<li><span class="dsd-contrast-dot" style="background:#${dot}"></span>${label} ${r.toFixed(2)}:1<b class="${cls}">${g}</b></li>`;
    };
    return `
      <button type="button" class="dsd-swatch" style="--c:#${c.hex}; --on:#${on}" data-hex="#${c.hex}"
              aria-label="${c.name}, #${c.hex}. Copy hex value">
        <span class="dsd-swatch-chip"><span class="dsd-swatch-aa" aria-hidden="true">Aa</span><span class="dsd-swatch-copied">Copied</span></span>
        <span class="dsd-swatch-info">
          <span class="dsd-swatch-name"><strong>${c.name}</strong><span class="dsd-val">#${c.hex}</span></span>
          <span class="dsd-tok">mads.color.${c.key}</span>
          <ul class="dsd-contrast">
            ${c.hex === DARK ? '' : row('Dark text', DARK, d)}
            ${c.hex === WHITE ? '' : row('White text', WHITE, w)}
          </ul>
        </span>
      </button>`;
  };

  const neutrals = document.getElementById('color-neutrals');
  const accents = document.getElementById('color-accents');
  const rows = document.getElementById('color-rows');
  if (!neutrals || !accents || !rows) return;
  neutrals.innerHTML = COLORS.filter(c => c.group === 'neutrals').map(card).join('');
  accents.innerHTML = COLORS.filter(c => c.group === 'accents').map(card).join('');

  document.querySelectorAll('.dsd-swatch').forEach(sw => sw.addEventListener('click', () => {
    const done = () => { sw.classList.add('is-copied'); setTimeout(() => sw.classList.remove('is-copied'), 1400); };
    try { navigator.clipboard.writeText(sw.dataset.hex).then(done, done); } catch (e) { done(); }
  }));

  rows.innerHTML = COLORS.map(c => `
    <tr>
      <td><span class="dsd-dot" style="--c:#${c.hex}"></span><span class="dsd-tok">mads.color.${c.key}</span><span class="dsd-sub">${c.name}</span></td>
      <td><span class="dsd-val">#${c.hex}</span></td>
      <td><span class="dsd-val">${rgb(c.hex).join(', ')}</span></td>
      <td><span class="dsd-val">--mads-color-${c.key}</span></td>
      <td><span class="dsd-val">MadsColor.${camel(c.key)}</span></td>
      <td><span class="dsd-val">MadsColor.${camel(c.key)}</span><span class="dsd-sub">@color/mads_color_${snake(c.key)}</span></td>
    </tr>`).join('');

  const pad = (s, n) => s.padEnd(n);
  const code = {
    css: [
      cm('/* mads.color — sRGB hex */'),
      ':root {',
      ...COLORS.map(c => pad(`  --mads-color-${c.key}: #${c.hex};`, 38) + cm(`/* ${c.name} */`)),
      '}'
    ],
    swift: [
      'import SwiftUI',
      '',
      cm('/// mads.color — sRGB'),
      'public enum MadsColor {',
      ...COLORS.map(c => `    public static let ${pad(camel(c.key), 11)} = Color(hex: 0x${c.hex})`),
      '}',
      '',
      'extension Color {',
      '    init(hex: UInt32) {',
      '        self.init(.sRGB,',
      '                  red: Double((hex >> 16) & 0xFF) / 255,',
      '                  green: Double((hex >> 8) & 0xFF) / 255,',
      '                  blue: Double(hex & 0xFF) / 255)',
      '    }',
      '}'
    ],
    compose: [
      'import androidx.compose.ui.graphics.Color',
      '',
      cm('/** mads.color — sRGB, fully opaque (0xFF alpha) */'),
      'object MadsColor {',
      ...COLORS.map(c => `    val ${pad(camel(c.key), 11)} = Color(0xFF${c.hex})`),
      '}'
    ],
    xml: [
      cm('<!-- res/values/mads_colors.xml — mads.color -->'),
      esc('<resources>'),
      ...COLORS.map(c => esc(`    <color name="mads_color_${snake(c.key)}">#${c.hex}</color>`)),
      esc('</resources>')
    ]
  };
  Object.entries(code).forEach(([k, lines]) => {
    const el = document.querySelector(`#color-code-${k} code`);
    if (el) el.innerHTML = lines.join('\n');
  });
})();

/* ===== mads.label — specimens, table and platform code ===== */
(() => {
  const L = [
    { name: 'default', size: 15, lh: 20, apple: 'subheadline', sample: 'Foundations' },
    { name: 'small',   size: 13, lh: 16, apple: 'footnote',    sample: 'Updated 4 October 2026' },
    { name: 'xsmall',  size: 11, lh: 16, apple: 'caption2',    sample: 'New' }
  ];
  const rem = px => `${px / 16}rem`;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cm = s => `<span class="dsd-cm">${esc(s)}</span>`;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const sw = n => n === 'default' ? '`default`' : n;

  const box = document.getElementById('label-specimens');
  const rows = document.getElementById('label-rows');
  if (!box || !rows) return;

  box.innerHTML = L.map(t => `
    <div class="dsd-text-row">
      <div class="dsd-text-meta">
        <span class="dsd-tok">mads.label.${t.name}</span>
        <span class="dsd-val">${t.size} / ${t.lh}</span>
      </div>
      <p class="dsd-text-sample dsd-label-sample" contenteditable="true" spellcheck="false" id="label-sample-${t.name}"
         aria-label="mads.label.${t.name} sample, editable"
         style="font: var(--mads-label-${t.name}); --lh: var(--mads-label-${t.name}-line-height)">${esc(t.sample)}</p>
    </div>`).join('');

  rows.innerHTML = L.map(t => `
    <tr>
      <td><span class="dsd-tok">mads.label.${t.name}</span><span class="dsd-sub">.mads-label-${t.name}</span></td>
      <td><span class="dsd-val">${t.size} / ${t.lh}</span></td>
      <td><span class="dsd-val">${rem(t.size)} / ${rem(t.lh)}</span><span class="dsd-sub">--mads-label-${t.name}</span></td>
      <td><span class="dsd-val">${t.size}pt / ${t.lh}pt</span><span class="dsd-sub">.madsLabel(.${t.name}) · scales with .${t.apple}</span></td>
      <td><span class="dsd-val">${t.size}sp / ${t.lh}sp</span><span class="dsd-sub">MadsLabel.${t.name} · TextAppearance.Mads.Label.${cap(t.name)}</span></td>
    </tr>`).join('');

  const toggle = document.getElementById('label-grid-toggle');
  if (toggle) toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', on);
    box.classList.toggle('show-grid', on);
  });

  const asc = [...L].reverse();
  const code = {
    css: [
      cm('/* mads.label — JetBrains Mono, always bold and in capitals. Font size / line height, 1rem = 16px */'),
      ':root {',
      '  --mads-label-weight: 700;',
      ...asc.flatMap(t => [
        `  --mads-label-${t.name}-size: ${rem(t.size)};`.padEnd(46) + cm(`/* ${t.size}px */`),
        `  --mads-label-${t.name}-line-height: ${rem(t.lh)};`.padEnd(46) + cm(`/* ${t.lh}px */`)
      ]),
      '',
      '  ' + cm('/* Shorthands: font: var(--mads-label-default) */'),
      ...asc.map(t => `  --mads-label-${t.name}: var(--mads-label-weight) var(--mads-label-${t.name}-size)/var(--mads-label-${t.name}-line-height) var(--mads-font-mono);`),
      '}',
      '',
      cm('/* Write labels in normal case; the class sets the capitals */'),
      ...asc.map(t => `.mads-label-${t.name} { font: var(--mads-label-${t.name}); text-transform: uppercase; }`)
    ],
    swift: [
      'import SwiftUI',
      'import UIKit',
      '',
      cm('/// mads.label — JetBrains Mono, always bold and in capitals. Size and line height in pt.'),
      'public enum MadsLabel: CaseIterable {',
      '    case xsmall, small, `default`',
      '',
      '    public var size: CGFloat {',
      '        switch self {',
      ...asc.map(t => `        case .${sw(t.name)}: ${t.size}`),
      '        }',
      '    }',
      '',
      '    public var lineHeight: CGFloat {',
      '        switch self {',
      ...asc.map(t => `        case .${sw(t.name)}: ${t.lh}`),
      '        }',
      '    }',
      '',
      '    public var appleStyle: Font.TextStyle {',
      '        switch self {',
      ...asc.map(t => `        case .${sw(t.name)}: .${t.apple}`),
      '        }',
      '    }',
      '}',
      '',
      'public extension View {',
      '    ' + cm('/// .madsLabel(.default)'),
      '    func madsLabel(_ style: MadsLabel) -> some View {',
      '        modifier(MadsLabelModifier(style: style))',
      '    }',
      '}',
      '',
      'private struct MadsLabelModifier: ViewModifier {',
      '    let style: MadsLabel',
      '    @ScaledMetric private var scale: CGFloat = 1',
      '',
      '    func body(content: Content) -> some View {',
      '        let size = style.size * scale',
      '        let natural = (UIFont(name: "JetBrainsMono-Bold", size: size)',
      '            ?? .monospacedSystemFont(ofSize: size, weight: .bold)).lineHeight',
      '        let extra = max(0, style.lineHeight * scale - natural)',
      '        return content',
      '            .font(MadsFont.mono(style.size, weight: .bold, relativeTo: style.appleStyle))',
      '            .textCase(.uppercase)',
      '            .lineSpacing(extra)',
      '            .padding(.vertical, extra / 2)',
      '    }',
      '}',
      '',
      cm('// Text("Foundations").madsLabel(.default)')
    ],
    compose: [
      'import androidx.compose.ui.text.TextStyle',
      'import androidx.compose.ui.text.font.FontWeight',
      'import androidx.compose.ui.text.style.LineHeightStyle',
      'import androidx.compose.ui.unit.sp',
      '',
      'import androidx.compose.material3.Text',
      'import androidx.compose.runtime.Composable',
      'import androidx.compose.ui.Modifier',
      'import androidx.compose.ui.semantics.contentDescription',
      'import androidx.compose.ui.semantics.semantics',
      '',
      cm('/** mads.label — JetBrains Mono, always bold. Size and line height in sp. Uses MadsFont. */'),
      'private fun madsLabel(size: Int, lineHeight: Int) = TextStyle(',
      '    fontFamily = MadsFont.mono,',
      '    fontWeight = FontWeight.Bold,',
      '    fontSize = size.sp,',
      '    lineHeight = lineHeight.sp,',
      '    lineHeightStyle = LineHeightStyle(',
      '        alignment = LineHeightStyle.Alignment.Center,',
      '        trim = LineHeightStyle.Trim.None',
      '    )',
      ')',
      '',
      'object MadsLabel {',
      ...asc.map(t => `    val ${t.name} = madsLabel(${t.size}, ${t.lh})`),
      '}',
      '',
      cm('/** Labels are always capitals. TextStyle has no text case, so use this. */'),
      '@Composable',
      'fun MadsLabelText(text: String, style: TextStyle = MadsLabel.default, modifier: Modifier = Modifier) =',
      '    Text(text.uppercase(), style = style, modifier = modifier.semantics { contentDescription = text })',
      '',
      cm('// MadsLabelText("Foundations")')
    ],
    xml: [
      cm('<!-- res/values/mads_label.xml — mads.label. android:lineHeight needs API 28+ -->'),
      esc('<resources>'),
      ...asc.flatMap(t => [
        esc(`    <style name="TextAppearance.Mads.Label.${cap(t.name)}" parent="">`),
        esc(`        <item name="android:fontFamily">@font/mads_mono</item>`),
        esc(`        <item name="android:textSize">${t.size}sp</item>`),
        esc(`        <item name="android:lineHeight">${t.lh}sp</item>`),
        esc(`        <item name="android:textStyle">bold</item>`),
        esc(`        <item name="android:textAllCaps">true</item>`),
        esc('    </style>')
      ]),
      esc('</resources>'),
      '',
      cm('<!-- Use: android:textAppearance="@style/TextAppearance.Mads.Label.Default" -->')
    ]
  };
  Object.entries(code).forEach(([k, lines]) => {
    const el = document.querySelector(`#label-code-${k} code`);
    if (el) el.innerHTML = lines.join('\n');
  });
})();

/* ===== mads.heading — specimens, table and platform code ===== */
(() => {
  const H = [
    { name: 'hero',    size: 46, max: 120, lh: .95, html: 'h1', apple: 'largeTitle', sample: 'MADS', fluid: true },
    { name: 'xxlarge', size: 35, lh: 36, html: 'h1', apple: 'largeTitle', sample: 'MA Design System' },
    { name: 'xlarge',  size: 27, lh: 36, html: 'h2', apple: 'title',      sample: 'Spacing on an 8px grid' },
    { name: 'large',   size: 23, lh: 32, html: 'h3', apple: 'title2',     sample: 'Fonts and fallbacks' },
    { name: 'default', size: 21, lh: 28, html: 'h4', apple: 'title3',     sample: 'Text sizes for every platform' },
    { name: 'small',   size: 17, lh: 24, html: 'h5', apple: 'headline',   sample: 'Line height and scaling' },
    { name: 'xsmall',  size: 15, lh: 24, html: 'h6', apple: 'subheadline', sample: 'Code for web, iOS and Android' }
  ];
  const rem = px => `${px / 16}rem`;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cm = s => `<span class="dsd-cm">${esc(s)}</span>`;
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const sw = n => n === 'default' ? '`default`' : n;

  const box = document.getElementById('heading-specimens');
  const rows = document.getElementById('heading-rows');
  if (!box || !rows) return;

  box.innerHTML = H.map(t => `
    <div class="dsd-text-row">
      <div class="dsd-text-meta">
        <span class="dsd-tok">mads.heading.${t.name}</span>
        <span class="dsd-val">${t.fluid ? `${t.size}–${t.max} / ×${t.lh}` : `${t.size} / ${t.lh}`}</span>${t.fluid ? '<span class="dsd-sub">8.4% of the screen width · 800 · −0.03em</span>' : ''}
      </div>
      <p class="dsd-text-sample dsd-heading-sample${t.fluid ? ' mads-heading-hero' : ''}" contenteditable="true" spellcheck="false" id="heading-sample-${t.name}"
         aria-label="mads.heading.${t.name} sample, editable"
         style="${t.fluid ? '--lh: calc(var(--mads-heading-hero-size) * .95)' : `font: var(--mads-heading-${t.name}); --lh: var(--mads-heading-${t.name}-line-height)`}">${esc(t.sample)}</p>
    </div>`).join('');

  rows.innerHTML = H.map(t => t.fluid ? `
    <tr>
      <td><span class="dsd-tok">mads.heading.hero</span><span class="dsd-sub">.mads-heading-hero</span></td>
      <td><span class="dsd-val">46–120 / ×0.95</span><span class="dsd-sub">800 · −0.03em</span></td>
      <td><span class="dsd-val">h1</span></td>
      <td><span class="dsd-val">clamp(2.875rem, 8.4vw, 7.5rem)</span><span class="dsd-sub">--mads-heading-hero</span></td>
      <td><span class="dsd-val">46–120pt</span><span class="dsd-sub">.madsHero(width:) · 8.4% of the width</span></td>
      <td><span class="dsd-val">46–120sp</span><span class="dsd-sub">madsHeroStyle() · TextAppearance.Mads.Heading.Hero</span></td>
    </tr>` : `
    <tr>
      <td><span class="dsd-tok">mads.heading.${t.name}</span><span class="dsd-sub">.mads-heading-${t.name}</span></td>
      <td><span class="dsd-val">${t.size} / ${t.lh}</span></td>
      <td><span class="dsd-val">${t.html}</span></td>
      <td><span class="dsd-val">${rem(t.size)} / ${rem(t.lh)}</span><span class="dsd-sub">--mads-heading-${t.name}</span></td>
      <td><span class="dsd-val">${t.size}pt / ${t.lh}pt</span><span class="dsd-sub">.madsHeading(.${t.name}) · scales with .${t.apple}</span></td>
      <td><span class="dsd-val">${t.size}sp / ${t.lh}sp</span><span class="dsd-sub">MadsHeading.${t.name} · TextAppearance.Mads.Heading.${cap(t.name)}</span></td>
    </tr>`).join('');

  const toggle = document.getElementById('heading-grid-toggle');
  if (toggle) toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', on);
    box.classList.toggle('show-grid', on);
  });

  const asc = [...H].reverse().filter(t => !t.fluid);
  const code = {
    css: [
      cm('/* mads.heading — Unbounded, bold. Font size / line height, 1rem = 16px */'),
      ':root {',
      '  --mads-heading-weight: 700;',
      ...asc.flatMap(t => [
        `  --mads-heading-${t.name}-size: ${rem(t.size)};`.padEnd(50) + cm(`/* ${t.size}px */`),
        `  --mads-heading-${t.name}-line-height: ${rem(t.lh)};`.padEnd(50) + cm(`/* ${t.lh}px */`)
      ]),
      '',
      '  ' + cm('/* Shorthands: font: var(--mads-heading-default) */'),
      ...asc.map(t => `  --mads-heading-${t.name}: var(--mads-heading-weight) var(--mads-heading-${t.name}-size)/var(--mads-heading-${t.name}-line-height) var(--mads-font-display);`),
      '',
      '  ' + cm('/* hero: responsive, 46px on phones up to 120px on wide screens */'),
      '  --mads-heading-hero-size: clamp(2.875rem, 8.4vw, 7.5rem);',
      '  --mads-heading-hero-line-height: .95;',
      '  --mads-heading-hero-weight: 800;',
      '  --mads-heading-hero-tracking: -.03em;',
      '  --mads-heading-hero: var(--mads-heading-hero-weight) var(--mads-heading-hero-size)/var(--mads-heading-hero-line-height) var(--mads-font-display);',
      '}',
      '',
      ...asc.map(t => `.mads-heading-${t.name} { font: var(--mads-heading-${t.name}); }`),
      cm('/* Tracking is not part of the font shorthand, so hero sets it separately */'),
      '.mads-heading-hero { font: var(--mads-heading-hero); letter-spacing: var(--mads-heading-hero-tracking); }',
      '',
      cm('/* Suggested defaults for HTML headings. Use <h1 class="mads-heading-hero"> once, on a landing page */'),
      ...asc.slice().reverse().map(t => `${t.html} { font: var(--mads-heading-${t.name}); }`)
    ],
    swift: [
      'import SwiftUI',
      'import UIKit',
      '',
      cm('/// mads.heading — Unbounded, bold. Size and line height in pt. Uses MadsFont.'),
      'public enum MadsHeading: CaseIterable {',
      '    case xsmall, small, `default`, large, xlarge, xxlarge',
      '',
      '    public var size: CGFloat {',
      '        switch self {',
      ...asc.map(t => `        case .${sw(t.name)}: ${t.size}`),
      '        }',
      '    }',
      '',
      '    public var lineHeight: CGFloat {',
      '        switch self {',
      ...asc.map(t => `        case .${sw(t.name)}: ${t.lh}`),
      '        }',
      '    }',
      '',
      '    public var appleStyle: Font.TextStyle {',
      '        switch self {',
      ...asc.map(t => `        case .${sw(t.name)}: .${t.apple}`),
      '        }',
      '    }',
      '}',
      '',
      'public extension View {',
      '    ' + cm('/// .madsHeading(.default)'),
      '    func madsHeading(_ style: MadsHeading) -> some View {',
      '        modifier(MadsHeadingModifier(style: style))',
      '    }',
      '}',
      '',
      'private struct MadsHeadingModifier: ViewModifier {',
      '    let style: MadsHeading',
      '    @ScaledMetric private var scale: CGFloat = 1',
      '',
      '    func body(content: Content) -> some View {',
      '        let size = style.size * scale',
      '        let natural = (UIFont(name: "Unbounded-Bold", size: size) ?? .systemFont(ofSize: size, weight: .bold)).lineHeight',
      '        let extra = max(0, style.lineHeight * scale - natural)',
      '        return content',
      '            .font(MadsFont.display(style.size, weight: .bold, relativeTo: style.appleStyle))',
      '            .lineSpacing(extra)',
      '            .padding(.vertical, extra / 2)',
      '            .accessibilityAddTraits(.isHeader)',
      '    }',
      '}',
      '',
      cm('// Text("Spacing on an 8px grid").madsHeading(.xlarge)'),
      '',
      cm('/// mads.heading.hero — 8.4% of the available width, between 46 and 120pt,'),
      cm('/// ExtraBold, line height 0.95, tracking −0.03em. Pass the screen or container width.'),
      'public extension View {',
      '    func madsHero(width: CGFloat) -> some View {',
      '        let size = min(max(width * 0.084, 46), 120)',
      '        return self',
      '            .font(MadsFont.display(size, weight: .heavy, relativeTo: .largeTitle))',
      '            .tracking(-0.03 * size)',
      '            .lineSpacing(0)  ' + cm('// SwiftUI cannot go below the font’s natural line height'),
      '            .accessibilityAddTraits(.isHeader)',
      '    }',
      '}',
      '',
      cm('// GeometryReader { g in Text("MADS").madsHero(width: g.size.width) }')
    ],
    compose: [
      'import androidx.compose.ui.text.TextStyle',
      'import androidx.compose.ui.text.font.FontWeight',
      'import androidx.compose.ui.text.style.LineHeightStyle',
      'import androidx.compose.ui.unit.sp',
      '',
      cm('/** mads.heading — Unbounded, bold. Size and line height in sp. Uses MadsFont. */'),
      'private fun madsHeading(size: Int, lineHeight: Int) = TextStyle(',
      '    fontFamily = MadsFont.display,',
      '    fontWeight = FontWeight.Bold,',
      '    fontSize = size.sp,',
      '    lineHeight = lineHeight.sp,',
      '    lineHeightStyle = LineHeightStyle(',
      '        alignment = LineHeightStyle.Alignment.Center,',
      '        trim = LineHeightStyle.Trim.None',
      '    )',
      ')',
      '',
      'object MadsHeading {',
      ...asc.map(t => `    val ${t.name} = madsHeading(${t.size}, ${t.lh})`),
      '}',
      '',
      cm('// Text("Spacing on an 8px grid", style = MadsHeading.xlarge,'),
      cm('//      modifier = Modifier.semantics { heading() })'),
      '',
      cm('/** mads.heading.hero — 8.4% of the screen width, between 46 and 120sp */'),
      '@Composable',
      'fun madsHeroStyle(): TextStyle {',
      '    val width = LocalConfiguration.current.screenWidthDp',
      '    val size = (width * 0.084f).coerceIn(46f, 120f)',
      '    return TextStyle(',
      '        fontFamily = MadsFont.display,',
      '        fontWeight = FontWeight.ExtraBold,',
      '        fontSize = size.sp,',
      '        lineHeight = 0.95.em,',
      '        letterSpacing = (-0.03).em',
      '    )',
      '}'
    ],
    xml: [
      cm('<!-- res/values/mads_heading.xml — mads.heading. android:lineHeight needs API 28+ -->'),
      esc('<resources>'),
      ...asc.flatMap(t => [
        esc(`    <style name="TextAppearance.Mads.Heading.${cap(t.name)}" parent="">`),
        esc(`        <item name="android:fontFamily">@font/mads_display</item>`),
        esc(`        <item name="android:textStyle">bold</item>`),
        esc(`        <item name="android:textSize">${t.size}sp</item>`),
        esc(`        <item name="android:lineHeight">${t.lh}sp</item>`),
        esc('    </style>')
      ]),
      esc('    <style name="TextAppearance.Mads.Heading.Hero" parent="">'),
      esc('        <item name="android:fontFamily">@font/mads_display</item>'),
      esc('        <item name="android:textFontWeight">800</item>'),
      esc('        <item name="android:textSize">@dimen/mads_heading_hero_size</item>'),
      esc('        <item name="android:letterSpacing">-0.03</item>'),
      esc('        <item name="android:lineSpacingMultiplier">0.95</item>'),
      esc('    </style>'),
      esc('</resources>'),
      '',
      cm('<!-- Hero size by screen width: 8.4% of the width, between 46 and 120 -->'),
      cm('<!-- res/values/dimens.xml          --> ') + esc('<dimen name="mads_heading_hero_size">46sp</dimen>'),
      cm('<!-- res/values-w600dp/dimens.xml   --> ') + esc('<dimen name="mads_heading_hero_size">50sp</dimen>'),
      cm('<!-- res/values-w960dp/dimens.xml   --> ') + esc('<dimen name="mads_heading_hero_size">81sp</dimen>'),
      cm('<!-- res/values-w1430dp/dimens.xml  --> ') + esc('<dimen name="mads_heading_hero_size">120sp</dimen>'),
      '',
      cm('<!-- Use: android:textAppearance="@style/TextAppearance.Mads.Heading.Default"'),
      cm('     and android:accessibilityHeading="true" on the view -->')
    ]
  };
  Object.entries(code).forEach(([k, lines]) => {
    const el = document.querySelector(`#heading-code-${k} code`);
    if (el) el.innerHTML = lines.join('\n');
  });
})();

/* ===== mads.text — specimens, table and platform code ===== */
(() => {
  const TEXT = [
    { name: 'small',   size: 11, lh: 16, apple: 'caption2',
      sample: 'Footnote: spacing values are the same number in px, pt and dp. Updated 4 October 2026.' },
    { name: 'default', size: 13, lh: 20, apple: 'footnote',
      sample: 'Spacing sits on an 8px grid. When no step fits, use a multiple of 4px. Every token has one exact name, so a person or an agent can point to it.' },
    { name: 'large',   size: 15, lh: 24, apple: 'subheadline',
      sample: 'Spacing sits on an 8px grid. When no step fits, use a multiple of 4px. Every token has one exact name, so a person or an agent can point to it.' },
    { name: 'xlarge',  size: 17, lh: 28, apple: 'body',
      sample: 'Spacing sits on an 8px grid. When no step fits, use a multiple of 4px. Every token has one exact name, so a person or an agent can point to it.' }
  ];
  const rem = px => `${px / 16}rem`;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cm = s => `<span class="dsd-cm">${esc(s)}</span>`;
  const cap = s => s[0].toUpperCase() + s.slice(1);

  const box = document.getElementById('text-specimens');
  const rows = document.getElementById('text-rows');
  if (!box || !rows) return;

  box.innerHTML = TEXT.map(t => `
    <div class="dsd-text-row">
      <div class="dsd-text-meta">
        <span class="dsd-tok">mads.text.${t.name}</span>
        <span class="dsd-val">${t.size} / ${t.lh}</span>
      </div>
      <p class="dsd-text-sample" contenteditable="true" spellcheck="false" id="text-sample-${t.name}"
         aria-label="mads.text.${t.name} sample, editable"
         style="font: var(--mads-text-${t.name}); --lh: var(--mads-text-${t.name}-line-height)">${esc(t.sample)}</p>
    </div>`).join('');

  rows.innerHTML = TEXT.map(t => `
    <tr>
      <td><span class="dsd-tok">mads.text.${t.name}</span><span class="dsd-sub">.mads-text-${t.name}</span></td>
      <td><span class="dsd-val">${t.size} / ${t.lh}</span></td>
      <td><span class="dsd-val">${rem(t.size)} / ${rem(t.lh)}</span><span class="dsd-sub">--mads-text-${t.name}</span></td>
      <td><span class="dsd-val">${t.size}pt / ${t.lh}pt</span><span class="dsd-sub">.madsText(.${t.name}) · scales with .${t.apple}</span></td>
      <td><span class="dsd-val">${t.size}sp / ${t.lh}sp</span><span class="dsd-sub">MadsText.${t.name} · TextAppearance.Mads.${cap(t.name)}</span></td>
    </tr>`).join('');

  const toggle = document.getElementById('text-grid-toggle');
  if (toggle) toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', on);
    box.classList.toggle('show-grid', on);
  });

  const code = {
    css: [
      cm('/* mads.text — font size / line height. 1rem = 16px */'),
      ':root {',
      ...TEXT.flatMap(t => [
        `  --mads-text-${t.name}-size: ${rem(t.size)};`.padEnd(45) + cm(`/* ${t.size}px */`),
        `  --mads-text-${t.name}-line-height: ${rem(t.lh)};`.padEnd(45) + cm(`/* ${t.lh}px */`)
      ]),
      '',
      '  ' + cm('/* Shorthands: font: var(--mads-text-default) */'),
      ...TEXT.map(t => `  --mads-text-${t.name}: 400 var(--mads-text-${t.name}-size)/var(--mads-text-${t.name}-line-height) var(--mads-font-body);`),
      '}',
      '',
      ...TEXT.map(t => `.mads-text-${t.name} { font: var(--mads-text-${t.name}); }`),
    ],
    swift: [
      'import SwiftUI',
      'import UIKit',
      '',
      cm('/// mads.text — size and line height in pt. Uses MadsFont from mads.font.'),
      cm('/// Each style scales with the Apple text style of the same default size.'),
      'public enum MadsText: CaseIterable {',
      '    case small, `default`, large, xlarge',
      '',
      '    public var size: CGFloat {',
      '        switch self {',
      ...TEXT.map(t => `        case .${t.name === 'default' ? '`default`' : t.name}: ${t.size}`),
      '        }',
      '    }',
      '',
      '    public var lineHeight: CGFloat {',
      '        switch self {',
      ...TEXT.map(t => `        case .${t.name === 'default' ? '`default`' : t.name}: ${t.lh}`),
      '        }',
      '    }',
      '',
      '    public var appleStyle: Font.TextStyle {',
      '        switch self {',
      ...TEXT.map(t => `        case .${t.name === 'default' ? '`default`' : t.name}: .${t.apple}`),
      '        }',
      '    }',
      '}',
      '',
      'public extension View {',
      '    ' + cm('/// .madsText(.default) — body font. Pass MadsFont.mono for labels.'),
      '    func madsText(_ style: MadsText, font: ((CGFloat, Font.Weight, Font.TextStyle) -> Font)? = nil) -> some View {',
      '        modifier(MadsTextModifier(style: style, font: font))',
      '    }',
      '}',
      '',
      'private struct MadsTextModifier: ViewModifier {',
      '    let style: MadsText',
      '    let font: ((CGFloat, Font.Weight, Font.TextStyle) -> Font)?',
      '    @ScaledMetric private var scale: CGFloat = 1',
      '',
      '    func body(content: Content) -> some View {',
      '        let make = font ?? { MadsFont.body($0, weight: $1, relativeTo: $2) }',
      '        let size = style.size * scale',
      '        let natural = (UIFont(name: "Onest", size: size) ?? .systemFont(ofSize: size)).lineHeight',
      '        let extra = max(0, style.lineHeight * scale - natural)',
      '        return content',
      '            .font(make(style.size, .regular, style.appleStyle))',
      '            .lineSpacing(extra)',
      '            .padding(.vertical, extra / 2)',
      '    }',
      '}',
      '',
      cm('// Text("Updated 4 October 2026").madsText(.small)')
    ],
    compose: [
      'import androidx.compose.ui.text.TextStyle',
      'import androidx.compose.ui.text.font.FontWeight',
      'import androidx.compose.ui.text.style.LineHeightStyle',
      'import androidx.compose.ui.unit.sp',
      '',
      cm('/** mads.text — size and line height in sp. Uses MadsFont from mads.font. */'),
      'private fun madsText(size: Int, lineHeight: Int) = TextStyle(',
      '    fontFamily = MadsFont.body,',
      '    fontWeight = FontWeight.Normal,',
      '    fontSize = size.sp,',
      '    lineHeight = lineHeight.sp,',
      '    lineHeightStyle = LineHeightStyle(',
      '        alignment = LineHeightStyle.Alignment.Center,',
      '        trim = LineHeightStyle.Trim.None',
      '    )',
      ')',
      '',
      'object MadsText {',
      ...TEXT.map(t => `    val ${t.name} = madsText(${t.size}, ${t.lh})`),
      '}',
      '',
      cm('// Text("Updated 4 October 2026", style = MadsText.small)')
    ],
    xml: [
      cm('<!-- res/values/mads_text.xml — mads.text. android:lineHeight needs API 28+ -->'),
      esc('<resources>'),
      ...TEXT.flatMap(t => [
        esc(`    <style name="TextAppearance.Mads.${cap(t.name)}" parent="">`),
        esc(`        <item name="android:fontFamily">@font/mads_body</item>`),
        esc(`        <item name="android:textSize">${t.size}sp</item>`),
        esc(`        <item name="android:lineHeight">${t.lh}sp</item>`),
        esc('    </style>')
      ]),
      esc('</resources>'),
      '',
      cm('<!-- Use: android:textAppearance="@style/TextAppearance.Mads.Default" -->')
    ]
  };
  Object.entries(code).forEach(([k, lines]) => {
    const el = document.querySelector(`#text-code-${k} code`);
    if (el) el.innerHTML = lines.join('\n');
  });
})();

/* ===== mads.space — single source of truth for the table and the platform code ===== */
(() => {
  const SPACE = [0, 4, 8, 16, 32, 64, 128, 256, 512];
  const rem = px => px === 0 ? '0' : `${px / 16}rem`;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const table = document.querySelector('.dsd-space-table');
  const tbody = document.getElementById('dsd-space-rows');
  if (!table || !tbody) return;

  tbody.innerHTML = SPACE.map((px, i) => `
    <tr>
      <td><span class="dsd-tok">mads.space.${i}</span><span class="dsd-sub">--mads-space-${i}</span></td>
      <td><span class="dsd-val">${px}px</span><span class="dsd-sub">${rem(px)}</span></td>
      <td><span class="dsd-val">${px}pt</span><span class="dsd-sub">MadsSpace.s${i}</span></td>
      <td><span class="dsd-val">${px}dp</span><span class="dsd-sub">@dimen/mads_space_${i}</span></td>
      <td><div class="dsd-ruler"><div class="dsd-bar${px === 0 ? ' is-zero' : ''}" data-px="${px}" style="--w: var(--mads-space-${i})"></div></div></td>
    </tr>`).join('');

  /* Fade the end of bars wider than their column, so 256 and 512 read as "continues" */
  const bars = [...tbody.querySelectorAll('.dsd-bar')];
  const markClipped = () => bars.forEach(b => {
    const want = parseFloat(getComputedStyle(document.documentElement).fontSize) * (+b.dataset.px / 16);
    b.classList.toggle('is-clipped', b.getBoundingClientRect().width + 1 < want);
  });
  markClipped();
  window.addEventListener('resize', markClipped);

  /* Grow the bars once on load; they are fully drawn if this never runs */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    table.classList.add('is-pending');
    requestAnimationFrame(() => requestAnimationFrame(() => table.classList.remove('is-pending')));
  }

  const cm = s => `<span class="dsd-cm">${esc(s)}</span>`;
  const code = {
    css: [
      cm('/* mads.space — 8px major grid, 4px minor grid. 1rem = 16px */'),
      ':root {',
      ...SPACE.map((px, i) => `  --mads-space-${i}: ${rem(px)};`.padEnd(28) + cm(`/* ${px}px */`)),
      '}'
    ],
    swift: [
      'import CoreGraphics',
      '',
      cm('/// mads.space — 1 web px = 1 pt'),
      'public enum MadsSpace {',
      ...SPACE.map((px, i) => `    public static let s${i}: CGFloat = ${px}`),
      '}'
    ],
    compose: [
      'import androidx.compose.ui.unit.dp',
      '',
      cm('/** mads.space — 1 web px = 1 dp */'),
      'object MadsSpace {',
      ...SPACE.map((px, i) => `    val s${i} = ${px}.dp`),
      '}'
    ],
    xml: [
      cm('<!-- res/values/mads_space.xml — mads.space, 1 web px = 1 dp -->'),
      esc('<resources>'),
      ...SPACE.map((px, i) => esc(`    <dimen name="mads_space_${i}">${px}dp</dimen>`)),
      esc('</resources>')
    ]
  };
  Object.entries(code).forEach(([k, lines]) => {
    const el = document.querySelector(`#space-code-${k} code`);
    if (el) el.innerHTML = lines.join('\n');
  });

  /* Tabs */
  document.querySelectorAll('[data-tabs]').forEach(box => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const select = (t, focus) => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', on);
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
    const copy = box.querySelector('.dsd-copy');
    if (copy) copy.addEventListener('click', () => {
      const pre = box.querySelector('pre:not([hidden])');
      const text = pre.textContent;
      const done = msg => { copy.textContent = msg; setTimeout(() => copy.textContent = 'Copy', 1600); };
      const fallback = () => {
        const r = document.createRange(); r.selectNodeContents(pre);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        done('Selected');
      };
      try { navigator.clipboard.writeText(text).then(() => done('Copied'), fallback); } catch (e) { fallback(); }
    });
  });
})();

(() => {
  const root = document.getElementById('dsd-root');
  if (!root || !('IntersectionObserver' in window)) return;
  const links = new Map([...root.querySelectorAll('.dsd-index a')].map(a => [a.hash.slice(1), a]));
  const sections = [...root.querySelectorAll('.dsd-cat')];

  const setActive = (id) => {
    links.forEach((a, key) => a.setAttribute('aria-current', key === id ? 'true' : 'false'));
    sections.forEach(s => s.classList.toggle('is-active', s.id === id));
  };

  const io = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) setActive(visible[0].target.id);
  }, { rootMargin: '-20% 0px -60% 0px' });

  sections.forEach(s => io.observe(s));
  setActive(location.hash.slice(1) || sections[0].id);
})();

/* ===== Collapsible code panels (collapsed by default; choice remembered on this device) ===== */
(() => {
  const KEY = 'mads-doc-code-open';
  let open = {};
  try { open = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(open)); } catch (e) {} };
  const chevron = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  document.querySelectorAll('.dsd-code').forEach((box, i) => {
    const bar = box.querySelector('.dsd-code-bar');
    const pres = [...box.querySelectorAll(':scope > pre')];
    const id = box.closest('.dsd-cat')?.id || `code-${i}`;
    const platforms = [...bar.querySelectorAll('[role="tab"]')].map(t => t.textContent.trim()).join(', ');

    const body = document.createElement('div');
    body.className = 'dsd-code-body';
    body.id = `${id}-code-body`;
    const inner = document.createElement('div');
    inner.className = 'dsd-code-inner';
    pres.forEach(p => inner.appendChild(p));
    body.appendChild(inner);
    box.appendChild(body);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dsd-code-toggle';
    btn.setAttribute('aria-controls', body.id);
    btn.innerHTML = `${chevron}<span>Code</span>`;
    const sep = document.createElement('span');
    sep.className = 'dsd-code-sep';
    sep.setAttribute('aria-hidden', 'true');
    const hint = document.createElement('span');
    hint.className = 'dsd-code-hint';
    hint.textContent = platforms;
    bar.prepend(btn, hint, sep);

    const set = (on) => {
      box.classList.toggle('is-collapsed', !on);
      btn.setAttribute('aria-expanded', on);
      btn.setAttribute('aria-label', on ? `Hide ${id} code` : `Show ${id} code`);
      body.inert = !on;
    };
    set(!!open[id]);
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-expanded') !== 'true';
      set(on); open[id] = on; save();
    });
  });
})();
