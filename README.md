# MA Design System (MADS)

A design system for consistent, animated interfaces across web, iOS and Android. Every token has one exact name, for example `mads.space.4` or `mads.color.neon-pink`, so people and AI agents can refer to it without ambiguity.

## What's in this folder

```
MADS/
├── css/
│   └── mads.css             All tokens and component styles. The one stylesheet every MADS page and website uses
├── components/              Astro components for the web (see "Use MADS in an Astro project")
│   ├── icons.js             The shapes of the seven icons. The only place they live
│   ├── colors.js            Turns colour names ('amber-gold', 'text-azure-blue') into MADS variables
│   ├── Icon.astro           mads.icon
│   ├── Button.astro         mads.button: primary, secondary or ghost; a link or a button
│   ├── IconButton.astro     mads.button.icon and mads.button.round
│   ├── Card.astro           mads.card
│   ├── CompactCard.astro    mads.card.compact
│   ├── SelectableCard.astro mads.card.selectable
│   ├── Stat.astro           mads.stat
│   ├── Chip.astro           mads.chip and mads.chip.location
│   ├── Tag.astro            mads.tag
│   ├── Progress.astro       mads.progress
│   ├── DiamondList.astro    mads.list.diamond
│   ├── Quote.astro          mads.quote
│   ├── Popover.astro        mads.popover: a round button that opens a floating card
│   ├── PopoverRow.astro     One row of a popover card: a label and a control
│   ├── IdeasMenu.astro      The Ideas menu (mads.icon.ideas and a card of links)
│   ├── SettingsMenu.astro   The Settings menu (mads.icon.settings and a card of rows)
│   ├── ThemeToggle.astro    mads.toggle.theme
│   ├── ThemeInit.astro      Applies the saved light or dark choice before the page paints
│   ├── LanguageSwitch.astro mads.language.switch
│   ├── popover.js           What the popovers do (open, close, one at a time)
│   └── theme.js             What the theme toggle does
├── reference/               The design system reference page
│   ├── Reference.astro      The page, built from the files above
│   ├── tokens.js            Reads every token value from css/mads.css for the page's tables, specimens and code
│   ├── Samples.astro        The live samples, made with the components
│   ├── reference.css        The page's own layout and showcases
│   ├── body.html            The sections (<!-- MADS:SAMPLE name --> marks where a sample goes)
│   └── reference.js         Samples and the code panels
├── src/pages/index.astro    Shows the reference when you run this folder as a site
├── tokens/
│   └── mads-tokens.json     Every token and its value, with light and dark values for theme roles
├── icons/                   The seven MADS icons as SVG files
├── scripts/check-icons.mjs  Checks the SVG files still match components/icons.js
├── scripts/check-tokens.mjs Checks tokens/mads-tokens.json still matches css/mads.css
├── package.json             Makes this folder the @maadan/mads package
└── README.md                This file
```

**One source for everything.** The reference page loads `css/mads.css` and its samples are made with the same components a website uses, so a change you check on the reference is the change miguel-adan.com gets. For example, the Ideas glow lives in `css/mads.css` and the bulb's markup lives in `Icon.astro`: change either and both the reference and the website change.

## View the design system

