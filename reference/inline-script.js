/* Wraps code in a script tag for set:html. It lives in a .js file on purpose: Vite scans the text of .astro files
   for script tags before it starts, so a tag written inside an expression there is mistaken for real code. */
export const inlineScript = code => '<' + 'script>\n' + code + '\n</' + 'script>';
