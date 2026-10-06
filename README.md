# MA Design System (MADS)

A design system for consistent, animated interfaces across web, iOS and Android. Every token has one exact name, for example `mads.space.4` or `mads.color.neon-pink`, so people and AI agents can refer to it without ambiguity.

## What's in this folder

```
deliverable/
├── index.html               The full design system reference. Open it in any browser.
├── css/
│   └── mads.css             All tokens and component styles, ready to use in a web project
├── tokens/
│   └── mads-tokens.json     Every token and its value, with light and dark values for theme roles
├── icons/                   The five MADS icons as clean SVG files
│   ├── mads-icon-chevron-up.svg
│   ├── mads-icon-chevron-down.svg
│   ├── mads-icon-chevron-left.svg
│   ├── mads-icon-chevron-right.svg
│   └── mads-icon-home.svg
└── README.md                This file
```

## View the design system

Double-click `index.html`. It needs no server and no build step. Everything it shows is inside that one file: the samples, the animations, and the code for web, iOS and Android in each section.

- **Light and dark mode.** The page follows your device setting. The switch at the top changes it, and the browser remembers your choice.
- **Code.** Each section has a collapsed Code panel with CSS, Swift, Compose and Android XML tabs and a Copy button.

To publish it on your website, upload `index.html` (and the `icons` folder for the browser-tab icon) to any folder on your site.

## Fonts

MADS uses three fonts from Google Fonts: **Unbounded** (headings), **Onest** (text) and **JetBrains Mono** (labels and code).

- **Online**, `index.html` loads them from Google Fonts automatically.
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

**Dark mode** follows the device. To let people choose, set `data-theme="dark"` or `data-theme="light"` on the `<html>` element. The Toggles section of `index.html` has the switch and the few lines of script it needs.

**Components in `mads.css`:** primary, secondary, ghost and icon buttons; the theme toggle; cards, compact cards, selectable cards and stats; chips, location chips and tags; progress bars; the diamond list and quote; gradient text, gradient frames and the ambient glow; the icon style; and the scroll reveal.

## Use MADS on iOS and Android

Copy the code from the Swift, Compose or Android XML tab of each section in `index.html`. The sections build on each other (for example, buttons use `MadsColor`, `MadsText` and `MadsSpace`), so start with the foundations: Spacing, Fonts, Text, Headings, Labels, Colours and Themes.

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

**Components:** Buttons, Toggles, Cards, Chips and tags, Progress, Lists and quotes.
