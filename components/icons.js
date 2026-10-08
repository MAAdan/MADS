/* The MADS icons: one path each on a 24px grid, drawn as a single 3.5 stroke (see .mads-icon in css/mads.css).
 * This file is the only place the shapes live. Icon.astro, the reference page and icons/*.svg
 * (npm run icons) all read from it, so change an icon here and every user of it changes. */
export const icons = {
  'chevron-up': { name: 'Chevron up', token: 'mads.icon.chevron.up', file: 'mads-icon-chevron-up.svg', d: 'M5 14.5 12 9.5 19 14.5' },
  'chevron-down': { name: 'Chevron down', token: 'mads.icon.chevron.down', file: 'mads-icon-chevron-down.svg', d: 'M5 9.5 12 14.5 19 9.5' },
  'chevron-left': { name: 'Chevron left', token: 'mads.icon.chevron.left', file: 'mads-icon-chevron-left.svg', d: 'M14.5 5 9.5 12 14.5 19' },
  'chevron-right': { name: 'Chevron right', token: 'mads.icon.chevron.right', file: 'mads-icon-chevron-right.svg', d: 'M9.5 5 14.5 12 9.5 19' },
  'home': { name: 'Home', token: 'mads.icon.home', file: 'mads-icon-home.svg', d: 'M19 19.5V9.5L12 4.5 5 9.5V19.5Z' },
  'settings': { name: 'Settings', token: 'mads.icon.settings', file: 'mads-icon-settings.svg', d: 'M10.67 4.62L13.33 4.62L13.82 6.71A5.6 5.6 0 0 1 15.67 7.77L17.73 7.16L19.06 9.46L17.5 10.93A5.6 5.6 0 0 1 17.5 13.07L19.06 14.54L17.73 16.84L15.67 16.23A5.6 5.6 0 0 1 13.82 17.29L13.33 19.38L10.67 19.38L10.18 17.29A5.6 5.6 0 0 1 8.33 16.23L6.27 16.84L4.94 14.54L6.5 13.07A5.6 5.6 0 0 1 6.5 10.93L4.94 9.46L6.27 7.16L8.33 7.77A5.6 5.6 0 0 1 10.18 6.71ZM12 12h.01' },
  'ideas': { name: 'Ideas', token: 'mads.icon.ideas', file: 'mads-icon-ideas.svg', d: 'm 11.999998,4.4277091 c -2.6312483,-3.85e-4 -4.764393,2.1327595 -4.7640085,4.764008 2.151e-4,1.6913069 0.8972603,3.2556649 2.3568545,4.1101249 -0.00774,0.05709 -0.014348,0.113205 -0.014348,0.172452 v 0.522255 c 0,0.716134 0.57726,1.293397 1.293395,1.293397 h 2.24907 c 0.716135,0 1.293399,-0.577263 1.293399,-1.293397 v -0.522255 c 0,-0.05925 -0.0067,-0.115366 -0.01434,-0.172452 1.462339,-0.852662 2.362293,-2.417357 2.363991,-4.1101249 3.84e-4,-2.6312483 -2.13276,-4.7643926 -4.764008,-4.764008 z M 10.196431,19.572291 h 3.599948 z', glow: true },
};

/* mads.icon.ideas default motion: a solid AmberGold circle at 50% alpha that grows from the bulb centre, then fades out (css/mads.css) */
export const glow = { cx: 12, cy: 9.19, r: 10 };