You need Node.js ([nodejs.org](https://nodejs.org), or `brew install node`). In this folder, run once:

```
npm install
```

Then:

```
npm run dev
```

and open the address it prints (usually <http://localhost:4321>). The page updates as you save changes. `npm run build:reference` writes a static copy to `dist/`. (It isn't called `build` on purpose: npm would then try to build the package every time a website installs it from GitHub.)

- **Light and dark mode.** The page follows your device setting. The switch in the Settings menu changes it, and the browser remembers your choice.
- **Code.** Each section has a collapsed Code panel with CSS, Swift, Compose and Android XML tabs and a Copy button.

miguel-adan.com publishes this same page at [/mads/](https://www.miguel-adan.com/mads/index.html), from the version of MADS the site is built with.

## Fonts

MADS uses three fonts from Google Fonts: **Unbounded** (headings), **Onest** (text) and **JetBrains Mono** (labels and code).

- **Online**, the reference page loads them from Google Fonts automatically.
- **Offline**, or where Google Fonts is blocked, the page falls back to fonts already on the device: Arial Rounded or Trebuchet MS for headings, Segoe UI or the system font for text, and SF Mono, Menlo or Consolas for labels. The layout is designed to work with these.

To make the fonts work offline too, download the three families from [fonts.google.com](https://fonts.google.com), put the font files in a `fonts/` folder and add `@font-face` rules for them. All three are free under the SIL Open Font License.

## Use MADS in a web project

1. Load the fonts in your page's `<head>`:

   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Onest:wght@100..900&family=Unbounded:wght@200..900&display=swap">
   ```

2. Add the stylesheet:

   ```html
   <link rel="stylesheet" href="css/mads.css">
   ```

3. Use the tokens and components:

   ```html
   <body style="background: var(--mads-theme-background); color: var(--mads-theme-text)">
     <h1 style="font: var(--mads-heading-xxlarge)">Lorem <span class="mads-text-gradient">ipsum</span></h1>
     <button class="mads-button">Lorem ipsum</button>
     <button class="mads-button-secondary">Dolor sit</button>
   </body>
   ```

**Dark mode** follows the device. To let people choose, set `data-theme="dark"` or `data-theme="light"` on the `<html>` element. In an Astro project, `ThemeToggle.astro` and `ThemeInit.astro` do this for you; elsewhere, `components/theme.js` is the script the switch needs.

**Components in `mads.css`:** primary, secondary, ghost, icon and round buttons; the theme toggle; cards, compact cards, selectable cards and stats; chips, location chips and tags; progress bars; the diamond list and quote; gradient text, gradient frames and the ambient glow; the icon style; the scroll reveal; the popover (Ideas and Settings menus); and the language switch.

## Use MADS in an Astro project

Add the package, pinned to a version (a tag) so the site only changes when you choose:

```
npm install github:MAAdan/MADS#0.8.0
```

Then load the stylesheet once (in a layout) and use the components:

```astro
---
import '@maadan/mads/css/mads.css';
import ThemeInit from '@maadan/mads/components/ThemeInit.astro';
import IdeasMenu from '@maadan/mads/components/IdeasMenu.astro';
import SettingsMenu from '@maadan/mads/components/SettingsMenu.astro';
import PopoverRow from '@maadan/mads/components/PopoverRow.astro';
import ThemeToggle from '@maadan/mads/components/ThemeToggle.astro';
import Icon from '@maadan/mads/components/Icon.astro';
---
<head>… <ThemeInit /></head>

<IdeasMenu links={[{ href: '/mads/', text: 'MA Design System (MADS)' }]} />
<SettingsMenu>
  <PopoverRow label="Toggle to dark or light mode"><ThemeToggle /></PopoverRow>
</SettingsMenu>
<Icon name="chevron-right" size={16} />
```

Each component file starts with a short note on what it does and the options it takes. To show the whole reference on a site, render `@maadan/mads/reference/Reference.astro` on a page of its own, as miguel-adan.com does at `/mads/`.

**Publishing a new version.** Commit and push your changes, bump `version` in `package.json`, and tag the commit with the same number, without a "v" like the earlier versions (for example `git tag 0.8.1 && git push origin main 0.8.1`). Websites move to it with `npm install github:MAAdan/MADS#0.8.1`.

**Tokens.** `css/mads.css` is the one place token values live. The reference page reads them from it when it's built (`reference/tokens.js`): the tables, specimens and Code panels for spacing, text, headings, labels, colours, themes, radii, gradients, shadows and motion all follow it, and a new token appears there by itself (its description goes in the `…_META` lists in `reference/reference.js`). The build stops if the stylesheet is inconsistent, for example if the two copies of the dark theme disagree. After changing a token, update `tokens/mads-tokens.json` to match; `npm run check:tokens` lists any difference.

**Icons.** Change an icon's shape in `components/icons.js`, then update its SVG file in `icons/` to match. `npm run check:icons` lists any file that no longer matches.

## Use MADS on iOS and Android

Copy the code from the Swift, Compose or Android XML tab of each section of the reference page. The sections build on each other (for example, buttons use `MadsColor`, `MadsText` and `MadsSpace`), so start with the foundations: Spacing, Fonts, Text, Headings, Labels, Colours and Themes.

Units are the same number on every platform: **1 web px = 1 iOS pt = 1 Android dp**, with text in **sp** on Android.

## Token naming

| Written as | Example |
|---|---|
| Token name, for people and agents | `mads.heading.xlarge` |
| CSS variable | `--mads-heading-xlarge` |
| Swift and Compose | `MadsHeading.xlarge` |
| Android XML | `@style/TextAppearance.Mads.Heading.Xlarge` |

`tokens/mads-tokens.json` lists every CSS variable by category with its value. Theme roles, such as `--mads-theme-text`, have a `light` and a `dark` value.

## Categories

**Foundations:** Spacing, Fonts, Text, Headings, Labels, Colours, Themes, Shape and depth, Gradients, Motion, Icons.

**Components:** Buttons, Toggles, Popovers (the Ideas and Settings menus, and the language switch), Cards, Chips and tags, Progress, Lists and quotes.
