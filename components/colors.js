/* Turns a MADS colour name into the CSS value the components put in their style attribute:
     'amber-gold'            → var(--mads-color-amber-gold)          (mads.color)
     'text-azure-blue'       → var(--mads-theme-text-azure-blue)     (mads.theme, changes with light and dark mode)
     'gradient-violet-azure' → var(--mads-gradient-violet-azure)     (mads.gradient)
   Anything that's already CSS (var(…), #hex, rgb(…), …) is used as it is. */
export const madsColor = value => {
  if (!value) return undefined;
  if (/^(var\(|#|rgb|hsl|color-mix|linear-gradient|radial-gradient)/.test(value)) return value;
  if (value.startsWith('text-')) return `var(--mads-theme-${value})`;
  if (value.startsWith('gradient-')) return `var(--mads-${value})`;
  return `var(--mads-color-${value})`;
};

/* A gradient name for a progress fill: 'violet-azure' or 'gradient-violet-azure' → var(--mads-gradient-violet-azure) */
export const madsGradient = value => !value ? undefined : madsColor(/^(var\(|linear|radial)/.test(value) || value.startsWith('gradient-') ? value : `gradient-${value}`);
